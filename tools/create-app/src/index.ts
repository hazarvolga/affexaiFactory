#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { SlugSchema } from '@affex/shared-types';
import kleur from 'kleur';
import prompts from 'prompts';

const REPO_ROOT = resolve(process.cwd());

interface TemplateDef {
  id: string;
  starter: string;
  description: string;
  layer: 'ACTIVE_NOW' | 'OPTIONAL_LATER';
}

const TEMPLATES: TemplateDef[] = [
  {
    id: 'nest-saas',
    starter: 'apps/_starter-nest',
    description: 'NestJS API + worker',
    layer: 'ACTIVE_NOW',
  },
  {
    id: 'next-app',
    starter: 'apps/_starter-next',
    description: 'Next.js 14 (App Router)',
    layer: 'ACTIVE_NOW',
  },
];

interface FeatureDef {
  id: string;
  package: string;
  layer: 'ACTIVE_NOW' | 'OPTIONAL_LATER';
}

const FEATURES: FeatureDef[] = [
  { id: 'observability', package: '@affex/observability-core', layer: 'ACTIVE_NOW' },
  { id: 'ai', package: '@affex/ai-core', layer: 'ACTIVE_NOW' },
  { id: 'db', package: '@affex/db-core', layer: 'ACTIVE_NOW' },
  { id: 'auth', package: '@affex/auth-core', layer: 'OPTIONAL_LATER' },
  { id: 'ui-kit', package: '@affex/ui-kit', layer: 'OPTIONAL_LATER' },
  { id: 'queue', package: '@affex/queue-core', layer: 'OPTIONAL_LATER' },
  { id: 'notifications', package: '@affex/notification-core', layer: 'OPTIONAL_LATER' },
  { id: 'billing', package: '@affex/billing-core', layer: 'OPTIONAL_LATER' },
];

function tokenReplace(content: string, tokens: Record<string, string>): string {
  return Object.entries(tokens).reduce(
    (acc, [key, value]) => acc.replaceAll(`__${key}__`, value),
    content,
  );
}

function copyDir(
  src: string,
  dest: string,
  tokens: Record<string, string>,
  skip: string[] = [],
): void {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    if (skip.includes(entry)) continue;
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    const stat = statSync(srcPath);
    if (stat.isDirectory()) {
      copyDir(srcPath, destPath, tokens, skip);
    } else {
      const content = readFileSync(srcPath, 'utf8');
      writeFileSync(destPath, tokenReplace(content, tokens));
    }
  }
}

async function main(): Promise<void> {
  console.log(kleur.bold().cyan('\n  @affex/create-app\n'));

  const responses = await prompts(
    [
      {
        type: 'text',
        name: 'name',
        message: 'app name (kebab-case)',
        validate: (v: string) => {
          const result = SlugSchema.safeParse(v);
          return result.success || result.error.issues[0]?.message || 'invalid';
        },
      },
      {
        type: 'select',
        name: 'template',
        message: 'template',
        choices: TEMPLATES.filter((t) => t.layer === 'ACTIVE_NOW').map((t) => ({
          title: `${t.id}  ${kleur.dim(`— ${t.description}`)}`,
          value: t.id,
        })),
      },
      {
        type: 'multiselect',
        name: 'features',
        message: 'features (Layer 1 only by default)',
        instructions: false,
        choices: FEATURES.map((f) => ({
          title: `${f.id}  ${kleur.dim(f.package)}${f.layer === 'OPTIONAL_LATER' ? kleur.yellow(' [Layer 2 — needs promotion]') : ''}`,
          value: f.id,
          disabled: f.layer === 'OPTIONAL_LATER',
        })),
      },
    ],
    { onCancel: () => process.exit(1) },
  );

  const template = TEMPLATES.find((t) => t.id === responses.template);
  if (!template) throw new Error(`unknown template: ${responses.template}`);

  const appDir = join(REPO_ROOT, 'apps', responses.name);
  if (existsSync(appDir)) {
    console.error(kleur.red(`✗ apps/${responses.name} already exists`));
    process.exit(1);
  }

  const starterDir = join(REPO_ROOT, template.starter);
  if (!existsSync(starterDir)) {
    console.error(kleur.red(`✗ starter not found: ${template.starter}`));
    process.exit(1);
  }

  const tokens = {
    APP_NAME: responses.name,
    APP_NAME_PASCAL: responses.name
      .split('-')
      .map((p: string) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(''),
    DB_NAME: responses.name.replaceAll('-', '_'),
    APP_PORT: template.id === 'next-app' ? '3001' : '3000',
  };

  console.log(kleur.dim(`\n  copying ${template.starter} → apps/${responses.name}...`));
  copyDir(starterDir, appDir, tokens, ['node_modules', 'dist', '.next', '.turbo']);

  const pkgPath = join(appDir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  pkg.name = `@affex/${responses.name}`;
  pkg.version = '0.0.1';
  pkg.description = `${responses.name} — generated from ${template.id}`;
  if (pkg.affex && 'role' in pkg.affex) {
    pkg.affex = { layer: pkg.affex.layer };
  }
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  const readmePath = join(appDir, 'README.md');
  if (existsSync(readmePath)) {
    writeFileSync(
      readmePath,
      [
        `# @affex/${responses.name}`,
        '',
        `Generated from \`${template.id}\` on ${new Date().toISOString().slice(0, 10)}.`,
        '',
        '## Run',
        '',
        '```bash',
        'cp .env.example .env',
        'pnpm install',
        `pnpm dev --filter=@affex/${responses.name}`,
        '```',
        '',
      ].join('\n'),
    );
  }

  console.log(kleur.green('\n  ✓ scaffold created'));
  console.log(kleur.dim(`    apps/${responses.name}`));

  console.log(kleur.dim('\n  installing dependencies...'));
  execSync('pnpm install', { cwd: REPO_ROOT, stdio: 'inherit' });

  console.log(kleur.green('\n  ✓ done. next:\n'));
  console.log(`    cd ${relative(process.cwd(), appDir)}`);
  console.log('    pnpm dev\n');
}

main().catch((err) => {
  console.error(kleur.red('\n  ✗ generator failed:'), err);
  process.exit(1);
});
