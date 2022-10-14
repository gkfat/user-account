#!/bin/bash

CURRENT_DATE=$(date +"%Y-%m-%d")
echo "Start deploy, $CURRENT_DATE"

echo "Enter commit message: " 
read COMMIT_MESSAGE

git checkout master
git add .
git commit -m "$COMMIT_MESSAGE"
git push -f https://github.com/gkfat/user-account.git master

# git checkout --orphan gh-pages
# npm run build
