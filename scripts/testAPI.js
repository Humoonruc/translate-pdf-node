// @ts-check
'use strict';
// testAPI.js

const path = require('path');
const fs = require('fs');
const baiduAPI = require('./baiduAPI');

main();

async function main() {
  console.log(await baiduAPI.translateServerResponse('apple\nbanana', 'en', 'jp'));
  console.log(await baiduAPI.translateResults('apple\nbanana', 'en', 'jp'));

  const fatherDir = path.parse(__dirname).dir;
  const filePath = path.join(fatherDir, 'source', 'superman.txt');
  await baiduAPI.translateFile(filePath, 'en', 'jp');
}