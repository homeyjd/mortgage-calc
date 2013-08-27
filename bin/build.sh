#!/bin/sh

echo Starting compressed RequireJS build:
node r.js -o requirejs-build.js

echo Starting raw RequireJS build:
node r.js -o requirejs-build.js out="../public/build/js/requirejs-build.js" optimize="none"

GRUNT=./node_modules/grunt-cli/bin/grunt

echo Compressing raw RequireJS build files:
$GRUNT rjs

echo Starting alternate grunt build...
$GRUNT