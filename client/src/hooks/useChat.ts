import { useState, useCallback, useRef } from 'react';
import { Message, Mode, Settings, DEFAULT_SETTINGS } from '../types';
import { sendLLMRequest, LLMClientError } from '../api/llmClient';
import { buildPayload, formatContextInfo } from '../utils/prompts';
import { 
  getSelectedText, 
  getContextAroundSelection, 
  replaceSelectionWithText,
  insertTextAtCursor,
  hasSelection 
} from '../office/wordApi';

interface UseChatOptions {
  settings: Settings;
}

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (
    mode: Mode,
    userPrompt: string,
    useSelection: boolean,
    replaceSelection: boolean
  ) => Promise<void>;
  stopRequest: () => void;
  clearMessages: () => void;
  clearError: () => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function useChat({ settings }: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const clearError = useCallback(() => setError(null), []);
  const clearMessages = useCallback(() => setMessages([]), []);

  const stopRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (
    mode: Mode,
    userPrompt: string,
    useSelection: boolean,
    replaceSelection: boolean
  ) => {
    setError(null);
    setIsLoading(true);

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      // Get context from document
      let context: string;
      let isSelection = false;

      if (useSelection) {
        const hasSelectedText = await hasSelection();
        if (hasSelectedText) {
          context = await getSelectedText(settings.maxContextChars);
          isSelection = true;
        } else {
          context = await getContextAroundSelection(settings.maxContextChars);
        }
      } else {
        context = await getContextAroundSelection(settings.maxContextChars);
      }

      if (!context.trim()) {
        throw new Error('Не удалось получить текст из документа. Откройте документ и попробуйте снова.');
      }

      const contextInfo = formatContextInfo(context, isSelection);

      // Show preview of context being used
      const contextPreview = context.length > 100 
        ? context.substring(0, 100) + '...' 
        : context;

      // Add user message
      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: userPrompt || `[${mode}]`,
        timestamp: Date.now(),
        contextInfo: `${contextInfo}\n«${contextPreview}»`,
      };
      setMessages((prev) => [...prev, userMessage]);

      // Build and send request
      const payload = buildPayload(mode, context, userPrompt, settings);
      const response = await sendLLMRequest(payload, abortControllerRef.current.signal);

      // Add assistant message
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response.answer,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Replace text ONLY if explicitly requested and there was a selection
      if (replaceSelection && isSelection) {
        await replaceSelectionWithText(response.answer);
      }

    } catch (err) {
      if (err instanceof LLMClientError && err.message === 'Request was cancelled') {
        // User cancelled, not an error
        return;
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Произошла неизвестная ошибка';
      setError(errorMessage);
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [settings]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    stopRequest,
    clearMessages,
    clearError,
  };
}

// Settings persistence
const SETTINGS_KEY = 'word-ai-assistant-settings';

export function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

