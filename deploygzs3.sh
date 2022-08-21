#!/bin/bash

# make file executable
set -e

# instructions ()
# {
#   echo "*********************************************"
#   echo "Run this script as an npm task              *"
#   echo "$ npm run deploy <env>                      *"
#   echo "env: eg. stage, prod                        *"
#   echo "for example: $ npm run deploy stage         *"
#   echo "*********************************************"
# }
export BUCKET="datacue-dashboard-staging"
if [ -n "$1" ];then
echo "Deploying to production!"
export BUCKET="datacue-dashboard"
else
echo "Deploying to staging"
fi

# if [ $# -eq 0 ]; then
#   instructions
#   exit 1
# elif [ "$1" == stage ]; then
#   BUCKET="<name-of-your-s3-bucket-for-stage>"
# elif [ "$1" == prod ]; then
#   BUCKET="<name-of-your-s3-bucket-for-production>"
# else
#   instructions
#   exit 1
# fi

echo "Building project..."
yarn run build

DIST="dist"
TMP="tmp"

echo "remove tmp directory created previously"
rm -rf $TMP

# mv all the files needed to run the app to a `tmp` directory
echo "create a tmp directory and copy all the files there"
rsync -avz --include 'manifest.*.js' --exclude '*.js' --exclude '*.css' --exclude '*.map' --exclude '*.svg.gz' dist tmp

# omit all .gz file extensions
echo "Omit the .gz file extension"
for x in $(find tmp -name \*.gz); do
  mv $x $(echo "$x" | sed 's/\.gz$//')
done

echo "Keeping fonts as non gzipped"
rm -rf ./$TMP/$DIST/fonts
rsync -avz --exclude '*.gz' dist/fonts $TMP/$DIST

echo "Keeping images as non gzipped"
rm -rf ./$TMP/$DIST/img
rsync -avz --exclude '*.gz' dist/img $TMP/$DIST

echo "Copy files and delete previous files"
# aws s3 rm s3://$BUCKET --recursive
aws s3 sync --acl public-read --delete ./$TMP/$DIST s3://$BUCKET

echo "Resetting caching for index.html"
#reset cache headers for index.html
aws s3 cp s3://$BUCKET/index.html s3://$BUCKET/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type 'text/html' --content-encoding 'gzip' --acl public-read

# sync to the S3 bucket
# aws-cli is needed
# echo "Copying files over to S3"
# aws s3 sync ./$TMP/$DIST s3://$BUCKET --acl public-read

# set the metadata to notify s3 that we're using gzip
echo "Set 'Content-Encoding:gzip' on affected files"
aws s3 cp s3://$BUCKET/js s3://$BUCKET/js --recursive --exclude 'manifest*' --metadata-directive REPLACE --content-encoding 'gzip' --acl public-read
aws s3 cp s3://$BUCKET/css s3://$BUCKET/css --recursive --metadata-directive REPLACE --content-encoding 'gzip' --acl public-read

echo "🚀 🚀 🚀 🚀 🚀 "
