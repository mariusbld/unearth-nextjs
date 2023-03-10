#
# https://github.com/mapbox/tiny-sdf comes only as an ES module, and cannot be imported from CommonJS.
# This script converts it to a CommonJS module, and removes the fields that are not needed.
# See original: https://github.com/visgl/deck.gl/blob/master/scripts/postinstall.sh#L3
#
npx babel --plugins @babel/plugin-transform-modules-commonjs node_modules/@mapbox/tiny-sdf/index.js -o node_modules/@mapbox/tiny-sdf/index.js
npx json -I -f node_modules/@mapbox/tiny-sdf/package.json -e "delete this.type; delete this.typings; delete this.files; delete this.exports"
