#!/bin/bash

mkdir -p server/files

# sudo cp lifefeed-template.service /etc/systemd/system/lifefeed.service
pushd server
NODE_ENV=production pm2 start index.js --name lifefeed
popd
