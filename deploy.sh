#!/bin/bash

CURRENT_DATE=$(date +"%Y-%m-%d %H:%M")
echo "Start deploy: $CURRENT_DATE"

# 部署至 Remote path gh-page 建立靜態頁面
npm run build
git add dist -f
git commit -m "Build static files $CURRENT_DATE"
git subtree push --prefix dist origin gh-pages