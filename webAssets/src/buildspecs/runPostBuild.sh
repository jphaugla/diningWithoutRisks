BUCKETNAME=$1
DISTRIBUTION_ID=$2
echo Uploading to AssetsBucket
aws s3 cp --recursive ./build s3://webassetsdining-artifactsbucket-10wjurkdsjioc/
aws s3 cp --cache-control="max-age=0, no-cache, no-store, must-revalidate" ./build/service-worker.js s3://${BUCKETNAME}/
aws s3 cp --cache-control="max-age=0, no-cache, no-store, must-revalidate" ./build/index.html s3://${BUCKETNAME}/
aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --paths /index.html /service-worker.js

