#!/bin/bash

sed -i '' 's/export const production = false/export const production = true/g' ./src/config.js;