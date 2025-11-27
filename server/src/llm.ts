import OpenAI from 'openai';
import { HttpsProxyAgent } from 'https-proxy-agent';

export interface LLMPayload {
  mode: string;
  systemPrompt: string;
  context: string;
  userPrompt: string;
  options: {
    temperature: number;
    maxTokens: number;
  };
}

export interface LLMConfig {
  apiKey: string;
  baseURL: string;
  model: string;
  maxContextChars: number;
  proxyUrl?: string;
}

let openaiClient: OpenAI | null = null;

export function initializeLLM(config: LLMConfig): void {
  const options: ConstructorParameters<typeof OpenAI>[0] = {
    apiKey: config.apiKey,
    baseURL: config.baseURL,
  };

  // Add proxy if configured
  if (config.proxyUrl) {
    const proxyAgent = new HttpsProxyAgent(config.proxyUrl);
    options.httpAgent = proxyAgent;
    console.log(`[LLM] Using proxy: ${config.proxyUrl}`);
  }

  openaiClient = new OpenAI(options);
}

export async function callLLM(payload: LLMPayload, config: LLMConfig): Promise<string> {
  if (!openaiClient) {
    throw new Error('LLM client not initialized');
  }

  // Double-check context length
  let context = payload.context;
  if (context.length > config.maxContextChars) {
    context = context.substring(0, config.maxContextChars);
    console.log(`Context truncated to ${config.maxContextChars} characters`);
  }

  // Build messages array
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: payload.systemPrompt,
    },
  ];

  // Add context as a separate system message for clarity
  if (context.trim()) {
    messages.push({
      role: 'system',
      content: `Контекст документа:\n\n${context}`,
    });
  }

  // Add user message
  const userContent = payload.userPrompt.trim() 
    ? payload.userPrompt 
    : getDefaultUserPrompt(payload.mode);
  
  messages.push({
    role: 'user',
    content: userContent,
  });

  console.log(`[LLM] Mode: ${payload.mode}, Context: ${context.length} chars, Model: ${config.model}`);

  try {
    const completion = await openaiClient.chat.completions.create({
      model: config.model,
      messages,
      temperature: payload.options.temperature,
      max_tokens: payload.options.maxTokens,
    });

    const answer = completion.choices[0]?.message?.content;
    if (!answer) {
      throw new Error('Empty response from LLM');
    }

    console.log(`[LLM] Response received: ${answer.length} chars`);
    return answer;
  } catch (error) {
    console.error('[LLM] Error:', error);
    throw error;
  }
}

function getDefaultUserPrompt(mode: string): string {
  switch (mode) {
    case 'rewrite':
      return 'Переформулируй текст';
    case 'compress':
      return 'Сократи текст';
    case 'expand':
      return 'Расширь текст';
    case 'summarize':
      return 'Сделай резюме текста';
    case 'generate_section':
      return 'Сгенерируй раздел';
    default:
      return 'Обработай текст';
  }
}

