/**
 * @module baiduAPI
 * @file 定义翻译API
 * @author Humoonruc
 */
// @ts-check
'use strict';


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


// tools
/**
 * 自定义的辅助 sleep() 函数，用于阻断主线程，防止访问服务器的频率过高
 * @param  {number} delay - 要停滞的毫秒数
 * @returns {Promise<void>}
 */
async function sleep(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}


// APIs
/**
 * 向百度翻译服务器发送请求的最基本函数，返回一个包含很多信息的对象
 * @param {string} query - 待翻译的字符串，多个查询用 \n 隔开
 * @param {string} [from] - 源语言
 * @param {string} [to] - 目标语言
 * @returns {Promise<object>}
 */
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
/**
 * 返回只包含目标语言的翻译结果数组
 * @param {string} src - 待翻译的字符串，多个查询用 \n 隔开
 * @param {string} [from] - 源语言
 * @param {string} [to] - 目标语言
 * @returns {Promise<Array>}
 */
async function translateResults(src, from = 'en', to = 'zh') {
  const response = await translateServerResponse(src, from, to);
  return response.trans_result.map(bilingual => bilingual.dst);
}
/**
 * 翻译全文，保存成一个新的文件
 * @param {string} sourceFilePath - 待翻译的文件路径
 * @param {string} [from] - 源语言
 * @param {string} [to] - 目标语言
 * @param {string} [type] - 输出文件的类型
 * @returns {Promise<void>}
 */
async function translateFile(sourceFilePath, from = 'en', to = 'zh', type = 'auto') {
  // 翻译结果的输出路径
  const pathObj = path.parse(sourceFilePath);
  const dirPath = pathObj.dir; // 源文件所在目录的绝对路径
  if (!fs.existsSync(path.join(dirPath, 'translate-result'))) {
    fs.mkdirSync(path.join(dirPath, 'translate-result'));
  }
  let destinationFilePath = '';
  if (type === 'auto') {
    destinationFilePath = path.join(dirPath, 'translate-result', pathObj.name + '-translated' + pathObj.ext);
  } else {
    destinationFilePath = path.join(dirPath, 'translate-result', pathObj.name + '-translated' + '.' + type); // 这里可以自己决定输出什么格式的文件
  }
  fs.writeFileSync(destinationFilePath, '', { encoding: 'utf8' });

  // 翻译全文并输出
  // 百度服务器要求单次请求长度控制在 6000 bytes以内（汉字约为输入参数 2000 个），查询间隔至少0.1秒
  // 因此要将全文拆分成段落，每次翻译一个段落；每次查询完毕暂停0.1秒
  // 注意：如果用 .map() 或 .forEach() 这些并行操作的高阶函数访问服务器，无法控制访问的时间间隔，可能被服务器视为恶意攻击。故 .map() 或 .forEach() 只适合本地操作；访问服务器时，要老老实实地用循环，每次间隔一段时间，而不要用并行操作。
  const src = fs.readFileSync(sourceFilePath, { encoding: 'utf8' });
  const srcArray = src.split('\n');

  // const dstArray = [];
  for (let paragraph of srcArray) {
    const translatedParagraph = await translateResults(paragraph, from, to);
    console.log(translatedParagraph[0]);
    // dstArray.push(translatedParagraph[0]);
    fs.appendFileSync(destinationFilePath, translatedParagraph[0] + '\n\n', { encoding: 'utf8' });
    await sleep(100); // 每次查询间隔0.1秒
  }
  // const dst = dstArray.join('\n');
  // fs.writeFileSync(destinationFilePath, dst, 'utf8');
}


// exports
module.exports = {
  translateServerResponse: translateServerResponse,
  translateResults: translateResults,
  translateFile: translateFile,
};