// @ts-check
'use strict';
//txt2md.js

const fs = require("fs");

const txtPath = process.argv[2];
const mdPath = process.argv[3];
let wholeText = fs.readFileSync(txtPath, 'utf8');

// 提取正文，只要参考文献之前的部分
// "."只能匹配换行符以外的任意字符，所以如果要包含换行符，必须用[\s\S]
let mainTextObj = /[\s\S]*(Conclusion*|Discussion)\n[\s\S]*?(?=(Reference|REFERENCE))/.exec(wholeText);

if (mainTextObj === null) {
  console.log("这不是一篇论文！\n");
  fs.writeFileSync(mdPath, wholeText, 'utf8');
} else {
  console.log("这是一篇论文。\n");

  // 论文主体
  let mainText = mainTextObj[0];

  // 摘要
  let abstract = undefined;
  let searchAbstract = /(?<=[aA]bstract\n)[\s\S]*?\.\n/.exec(mainText);
  if (searchAbstract !== null) abstract = '摘要：' + searchAbstract[0].replace(/(?<!\.)\n/g, " "); //将并非段末的换行符（段末换行符为'\.\n'）变成空格
  console.log(abstract);

  // 关键词
  let keyWords = undefined;
  let searchKeyWords = /(?<=[kK]eywords:)[\s\S]*?\n/.exec(mainText);
  if (searchKeyWords !== null) keyWords = '关键词：' + searchKeyWords[0];
  console.log(keyWords);

  // 结论
  let conclusion = undefined;
  let searchConclusion = /(?<=(Conclusion|Discussion)\n)[\s\S]*/.exec(mainText);
  if (searchConclusion !== null) conclusion = '结论：' + searchConclusion[0].replace(/(?<!\.)\n/g, " ");
  console.log(conclusion);


  // 正文把非段末的换行符换掉，正文之前的部分不管。这样也能减少段数，从而减少访问百度翻译服务器的次数
  // 正文之前的部分
  let head = /[\s\S]*(?=Introduction)/.exec(mainText)[0];
  // 主体
  let body = /[Introduction[\s\S]*/.exec(mainText)[0];
  mainText = head + body.replace(/(?<!\.)\n/g, " ");


  //output mainText
  fs.writeFileSync(mdPath, mainText, "utf8");

  //only output abstract
  // fs.writeFileSync("./txt/" + filename + ".txt", abstract, "utf8");
}