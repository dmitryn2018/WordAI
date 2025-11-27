# Word AI Assistant

Task Pane Add-in for Microsoft Word with a ChatGPT interface for document work.

![Word AI Assistant](docs/screenshot.png)

## Features

- **Document Chat** — ask questions about document content
- **Rephrase** — rewrite selected text while preserving meaning
- **Compress** — reduce text to 30-50% of original
- **Expand** — add clarifications and details to text
- **Summarize** — create structured document summary
- **Generate Sections** — create new sections from description

## Requirements

- Node.js 18+
- Microsoft Word for Mac (Microsoft 365) or Word Online
- OpenAI API key

## Installation

```bash
# Clone the repository
cd WordAI

# Install dependencies
npm install

# Create .env file in server folder
cp server/env.example server/.env

# Edit .env and add your OpenAI API key
```

### Configuration (server/.env)

```env
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_API_BASE=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
PORT=3001
MAX_CONTEXT_CHARS=8000
```

## Running

```bash
# Start client and server simultaneously
npm run dev

# Or separately:
npm run dev:client  # Frontend at https://localhost:3000
npm run dev:server  # Backend at http://localhost:3001
```

On first client launch, `vite-plugin-mkcert` will automatically create and install an SSL certificate for localhost.

## Sideload in Word for Mac

### Method 1: Via ~/Library/Containers folder (recommended)

1. Close Word
2. Copy the manifest:
   ```bash
   mkdir -p ~/Library/Containers/com.microsoft.Word/Data/Documents/wef
   cp manifest/word-addin-manifest.xml ~/Library/Containers/com.microsoft.Word/Data/Documents/wef/
   ```
3. Open Word
4. Go to: **Insert → Add-ins → My Add-ins**
5. Find "AI Assistant" and activate it

### Method 2: Via developer menu

1. Open Word
2. Go to: **Insert → Add-ins → My Add-ins**
3. Select the **Shared Folder** tab
4. Click **Browse** and select `manifest/word-addin-manifest.xml`

### Method 3: Via Office Online

1. Open Word Online (office.com)
2. Create or open a document
3. **Insert → Add-ins → Manage My Add-ins**
4. **Upload My Add-in** → select `word-addin-manifest.xml`

## Usage

1. Open a document in Word
2. Click the **AI Assistant** button on the Insert ribbon
3. Select the mode from the dropdown
4. Enter your request and click **Send**

### Modes

| Mode | Requires Selection | Description |
|------|-------------------|-------------|
| Document Chat | No | Ask questions about document content |
| Rephrase | Yes | Rewrite selected text |
| Compress | Yes | Reduce text by 50-70% |
| Expand | Yes | Add details and clarifications |
| Summarize | No | Create structured summary |
| Generate Section | No | Create new section from description |

### Options

- **Use selected text** — take context from selection (otherwise from entire document)
- **Replace selected text** — automatically replace selection with result

## Settings

Click ⚙️ in the panel to access settings:

- **LLM Model** — OpenAI model (gpt-4o-mini, gpt-4o, etc.)
- **Max context characters** — text limit for sending to LLM
- **Legal style** — use legal terminology in prompts

## Project Structure

```
WordAI/
├── manifest/
│   └── word-addin-manifest.xml   # Office Add-in manifest
├── client/                        # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/           # UI components
│   │   ├── hooks/                # React hooks
│   │   ├── office/               # Office.js wrappers
│   │   ├── api/                  # HTTP client
│   │   └── utils/                # Prompts and utilities
│   └── vite.config.ts
├── server/                        # Express + TypeScript
│   ├── src/
│   │   ├── index.ts              # HTTP server
│   │   └── llm.ts                # OpenAI integration
│   └── .env                      # Configuration (not in git)
├── config/
│   └── config.example.json       # Example configuration
└── package.json
```

## Troubleshooting

### Certificate not trusted

On first launch, the browser may show a certificate warning. Add an exception or:

```bash
# macOS - trust certificate
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ~/.vite-plugin-mkcert/cert.pem
```

### Add-in not loading

1. Make sure dev server is running (`npm run dev`)
2. Open https://localhost:3000 in browser and accept the certificate
3. Restart Word
4. Check Word console for errors (Cmd+Option+I in Word Online)

### API Error

1. Check `OPENAI_API_KEY` in `server/.env`
2. Check server logs in terminal
3. Make sure the model is available for your API key
