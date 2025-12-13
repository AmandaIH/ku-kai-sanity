#!/bin/bash
# Vercel install script that uses pnpm and skips optional dependencies
set -e

# Enable corepack and prepare pnpm
corepack enable
corepack prepare pnpm@10.24.0 --activate

# Install with pnpm, skipping optional dependencies
pnpm install --no-optional --config.optional=false

