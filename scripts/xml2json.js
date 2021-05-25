/**
 * @module xml2json
 * @file 将xml文件转化为json文件
 * @author Humoonruc
 */

const fs = require("fs");
const X2JS = require('x2js');

const xmlPath = process.argv[2];
const jsonPath = process.argv[3];

// 读取XML文件，转换为JSON格式的对象，然后保存至文件，便于观察其结构
const xmlString = fs.readFileSync(xmlPath, "utf8");
const x2js = new X2JS();
const jsonObj = x2js.xml2js(xmlString);
fs.writeFileSync(jsonPath, JSON.stringify(jsonObj, null, 2), "utf8");