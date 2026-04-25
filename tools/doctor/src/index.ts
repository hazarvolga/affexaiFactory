#!/usr/bin/env node
import kleur from 'kleur';
import { layerCheck } from './layer-check.js';
import { stackSyncCheck } from './stack-sync.js';

interface CheckResult {
  name: string;
  ok: boolean;
  errors: string[];
  warnings: string[];
}

async function main(): Promise<void> {
  const cmd = process.argv[2] ?? 'all';

  const checks: Array<() => Promise<CheckResult>> = [];
  if (cmd === 'all' || cmd === 'layer-check') checks.push(layerCheck);
  if (cmd === 'all' || cmd === 'stack-sync') checks.push(stackSyncCheck);

  if (checks.length === 0) {
    console.error(kleur.red(`unknown command: ${cmd}`));
    console.error('usage: doctor [all|layer-check|stack-sync]');
    process.exit(2);
  }

  console.log(kleur.bold().cyan('\n  doctor\n'));

  let failed = 0;
  for (const check of checks) {
    const result = await check();
    const icon = result.ok ? kleur.green('✓') : kleur.red('✗');
    console.log(`  ${icon} ${result.name}`);
    for (const err of result.errors) console.log(kleur.red(`      ${err}`));
    for (const w of result.warnings) console.log(kleur.yellow(`      ${w}`));
    if (!result.ok) failed++;
  }

  if (failed > 0) {
    console.log(kleur.red(`\n  ${failed} check(s) failed\n`));
    process.exit(1);
  }
  console.log(kleur.green('\n  all checks passed\n'));
}

main().catch((err) => {
  console.error(kleur.red('  doctor crashed:'), err);
  process.exit(2);
});
