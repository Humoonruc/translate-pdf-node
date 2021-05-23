// baiduAPI.js

// @ts-check
'use strict';


const md5 = require('md5');
const axios = require('axios').default;
const fs = require('fs');
const path = require('path');
const config = require('./config');


// config
const URL = 'http://api.fanyi.baidu.com/api/trans/vip/translate';
const appid = config.BAIDU_TRANSLATE_ID;
const key = config.BAIDU_TRANSLATE_KEY;
// const from = 'en';
// const to = 'zh';


async function getServerRes(query, from = 'en', to = 'zh') {
  const salt = (new Date).getTime();
  const response = await axios.get(URL, {
    params: {
      q: query,
      appid: appid,
      from: from,
      to: to,
      salt: salt,
      sign: md5(appid + query + salt + key),
    },
    responseType: 'json',
  });
  return response.data;
}
async function getDstText(src, from = 'en', to = 'zh') {
  const response = await getServerRes(src, from, to);
  return response.trans_result[0].dst;
}
async function getDstArticle(src, from = 'en', to = 'zh') {
  const srcArray = src.split('\r\n').filter(text => text !== '');
  const dstArray = await Promise.all(srcArray.map(async text => await getDstText(text, from, to)));
  return dstArray.join('\r\n');
}
async function translateFile(filePath, from = 'en', to = 'zh') {
  const pathObj = path.parse(filePath);
  const dirPath = pathObj.dir; // 所在目录的绝对路径
  const outputPath = path.join(dirPath, 'translated', pathObj.name + '-translated' + pathObj.ext);

  const srcArticle = fs.readFileSync(filePath, { encoding: 'utf8' });
  const dstArticle = await getDstArticle(srcArticle, from, to);
  fs.writeFileSync(outputPath, dstArticle);
}
module.exports.getServerRes = getServerRes;
module.exports.getDstText = getDstText;
module.exports.getDstArticle = getDstArticle;
module.exports.translateFile = translateFile;