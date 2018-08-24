#!/bin/bash

sed -i '' 's/export const production = true/export const production = false/g' ./src/config.js;