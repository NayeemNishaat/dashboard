#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

export BUCKET="datacue-dashboard-staging"
MODE="staging"
if [[ "$1" = "production" ]];then
echo "Deploying to production!"
export BUCKET="datacue-dashboard"
MODE="production"
fi

echo "S3 bucket set to ${BUCKET}"
DIST="dist"
TMP="tmp"

if [ ! -d ${DIST} ]; then
echo "Building project..."
npm run build:${MODE}
fi

echo "remove tmp directory created previously"
rm -rf ${TMP}

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

echo "Deploying to S3..."
aws s3 ls s3://${BUCKET}

echo "Copy files and delete previous files"
aws s3 sync --acl public-read --delete ./${TMP}/${DIST} s3://${BUCKET}

echo "Resetting caching for index.html"
aws s3 cp s3://${BUCKET}/index.html s3://${BUCKET}/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type 'text/html' --content-encoding 'gzip' --acl public-read

# set the metadata to notify s3 that we're using gzip
echo "Set 'Content-Encoding:gzip' on affected files"
aws s3 cp "s3://${BUCKET}/js" "s3://${BUCKET}/js" --recursive --exclude 'manifest*' --metadata-directive REPLACE --content-encoding 'gzip' --acl public-read
aws s3 cp "s3://${BUCKET}/css" "s3://${BUCKET}/css" --recursive --metadata-directive REPLACE --content-encoding 'gzip' --acl public-read

echo "🚀 🚀 🚀 🚀 🚀 "
