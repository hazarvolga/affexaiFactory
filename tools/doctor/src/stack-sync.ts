import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT, listWorkspacePackages } from './workspace.js';

export async function stackSyncCheck(): Promise<{
  name: string;
  ok: boolean;
  errors: string[];
  warnings: string[];
}> {
  const errors: string[] = [];
  const warnings: string[] = [];

  const stackPath = join(REPO_ROOT, 'standards', 'STACK.md');
  let stackContent = '';
  try {
    stackContent = readFileSync(stackPath, 'utf8');
  } catch {
    warnings.push('standards/STACK.md not found, skipping check');
    return { name: 'stack-sync', ok: true, errors, warnings };
  }

  const packages = listWorkspacePackages();
  const corePackages = packages.filter((p) => p.relDir.startsWith('packages/'));

  for (const pkg of corePackages) {
    if (!pkg.layer) continue;
    if (!stackContent.includes(pkg.name)) {
      warnings.push(`${pkg.name}: not mentioned in standards/STACK.md`);
    }
  }

  return {
    name: 'stack-sync',
    ok: errors.length === 0,
    errors,
    warnings,
  };
}
