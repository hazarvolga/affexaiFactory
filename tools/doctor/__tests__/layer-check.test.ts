import { describe, expect, it } from 'vitest';
import { layerCheck } from '../src/layer-check.js';

describe('layerCheck', () => {
  it('passes on the current Layer 1 setup', async () => {
    const result = await layerCheck();
    if (!result.ok) {
      console.error('layer-check errors:', result.errors);
    }
    expect(result.ok).toBe(true);
  });
});
