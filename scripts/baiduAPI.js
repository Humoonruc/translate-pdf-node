// @ts-check
'use strict';
// baiduAPI.js


// modules
const md5 = require('md5');
const axios = require('axios').default;
const fs = require('fs');
const path = require('path');


// config
const config = require('./config');
const URL = config.BAIDU_TRANSLATE_API_URL;
const appid = config.BAIDU_TRANSLATE_ID;
const key = config.BAIDU_TRANSLATE_KEY;


// APIs
async function translateServerResponse(query, from = 'en', to = 'zh') {
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
async function translateResults(src, from = 'en', to = 'zh') {
  const response = await translateServerResponse(src, from, to);
  return response.trans_result.map(bilingual => bilingual.dst);
}
async function translateFile(sourceFilePath, from = 'en', to = 'zh', type = 'auto') {
  // 翻译结果的输出路径
  const pathObj = path.parse(sourceFilePath);
  const dirPath = pathObj.dir; // 源文件所在目录的绝对路径
  if (!fs.existsSync(path.join(dirPath, 'translate-result'))) {
    fs.mkdirSync(path.join(dirPath, 'translate-result'));
  }
  let destinationFilePath = '';
  if (type === 'auto') {
    destinationFilePath = path.join(dirPath, 'translate-result', pathObj.name + '-translated' + pathObj.ext); // 这里可以自己决定输出什么格式的文件
  } else {
    destinationFilePath = path.join(dirPath, 'translate-result', pathObj.name + '-translated' + '.' + type); // 这里可以自己决定输出什么格式的文件
  }
  // 翻译全文并输出
  const src = fs.readFileSync(sourceFilePath, { encoding: 'utf8' });
  const dst = (await translateResults(src, from, to)).join('\n');
  fs.writeFileSync(destinationFilePath, dst);
}
module.exports.translateServerResponse = translateServerResponse;
module.exports.translateResults = translateResults;
module.exports.translateFile = translateFile;