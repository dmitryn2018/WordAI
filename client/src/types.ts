export type Mode = 
  | 'chat'
  | 'rewrite'
  | 'compress'
  | 'expand'
  | 'summarize'
  | 'generate_section';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  contextInfo?: string;
}

export interface LLMRequestPayload {
  mode: Mode;
  systemPrompt: string;
  context: string;
  userPrompt: string;
  options: {
    temperature: number;
    maxTokens: number;
  };
}

export interface LLMResponse {
  answer: string;
}

export interface Settings {
  llmModel: string;
  maxContextChars: number;
  legalStyleEnabled: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  llmModel: 'gpt-4o-mini',
  maxContextChars: 8000,
  legalStyleEnabled: true,
};

export const MODE_LABELS: Record<Mode, string> = {
  chat: 'Chat по документу',
  rewrite: 'Переформулировать',
  compress: 'Сжать',
  expand: 'Расширить',
  summarize: 'Суммаризировать',
  generate_section: 'Сгенерировать раздел',
};

export const MODE_REQUIRES_SELECTION: Record<Mode, boolean> = {
  chat: false,
  rewrite: true,
  compress: true,
  expand: true,
  summarize: false,
  generate_section: false,
};

