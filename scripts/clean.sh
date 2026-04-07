#!/bin/bash

directories=(
  "."
  "packages/cli"
  "packages/core"
  "packages/hydrogen"
  "packages/react"
  "templates/pilot"
)

targets=(
  "node_modules"
  "pnpm-lock.yaml"
  ".turbo"
  "dist"
  ".cache"
  "build"
  "public/build"
  "bun.lock"
)

echo "🧹 Cleaning up projects..."

for dir in "${directories[@]}"; do
  cd "$dir" >/dev/null || exit
  for target in "${targets[@]}"; do
    rm -rf "$target"
  done
  echo "  ✅ $dir"
  cd - >/dev/null || exit
done

echo "✨ SDKs cleaned up successfully!"
