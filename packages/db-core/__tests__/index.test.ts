import { describe, expect, it } from 'vitest';
import * as DbCore from '../src/index.js';

describe('@affex/db-core surface', () => {
  it('exports createPrisma and runMigrations', () => {
    expect(typeof DbCore.createPrisma).toBe('function');
    expect(typeof DbCore.runMigrations).toBe('function');
  });
});
