#!/bin/bash
set -e

echo "Building..."
npm run build

echo "Deploying to gh-pages..."
cd dist
git init
git checkout -B gh-pages
git add -A
git commit --allow-empty -m "Deploy $(date '+%Y-%m-%d %H:%M:%S')"
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/thangncdev/lpic-1.git
git push -f origin gh-pages
cd ..

echo "Done! Visit: https://thangncdev.github.io/lpic-1/"
