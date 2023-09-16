#!/usr/bin/env bash

pkg_file="package.json"
packages=("core" "react" "shopify" "hydrogen")

upgrade() {
  local pkg=${1:-version}
  local ver_line=$(grep -F "\"$pkg\":" "$pkg_file" | sed -e 's/[^0-9.]//g')
  if [ -n "$ver_line" ]; then
    local major=$(cut -d "." -f1 <<<"$ver_line")
    local minor=$(cut -d "." -f2 <<<"$ver_line")
    local patch=$(cut -d "." -f3 <<<"$ver_line")
    local old_ver="\"$pkg\": \"$major.$minor.$patch\""
    local new_ver="\"$pkg\": \"$major.$minor.$((patch + 1))\""
    sed -i '' "s#$old_ver#$new_ver#" "$pkg_file"
    echo "⬆️. $pkg upgraded: $major.$minor.$patch --> $major.$minor.$((patch + 1))"
  fi
}

main() {
  cd "./packages" || exit 1
  local publish=false

  # Check if the first argument is -p
  if [[ "$1" == "-p" ]]; then
    publish=true
    shift # Remove the -p flag from the argument list
  fi

  for package in "${packages[@]}"; do
    cd "./$package" || exit 1
    echo "📦 Upgrading @weaverse/$package..."
    upgrade
    for dep_pkg in "${packages[@]}"; do
      upgrade "@weaverse/$dep_pkg"
    done
    cd ..
    echo ''
  done

  echo "💿 Building packages..."
  npm run build

  if [[ "$publish" == true ]]; then
    for package in "${packages[@]}"; do
      cd "./$package" || exit 1
      echo ''
      echo "🚀 Publishing @weaverse/$package to npm..."
      npm publish
      cd ..
    done
  fi
}

main "$@"
