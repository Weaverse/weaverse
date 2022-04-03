#!/usr/bin/env sh

upgrade() {
  pkg_file="package.json"

  ver_txt=$(grep -F '"version":' $pkg_file | sed -e 's/[^0-9.]//g')

  major=$(cut -d "." -f1 <<<$ver_txt)
  minor=$(cut -d "." -f2 <<<$ver_txt)
  patch=$(cut -d "." -f3 <<<$ver_txt)

  old_ver="\"version\": \"$major.$minor.$patch\""
  new_ver="\"version\": \"$major.$minor.$((patch + 1))\""

  sed -i '.json' "s/$old_ver/$new_ver/" $pkg_file

  echo "📦📦📦 Version upgraded: $major.$minor.$patch --> $major.$minor.$((patch + 1))"

  echo "📦📦📦 Updating dependencies..."
  # npm install

  echo "📦📦📦 Publishing to npm..."
  # npm publish
}

main() {
  cd "./packages"
  packages=("core" "react" "shopify")
  for package in "${packages[@]}"; do
    cd ./$package
    echo -ne "\nUpgrading @weaverse/$package..."
    upgrade
    cd ..
  done
}

main
