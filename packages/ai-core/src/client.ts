import { createHash } from 'node:crypto';
import { LRUCache } from './cache.js';
import { withRetry, type RetryOptions } from './retry.js';
import type { ChatRequest, ChatResponse, ProviderConfig } from './types.js';

export interface LLMClientOptions {
  config: ProviderConfig;
  cacheSize?: number;
  retry?: RetryOptions;
}

export interface LLMClient {
  chat(req: ChatRequest): Promise<ChatResponse>;
  clearCache(): void;
}

interface AnthropicSdk {
  messages: {
    create(args: {
      model: string;
      max_tokens: number;
      temperature?: number;
      system?: string;
      messages: { role: 'user' | 'assistant'; content: string }[];
    }): Promise<{
      content: { type: string; text?: string }[];
      usage: { input_tokens: number; output_tokens: number };
      model: string;
    }>;
  };
}

interface OpenAISdk {
  chat: {
    completions: {
      create(args: {
        model: string;
        max_tokens?: number;
        temperature?: number;
        messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
      }): Promise<{
        choices: { message: { content: string | null } }[];
        usage?: { prompt_tokens: number; completion_tokens: number };
        model: string;
      }>;
    };
  };
}

function hashRequest(req: ChatRequest): string {
  const stable = JSON.stringify({
    model: req.model,
    messages: req.messages,
    maxTokens: req.maxTokens,
    temperature: req.temperature,
  });
  return createHash('sha256').update(stable).digest('hex');
}

function loadAnthropic(opts: ProviderConfig): AnthropicSdk {
  let mod: { default: new (cfg: { apiKey: string; baseURL?: string }) => AnthropicSdk } | null = null;
  try {
    mod = require('@anthropic-ai/sdk') as typeof mod;
  } catch {
    throw new Error(
      "@affex/ai-core: provider 'anthropic' requires the optional peer dependency '@anthropic-ai/sdk'. Install it: pnpm add @anthropic-ai/sdk",
    );
  }
  return new mod.default({ apiKey: opts.apiKey, baseURL: opts.baseUrl });
}

function loadOpenAI(opts: ProviderConfig): OpenAISdk {
  let mod: { default: new (cfg: { apiKey: string; baseURL?: string }) => OpenAISdk } | null = null;
  try {
    mod = require('openai') as typeof mod;
  } catch {
    throw new Error(
      "@affex/ai-core: provider 'openai' requires the optional peer dependency 'openai'. Install it: pnpm add openai",
    );
  }
  return new mod.default({ apiKey: opts.apiKey, baseURL: opts.baseUrl });
}

export function createLLMClient(opts: LLMClientOptions): LLMClient {
  const cache = new LRUCache<string, ChatResponse>(opts.cacheSize ?? 256);
  const { config } = opts;

  const callAnthropic = async (req: ChatRequest): Promise<ChatResponse> => {
    const sdk = loadAnthropic(config);
    const systemMsg = req.messages.find((m) => m.role === 'system')?.content;
    const conversation = req.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const result = await sdk.messages.create({
      model: req.model,
      max_tokens: req.maxTokens ?? 1024,
      temperature: req.temperature,
      system: systemMsg,
      messages: conversation,
    });

    const text = result.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text ?? '')
      .join('');

    return {
      content: text,
      inputTokens: result.usage.input_tokens,
      outputTokens: result.usage.output_tokens,
      model: result.model,
      cached: false,
    };
  };

  const callOpenAI = async (req: ChatRequest): Promise<ChatResponse> => {
    const sdk = loadOpenAI(config);
    const result = await sdk.chat.completions.create({
      model: req.model,
      max_tokens: req.maxTokens,
      temperature: req.temperature,
      messages: req.messages,
    });
    const choice = result.choices[0];
    return {
      content: choice?.message.content ?? '',
      inputTokens: result.usage?.prompt_tokens ?? 0,
      outputTokens: result.usage?.completion_tokens ?? 0,
      model: result.model,
      cached: false,
    };
  };

  return {
    async chat(req) {
      const key = req.cacheKey ?? hashRequest(req);
      const hit = cache.get(key);
      if (hit) return { ...hit, cached: true };

      const fresh = await withRetry(
        () => (config.provider === 'anthropic' ? callAnthropic(req) : callOpenAI(req)),
        opts.retry,
      );
      cache.set(key, fresh);
      return fresh;
    },
    clearCache() {
      cache.clear();
    },
  };
}
