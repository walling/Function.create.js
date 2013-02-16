#!/bin/bash

# Script to run before distributing. This verifies and minifies code etc.

# Exit on failures.
set -e

# Go to project directory.
cd "$(dirname "$0")"

# Lint the source code.
jshint Function.create.js tests.js

# Minify normal version.
uglifyjs Function.create.js -m -r function_proxy -c unused=false -o Function.create.min.js

# Minify no-unicode version.
sed 's \[\$.* [$_A-Za-z][$_A-Za-z0-9]*$/; ' Function.create.js | uglifyjs - -m -r function_proxy -c unused=false -o Function.create.no-unicode.min.js

# Output resulting sizes.
echo "Function.create.js:                $(cat Function.create.js | wc -c) bytes"
echo "Function.create.min.js:            $(gzip -9 -c Function.create.min.js | wc -c) bytes gzipped"
echo "Function.create.no-unicode.min.js: $(gzip -9 -c Function.create.no-unicode.min.js | wc -c) bytes gzipped"
