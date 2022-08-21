rm -rf dist
mkdir dist
yarn run build && aws s3 sync --acl public-read --delete dist/ s3://datacue-dashboard
#reset cache headers for index.html
aws s3 cp s3://datacue-dashboard/index.html s3://datacue-dashboard/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl public-read
