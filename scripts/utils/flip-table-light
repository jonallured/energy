#!/usr/bin/env bash
set -euxo pipefail

rm -rf node_modules && rm -rf .cache && rm -rf "$TMPDIR/metro*" && rm -rf "$TMPDIR/haste-map-*"

yarn install:all

yarn start --reset-cache
