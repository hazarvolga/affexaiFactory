export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  cacheKey?: string;
}

export interface ChatResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
  model: string;
  cached: boolean;
}

export type Provider = 'anthropic' | 'openai';

export interface ProviderConfig {
  provider: Provider;
  apiKey: string;
  baseUrl?: string;
}
