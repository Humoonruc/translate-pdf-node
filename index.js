//@ts-check
'use strict';
// index.js

// modules
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

// command line tool
const pythonTool = path.join(__dirname, 'tools', 'pdf2txt.py');

// source pdf files
const sourceFiles = fs.readdirSync(path.join(__dirname, 'pdf'))
  .filter(base => path.parse(base).ext === '.pdf');

// translate
sourceFiles.forEach(file => {
  // 给学术论文pdf改名，去掉所有空格
  const pathObj = path.parse(file);
  const newName = pathObj.name.replace(/[\s]/g, '-');
  const newBase = newName + pathObj.ext;
  fs.renameSync(path.join(__dirname, 'pdf', file), path.join(__dirname, 'pdf', newBase));

  const pdfPath = path.join(__dirname, 'pdf', newName + '.pdf');
  const xmlPath = path.join(__dirname, 'xml', newName + '.xml');
  const jsonPath = path.join(__dirname, 'json', newName + '.json');
  const txtPath = path.join(__dirname, 'txt', newName + '.txt');
  const mdPath = path.join(__dirname, 'md', newName + '.md');

  // 1. pdf to xml
  console.log(`Transforming ${newName}.pdf to ${newName}.xml...`);
  child_process.execSync(`python ${pythonTool} -o ${xmlPath} ${pdfPath}`);

  // 2. xml to json
  console.log(`Transforming ${newName}.xml to ${newName}.json...`);
  child_process.execSync(`node ./scripts/xml2json.js ${xmlPath} ${jsonPath}`);

  // 3. json to txt
  console.log(`Transforming ${newName}.json to ${newName}.txt...`);
  child_process.execSync(`node ./scripts/json2txt.js ${jsonPath} ${txtPath}`);

  // 4. 提取摘要和结论
  console.log(`Extracting structural information from ${newName}.txt to ${newName}.md...`);
  const info = child_process.execSync(`node ./scripts/txt2md.js ${txtPath} ${mdPath}`, { encoding: 'utf8' });
  console.log(info);

  // 5. translation，两种写法均可
  // 要实时显示程序输出，得用异步版的.spawn()
  // 但异步版的.spawn()堵塞不住主进程，如果有多个文件需要翻译，循环中，主进程继续运行到.spawn()就会再开一个不堵塞的异步子进程。这样就可以出现多个子进程同时访问服务器，虽然翻译地快，但容易被封杀，特别是文件多的时候。
  // const output = child_process.execSync(`node ./scripts/translate.js ${mdPath}`, { encoding: 'utf8' });
  // console.log(output);

  const stream = child_process.spawn('node', ['./scripts/translate.js', mdPath], { shell: true });
  stream.stdout.on('data', data => {
    console.log(`Translating: ${data}`);
  });
});