#!/bin/bash

directories=("." "templates/pilot")
for pkg in packages/*/; do
  directories+=("${pkg%/}")
done

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
  for target in "${targets[@]}"; do
    rm -rf "$dir/$target"
  done
  echo "  ✅ $dir"
done

echo "✨ SDKs cleaned up successfully!"
