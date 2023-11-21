#!/bin/bash

directories=(
  "."
  "packages/core"
  "packages/react"
  "packages/hydrogen"
  "packages/shopify"
  "templates/pilot"
)

targets=(
  "node_modules"
  "package-lock.json"
  "pnpm-lock.yaml"
  ".turbo"
  "dist"
  ".cache"
  "build"
  "public/build"
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
