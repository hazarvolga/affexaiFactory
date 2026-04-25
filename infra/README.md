# infra/

Infrastructure-as-code for the local dev stack and (eventually) deploy targets.

## Layer 1 (here today)

```
infra/
├── compose/
│   └── docker-compose.dev.yml      # postgres + redis for local dev
└── docker/
    └── Dockerfile.node             # shared Node 22 base for apps
```

### Local dev stack

```bash
docker compose -f infra/compose/docker-compose.dev.yml up -d
docker compose -f infra/compose/docker-compose.dev.yml down       # stop
docker compose -f infra/compose/docker-compose.dev.yml logs -f    # tail
```

Postgres at `postgres://affex:affex_dev@localhost:5432/affex_dev`.
Redis at `redis://localhost:6379`.

Data lives in `infra/compose/.data/` (gitignored).

### Per-app Dockerfile

Apps either reference `infra/docker/Dockerfile.node` directly via `--build-arg APP=<name>` or write their own.

## Layer 2 (added when needed)

```
infra/
├── coolify/                        # exported Coolify project / app definitions
└── scripts/
    ├── backup.sh                   # postgres → backblaze B2
    ├── restore.sh                  # restore drill
    └── rotate-secrets.sh           # 1Password CLI wrapper
```

Trigger to activate: first deploy, first secret rotation, first backup need. See `docs/layer-promotion.md`.
