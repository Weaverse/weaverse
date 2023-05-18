#!/usr/bin/env sh

pkg_file="package.json"
packages=("core" "react" "shopify" "hydrogen")

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
    echo "📦📦📦 $pkg upgraded: $major.$minor.$patch --> $major.$minor.$((patch + 1))"
  fi
}

should_publish() {
  PUBLISH_TO_NPM=false
  for i in "$@"; do
    case $i in
    -p=* | --publish=*)
      PUBLISH_TO_NPM="${i#*=}"
      ;;
    *)
      echo "Unknown flag: $i"
      exit 1
      ;;
    esac
  done
  echo $PUBLISH_TO_NPM
}

main() {
  cd "./packages"
  for package in "${packages[@]}"; do
    cd ./$package
    echo "Upgrading @weaverse/$package..."
    upgrade
    for package in "${packages[@]}"; do
      upgrade "@weaverse/$package"
    done
    cd ..
    echo ''
  done

  echo "💿💿💿 Building packages..."
  npm run build

  if [[ $1 == true ]]; then
    for package in "${packages[@]}"; do
      cd ./$package
      echo ''
      echo "🚀🚀🚀 Publishing @weaverse/$package to npm..."
      npm publish
      cd ..
    done
  fi
}

main $(should_publish $@)
