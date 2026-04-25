import { type PackageMeta, listWorkspacePackages } from './workspace.js';

export async function layerCheck(): Promise<{
  name: string;
  ok: boolean;
  errors: string[];
  warnings: string[];
}> {
  const errors: string[] = [];
  const warnings: string[] = [];

  const packages = listWorkspacePackages();
  const byName = new Map<string, PackageMeta>();
  for (const pkg of packages) byName.set(pkg.name, pkg);

  for (const pkg of packages) {
    if (!pkg.layer) {
      warnings.push(`${pkg.relDir}: missing affex.layer in package.json`);
      continue;
    }

    if (pkg.relDir.startsWith('apps/') && pkg.relDir.includes('/_starter-') === false) {
      // application packages — fine to depend on anything
    }

    if (pkg.layer === 'ACTIVE_NOW') {
      for (const dep of Object.keys(pkg.dependencies)) {
        const depMeta = byName.get(dep);
        if (!depMeta) continue;
        if (depMeta.layer && depMeta.layer !== 'ACTIVE_NOW') {
          errors.push(
            `${pkg.relDir}: ACTIVE_NOW package depends on ${depMeta.layer} package "${dep}". Use peerDependencies + runtime gate.`,
          );
        }
      }
    }

    for (const dep of Object.keys(pkg.dependencies)) {
      const depMeta = byName.get(dep);
      if (depMeta?.relDir.startsWith('experimental/')) {
        errors.push(`${pkg.relDir}: depends on experimental "${dep}" — forbidden.`);
      }
    }

    if (pkg.relDir.startsWith('packages/')) {
      for (const dep of Object.keys(pkg.dependencies)) {
        const depMeta = byName.get(dep);
        if (depMeta?.relDir.startsWith('apps/')) {
          errors.push(`${pkg.relDir}: package depends on app "${dep}" — direction violation.`);
        }
      }
    }
  }

  return {
    name: 'layer-check',
    ok: errors.length === 0,
    errors,
    warnings,
  };
}
