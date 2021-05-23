//xml2txt.js

const fs = require("fs");
const path = require("path");
const X2JS = require('x2js');
let x2js = new X2JS();


const xmlPath = process.argv[2];
const jsonPath = process.argv[3];
const txtPath = process.argv[4];


// 读取XML文件，转换为JSON格式的对象，然后保存至文件，便于观察其结构
const xmlString = fs.readFileSync(xmlPath, "utf-8");
const jsonObj = x2js.xml2js(xmlString);
fs.writeFileSync(jsonPath, JSON.stringify(jsonObj, null, 2), "utf8");



// //2. 解析json，提取信息
// pageArray = jsonObj.pages.page; // all pages

// let keyWords = '';
// let pageIndex = 0;
// let textPageArray = [];


// pageArray.forEach(page => { // every page
//   pageIndex++; //页码信息
//   let textPage = '';
//   let boxArray = page.textbox; // all boxes
//   boxArray.forEach(box => { // every box

//     //定义对每一行的处理函数
//     function getLineString(line) {
//       let chars = line.text; // all chars (every "char" is an object)
//       let lineString = chars.map(char => {
//         if (char.__text !== "") {
//           return char.__text;
//         } else {
//           return ' ';
//         }
//       }).join("").trim();

//       if (lineString.search(/[kK]eywords:/) > -1) {
//         keyWords = lineString;
//       }

//       if (/^[0-9]/.test(lineString)) lineString += ".";
//       return lineString;
//     }


//     let textInBox = "";
//     if (box.textline instanceof Array) {
//       //若一个文本块中有许多行
//       box.textline.forEach(line => {
//         //把这多行字符串加总
//         textInBox += (getLineString(line) + ' ');
//       });
//     } else {
//       textInBox = getLineString(box.textline);
//     }
//     textInBox = textInBox.trim();


//     if (!/^[1-9]+?[a-zA-Z]/.test(textInBox) && !/^[1-9]\d*\.$/.test(textInBox) && textInBox.length > 1) {
//       //非注释，非页码，非单字符（通常是表格内容）
//       textPage += (textInBox + '\n');
//     }
//   });
//   // console.log(textPage);
//   textPageArray.push(textPage);
// });
// let wholeText = textPageArray.join("");



// // 3. 提取正文和输出

// // 只要conclusion之前的部分
// // "."只能匹配换行符以外的任意字符，所以如果要包含换行符，必须用[\s\S]
// let mainTextObj = /[\s\S]*(Conclusions*|Discussion)\.\n[\s\S]*?(?=(Reference|REFERENCE))/.exec(wholeText);

// if (mainTextObj === null) {
//   console.log("这不是一篇文献！\n");
//   fs.writeFile(
//     "./txt/" + filename + ".txt",
//     wholeText,
//     "utf8",
//     (err, data) => {
//       if (err) throw err;
//     });
// } else {
//   //这是一篇论文
//   let mainText = mainTextObj[0];

//   let abstract = /(?<=[aA]bstract\n)[\s\S]*?\.\n/.exec(mainText)[0];
//   //将并非段末的换行符（段末换行符为'\.\n'）变成空格
//   abstract = 'Abstract: ' + abstract.replace(/(?<!\.)\n/g, " ");

//   let conclusion = /(?<=(Conclusion|Discussion)\.\n)[\s\S]*/.exec(mainText)[0];
//   conclusion = 'Conclusion: ' + conclusion.replace(/(?<!\.)\n/g, " ");


//   let head = /[\s\S]*(?=Introduction)/.exec(mainText)[0];
//   let body = /[Introduction[\s\S]*/.exec(mainText)[0];
//   mainText = head + body.replace(/(?<!\.)\n/g, " "); //正文把非段末的换行符换掉，正文之前的部分不管

//   //output mainText
//   fs.writeFile("./txt/" + filename + ".txt", mainText, "utf8", (err, data) => {
//     if (err) throw err;
//   });

//   //only output abstract
//   // fs.writeFile("./txt/" + filename + ".txt", abstract, "utf8", (err, data) => {
//   //   if (err) throw err;
//   // });
// }