#!/usr/bin/env bash
set -euo pipefail

BUILD_COMMAND="${BUILD_COMMAND:-npm run build}"

section() {
  printf "\n== %s ==\n" "$1"
}

section "git status"
git status --short || true

section "tracked local secret metadata"
git ls-files .env .env.local .env.production .env.development .vercel || true

section "local env/vercel files"
rg --files -uu -g '.env*' -g '.vercel/**' || true

section "ignore checks"
git check-ignore .env.production .env.development .env.local .vercel/project.json node_modules/foo .next/build || true

section "secret pattern scan"
rg -n "API_KEY|SECRET|TOKEN|PASSWORD|PRIVATE_KEY|DATABASE_URL|AUTH_SECRET|BEGIN PRIVATE KEY|ghp_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{20,}" \
  -S \
  --glob '!package-lock.json' \
  --glob '!node_modules/**' \
  --glob '!.next/**' \
  . || true

section "build"
eval "$BUILD_COMMAND"
