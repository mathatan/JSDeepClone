#!/bin/sh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR

mkdir -p dist
mkdir -p tmp

npm install
node_modules/.bin/babel src -q -d tmp
node_modules/.bin/browserify --standalone jsdeepclone tmp/index.js -o tmp/jsdeepclone.js
node_modules/.bin/uglifyjs tmp/jsdeepclone.js -o dist/jsdeepclone.js --beautify
node_modules/.bin/uglifyjs dist/jsdeepclone.js -o dist/jsdeepclone.min.js --compress --mangle --source-map "filename=dist/jsdeepclone.min.js.map" 

rm -rf tmp
