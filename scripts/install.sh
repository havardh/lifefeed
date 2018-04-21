#!/bin/bash

mkdir -p server/files

# sudo cp lifefeed-template.service /etc/systemd/system/lifefeed.service
pushd server
NODE_ENV=production pm2 start index.js --name lifefeed
popd

psql postgres://postgres:postgres@localhost/lifefeed < server/src/user/users.sql
psql postgres://postgres:postgres@localhost/lifefeed < server/src/user/passwordless.sql
psql postgres://postgres:postgres@localhost/lifefeed < server/src/feed/items.sql
psql postgres://postgres:postgres@localhost/lifefeed < server/node_modules/connect-pg-simple/table.sql
