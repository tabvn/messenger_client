#!/bin/bash

mv ./build/static/js/*.js ./build/static/js/main.js && mv ./build/static/css/*.css ./build/static/css/main.css;
sed -i '' 's/\/static\/media\//\/sites\/all\/modules\/messenger\/build\/media\//g' ./build/static/css/main.css;
rm -rf /Users/toan/Sites/drupal7/sites/all/modules/messenger/build/*;
mv ./build/static/* /Users/toan/Sites/drupal7/sites/all/modules/messenger/build/;
rm -rf ./build