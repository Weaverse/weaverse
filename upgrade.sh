#!/usr/bin/env bash

packages=("core" "react" "shopify" "hydrogen")
package_json="package.json"

update_version() {
  local ver_line=$(grep -F "\"version\":" "$package_json" | sed -e 's/[^0-9.]//g')
  if [ -n "$ver_line" ]; then
    local major=$(cut -d "." -f1 <<<"$ver_line")
    local minor=$(cut -d "." -f2 <<<"$ver_line")
    local patch=$(cut -d "." -f3 <<<"$ver_line")
    local current_version="$major.$minor.$patch"
    local version_updated=false

    while [[ $# -gt 0 ]]; do
      case "$1" in
      --major)
        major=$((major + 1))
        minor=0
        patch=0
        version_updated=true
        ;;
      --minor)
        minor=$((minor + 1))
        patch=0
        version_updated=true
        ;;
      --patch)
        patch=$((patch + 1))
        version_updated=true
        ;;
      --version)
        shift
        major=$(cut -d "." -f1 <<<"$1")
        minor=$(cut -d "." -f2 <<<"$1")
        patch=$(cut -d "." -f3 <<<"$1")
        version_updated=true
        ;;
      esac
      shift
    done
    if [[ "$version_updated" == false ]]; then
      patch=$((patch + 1))
    fi
  fi

  local new_version="$major.$minor.$patch"
  echo "$current_version $new_version"
}

upgrade_package() {
  local target=$(grep -F "\"$1\":" "$package_json" | sed -e 's/[^0-9.]//g')
  if [ -n "$target" ]; then
    local current_line="\"$1\": \"$2\""
    local new_line="\"$1\": \"$3\""
    sed -i '' "s#$current_line#$new_line#" "$package_json"
    echo "   $1: $2 --> $3"
  fi
}

main() {
  local versions=$(update_version "$@")
  local current_version=$(cut -d " " -f1 <<<"$versions")
  local new_version=$(cut -d " " -f2 <<<"$versions")

  echo "⬆️. Upgrading sdks..."
  upgrade_package "version" "$current_version" "$new_version"
  echo ''

  cd "./packages" || exit 1
  for package in "${packages[@]}"; do
    cd "./$package" || exit 1
    echo "⬆️. Upgrading @weaverse/$package..."
    upgrade_package "version" "$current_version" "$new_version"
    for dep_pkg in "${packages[@]}"; do
      upgrade_package "@weaverse/$dep_pkg" "$current_version" "$new_version"
    done
    cd ..
    echo ''
  done

  local publish=false
  while [[ $# -gt 0 ]]; do
    case "$1" in
    -p)
      publish=true
      ;;
    esac
    shift
  done

  if [[ "$publish" == true ]]; then
    echo "💿 Building packages..."
    npm run build
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
