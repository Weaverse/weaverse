#!/usr/bin/env sh

packages=("core" "react" "shopify")

upgrade() {
  pkg_file="package.json"

  pkg=$1 || "version"
  echo "Upgrading ${pkg}..."

  ver_txt=$(grep -F '"version":' $pkg_file | sed -e 's/[^0-9.]//g')

  major=$(cut -d "." -f1 <<<$ver_txt)
  minor=$(cut -d "." -f2 <<<$ver_txt)
  patch=$(cut -d "." -f3 <<<$ver_txt)

  old_ver="\"version\": \"$major.$minor.$patch\""
  new_ver="\"version\": \"$major.$minor.$((patch + 1))\""

  sed -i '' "s/$old_ver/$new_ver/" $pkg_file

  echo "📦📦📦 Version upgraded: $major.$minor.$patch --> $major.$minor.$((patch + 1))"

  echo "📦📦📦 Publishing to npm..."
  # npm publish
}

main() {
  cd "./packages"
  for package in "${packages[@]}"; do
    cd ./$package
    echo -ne "\nUpgrading @weaverse/$package...\n"
    upgrade
    for package in "${packages[@]}"; do
      upgrade "@weaverse/$package"
    done
    cd ..
  done
}

main
