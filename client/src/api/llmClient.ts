import { LLMRequestPayload, LLMResponse } from '../types';

const API_BASE_URL = 'https://localhost:3001';

export class LLMClientError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'LLMClientError';
  }
}

export async function sendLLMRequest(
  payload: LLMRequestPayload,
  abortSignal?: AbortSignal
): Promise<LLMResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/llm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: abortSignal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new LLMClientError(
        errorData.error || `HTTP error ${response.status}`,
        response.status
      );
    }

    const data: LLMResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof LLMClientError) {
      throw error;
    }
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new LLMClientError('Request was cancelled');
      }
      throw new LLMClientError(error.message);
    }
    throw new LLMClientError('Unknown error occurred');
  }
}

