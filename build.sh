#!/bin/bash

echo "Building project executables.."

tsc
if [ $? != 0 ]; then
    exit 1
fi
echo "TS -> JS compilation successful."

nexe ./dist/launchers/proxy.js -t x64-9.5.0 -o ./dist/proxy
nexe ./dist/launchers/blocklist.js -t x64-9.5.0 -o ./dist/blocklist