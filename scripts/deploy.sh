#!/bin/bash

git pull

pm2 stop lifefeed
# systemctl stop lifefeed

yarn --cwd client
yarn --cwd server

yarn run build

pm2 start lifefeed
#systemctl start lifefeed
