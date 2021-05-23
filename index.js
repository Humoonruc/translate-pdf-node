//@ts-check
'use strict';
// index.js


// modules
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');


// command line tools
const pythonTool = path.join(__dirname, 'tools', 'pdf2txt.py');


// translation source files
const sourceFiles = fs.readdirSync(path.join(__dirname, 'pdf'))
  .filter(base => path.parse(base).ext === '.pdf');


// translating
sourceFiles.forEach(file => {
  // path
  const name = path.parse(file).name;
  const pdfPath = path.join(__dirname, 'pdf', name + '.pdf');
  const xmlPath = path.join(__dirname, 'xml', name + '.xml');
  const jsonPath = path.join(__dirname, 'json', name + '.json');
  const txtPath = path.join(__dirname, 'txt', name + '.txt');
  const mdPath = path.join(__dirname, 'md', name + '.md');


  // 1. pdf to xml
  console.log(`Transforming and parsing ${name}.pdf ...`);
  child_process.execSync(`python ${pythonTool} -o ${xmlPath} ${pdfPath}`);


  // 2. xml to txt
  console.log(`Extracting structural information from ${name}.pdf ...`);
  child_process.execSync(`node ./scripts/xml2txt.js ${xmlPath} ${jsonPath} ${txtPath}`);



  // 3. translation，两种写法均可
  // const stream = child_process.execSync('node ./scripts/translate.js', { encoding: 'utf8' });
  // console.log(stream);



  // const stream = child_process.spawnSync('node', ['./scripts/translate.js', txtPath, 'en', 'zh', 'md'], { encoding: 'utf8' }); // 这是一个流
  // console.log(stream.stdout); // 持续输出这个流
});