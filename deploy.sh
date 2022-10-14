#!/bin/bash

CURRENT_DATE=$(date +"%Y-%m-%d")
REMOTE_PATH="https://github.com/gkfat/user-account.git"

#############

echo "Start deploy, $CURRENT_DATE"

# 部署至 Remote path gh-page 建立靜態頁面
git checkout --orphan gh-pages
npm run build
cd dist
git add .
git commit -m "Build static files $CURRENT_DATE"
git push $REMOTE_PATH gh-pages
cd ..
rm -rf dist