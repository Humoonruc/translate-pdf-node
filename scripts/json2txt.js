//@ts-check
'use strict';
//json2txt.js

const fs = require("fs");


const jsonPath = process.argv[2];
const txtPath = process.argv[3];


const jsonObj = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 从json文件中提取文本信息
// 该json文件的结构为：页page-段box-行line-字符char

let pageArray = jsonObj.pages.page; // 所有页
if (!Array.isArray(pageArray)) { pageArray = [pageArray]; } // 若只有一页，为了用数组的高阶函数，必须把页对象化为数组
const wholeText = pageArray.map(page => { // 每一页

  let boxArray = page.textbox; // 该页所有的文本块（一个文本块一般是一个段落）
  if (!Array.isArray(boxArray)) { boxArray = [boxArray]; }
  const pageString = boxArray.map(box => { // 每一个文本块

    let lineArray = box.textline; // 所有的行
    if (!Array.isArray(lineArray)) { lineArray = [lineArray]; }
    let boxString = lineArray.map(line => { // 每一行

      let charArray = line.text; // 一行所有的字符对象
      if (!Array.isArray(charArray)) { charArray = [charArray]; }
      const lineString = charArray.map(char => {
        return char.__text !== '' && char.__text !== undefined ? char.__text : ' ';
        // 字符对象若无__text属性，可能表示字符之间的空格
      }).join("").trim(); // 拼接每个字符形成行字符串

      return lineString;
      // if (/^[0-9]/.test(lineString)) lineString += ".";
    }).join(' ').trim(); // 行字符串之间由空格拼接成段落字符串

    if (!/^[1-9]+?[a-zA-Z]/.test(boxString) && !/^[1-9]\d*\.$/.test(boxString) && boxString.length > 1) {
      //非注释，非页码，非单字符（单字符通常是表格内容），一般为段落，最后加一个换行符
      boxString += '\n';
    }

    return boxString;
  }).join('').trim(); // 段落之间连起来形成一页的文本

  return pageString;
}).join('');


fs.writeFileSync(txtPath, wholeText, 'utf8');