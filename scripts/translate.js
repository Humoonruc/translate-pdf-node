// @ts-check
'use strict';
// translate.js


// modules
const fs = require('fs');
const path = require('path');
const baiduAPI = require('./baiduAPI');
const config = require('./config');


// config
const from = config.SOURCE_LANGUAGE;
const to = config.TARGET_LANGUAGE;


// translation source files
const sourceDir = path.join(path.parse(__dirname).dir, 'source');
const sourceFiles = fs.readdirSync(sourceDir)
  .filter(base => path.parse(base).ext !== '') // 去掉文件夹，只要文件
  .map(base => path.join(sourceDir, base));

  
// 各个文件的处理是并行的，不一定哪个先完成
sourceFiles.forEach(async file => {
  console.log(`Translating ${path.parse(file).base} ...`);
  await baiduAPI.translateFile(file, from, to);
  console.log(`Translate ${path.parse(file).base} done.`);
});