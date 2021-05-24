// @ts-check
'use strict';
// translate.js


// modules
const fs = require('fs');
const baiduAPI = require('./baiduAPI');
const config = require('./config');


// config
const from = config.SOURCE_LANGUAGE;
const to = config.TARGET_LANGUAGE;


const mdPath = process.argv[2];
(async () => {
  await baiduAPI.translateFile(mdPath, from, to);
})();