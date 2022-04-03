#!/usr/bin/env sh

pkg_file="package.json"
packages=("core" "react" "shopify")

print() {
  echo -ne "\n$1\n"
}

upgrade() {
  pkg=${1:-version}
  ver_line=$(grep -F "\"$pkg\":" $pkg_file | sed -e 's/[^0-9.]//g')
  if [ -n "$ver_line" ]; then
    major=$(cut -d "." -f1 <<<$ver_line)
    minor=$(cut -d "." -f2 <<<$ver_line)
    patch=$(cut -d "." -f3 <<<$ver_line)
    old_ver="\"$pkg\": \"$major.$minor.$patch\""
    new_ver="\"$pkg\": \"$major.$minor.$((patch + 1))\""
    sed -i '' "s#$old_ver#$new_ver#" $pkg_file
    print "📦📦📦 $pkg upgraded: $major.$minor.$patch --> $major.$minor.$((patch + 1))"
  fi
}

main() {
  cd "./packages"
  for package in "${packages[@]}"; do
    cd ./$package
    print "Upgrading @weaverse/$package..."
    upgrade
    for package in "${packages[@]}"; do
      upgrade "@weaverse/$package"
    done
    cd ..
  done

  print "📦📦📦 Building packages..."
  npm run build

  for package in "${packages[@]}"; do
    print "🚀🚀🚀 Publishing @weaverse/$package to npm..."
    # npm publish
  done
}

main
