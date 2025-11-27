import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { callLLM, initializeLLM, LLMPayload, LLMConfig } from './llm.js';

// Load environment variables
config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Load SSL certificates from client folder
const certsDir = path.join(process.cwd(), '..', 'client', '.certs');
const sslOptions = {
  key: fs.readFileSync(path.join(certsDir, 'key.pem')),
  cert: fs.readFileSync(path.join(certsDir, 'cert.pem')),
};

// LLM Configuration
const llmConfig: LLMConfig = {
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: process.env.OPENAI_API_BASE || 'https://api.openai.com/v1',
  model: process.env.LLM_MODEL || 'gpt-4o-mini',
  maxContextChars: parseInt(process.env.MAX_CONTEXT_CHARS || '8000', 10),
  proxyUrl: process.env.PROXY_URL || undefined,
};

// Validate API key
if (!llmConfig.apiKey) {
  console.error('ERROR: OPENAI_API_KEY environment variable is not set');
  console.error('Please create a .env file with your API key');
  process.exit(1);
}

// Initialize LLM client
initializeLLM(llmConfig);

// Middleware
app.use(cors({
  origin: ['https://localhost:3000', 'https://127.0.0.1:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    model: llmConfig.model,
    maxContextChars: llmConfig.maxContextChars,
  });
});

// LLM endpoint
app.post('/api/llm', async (req: Request, res: Response) => {
  try {
    const payload = req.body as LLMPayload;

    // Validate payload
    if (!payload.mode) {
      res.status(400).json({ error: 'Missing required field: mode' });
      return;
    }
    if (!payload.systemPrompt) {
      res.status(400).json({ error: 'Missing required field: systemPrompt' });
      return;
    }
    if (payload.context === undefined) {
      res.status(400).json({ error: 'Missing required field: context' });
      return;
    }

    // Set defaults for options
    const options = {
      temperature: payload.options?.temperature ?? 0.3,
      maxTokens: payload.options?.maxTokens ?? 2000,
    };

    const normalizedPayload: LLMPayload = {
      ...payload,
      options,
    };

    console.log(`[API] Processing ${payload.mode} request with ${payload.context.length} chars context`);

    const answer = await callLLM(normalizedPayload, llmConfig);
    
    res.json({ answer });
  } catch (error) {
    console.error('[API] Error processing LLM request:', error);
    
    const message = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = message.includes('API key') ? 401 : 500;
    
    res.status(statusCode).json({ error: message });
  }
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server] Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║          Word AI Assistant - Backend Server            ║
╠════════════════════════════════════════════════════════╣
║  Server running at: https://localhost:${PORT}             ║
║  LLM Model: ${llmConfig.model.padEnd(40)}  ║
║  Max Context: ${String(llmConfig.maxContextChars).padEnd(38)} ║
╚════════════════════════════════════════════════════════╝
  `);
});

