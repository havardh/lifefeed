#!/bin/bash

# Make sure backup temp folder exists
mkdir -p backup

# Backup git version
git rev-parse HEAD | cat > backup/git-ref

# Backup database
pg_dump postgres://postgres:postgres@localhost/lifefeed > backup/lifefeed.sql

# Create tarball
tar -cf backup.tar.gz --transform 's/server//' --transform 's/backup//' server/files backup/lifefeed.sql backup/git-ref

# Clean up temp files
rm backup/lifefeed.sql backup/git-ref
