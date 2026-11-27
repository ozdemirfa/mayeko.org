#!/usr/bin/env bash
# Yayınlanacak statik dosyaları dist/ altına toplar.
# Repo kökündeki package.json, src/, worker/, plan dosyaları gibi kaynaklar yayına girmez.
# JS/CSS bağlantılarındaki ?v= sürüm parametresi commit kısa hash'i ile güncellenir.
set -euo pipefail
cd "$(dirname "$0")/.."

VERSION="${1:-$(git rev-parse --short HEAD)}"
rm -rf dist
mkdir -p dist
cp ./*.html robots.txt sitemap.xml dist/
cp -R css js assets dist/
for f in _headers _redirects; do [ -f "$f" ] && cp "$f" dist/; done

# macOS sed ile de çalışsın diye perl
perl -pi -e "s/\?v=[0-9a-f]+/?v=${VERSION}/g" dist/*.html dist/js/*.js

echo "dist/ hazır (sürüm ${VERSION}):"
find dist -type f | sort
