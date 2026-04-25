import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

export type Layer = 'ACTIVE_NOW' | 'OPTIONAL_LATER' | 'SCALE_STAGE' | 'EXPERIMENTAL';

export interface PackageMeta {
  dir: string;
  relDir: string;
  packageJsonPath: string;
  name: string;
  version: string;
  layer: Layer | null;
  dependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

function findRepoRoot(start: string): string {
  let cur = resolve(start);
  while (cur !== '/') {
    if (existsSync(join(cur, 'pnpm-workspace.yaml'))) return cur;
    const parent = dirname(cur);
    if (parent === cur) break;
    cur = parent;
  }
  return resolve(start);
}

export const REPO_ROOT = findRepoRoot(process.cwd());

const WORKSPACE_DIRS = ['apps', 'packages', 'tools', 'templates'];

export function listWorkspacePackages(): PackageMeta[] {
  const packages: PackageMeta[] = [];
  for (const wsDir of WORKSPACE_DIRS) {
    const wsAbs = join(REPO_ROOT, wsDir);
    if (!safeIsDir(wsAbs)) continue;
    for (const entry of readdirSync(wsAbs)) {
      const dir = join(wsAbs, entry);
      if (!safeIsDir(dir)) continue;
      const pkgPath = join(dir, 'package.json');
      if (!safeIsFile(pkgPath)) continue;
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
        packages.push({
          dir,
          relDir: `${wsDir}/${entry}`,
          packageJsonPath: pkgPath,
          name: pkg.name,
          version: pkg.version,
          layer: pkg.affex?.layer ?? null,
          dependencies: pkg.dependencies ?? {},
          peerDependencies: pkg.peerDependencies ?? {},
          devDependencies: pkg.devDependencies ?? {},
        });
      } catch {
        // skip unreadable
      }
    }
  }
  return packages;
}

function safeIsDir(p: string): boolean {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function safeIsFile(p: string): boolean {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
}
