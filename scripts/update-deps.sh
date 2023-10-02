#!/usr/bin/env bash

packages=(
  "."
  "packages/core"
  "packages/react"
  "packages/hydrogen"
  "packages/shopify"
)

for package in "${packages[@]}"; do
  cd "$package" || exit
  echo "📦 Updating dependencies for $package..."
  npx taze major -w
  cd - >/dev/null || exit
done
