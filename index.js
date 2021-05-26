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
  console.log(`Transforming pdf to xml (${newName}) ...`);
  child_process.execSync(`python ${pythonTool} -o ${xmlPath} ${pdfPath}`);

  // 2. xml to json
  console.log(`Transforming xml to json (${newName}) ...`);
  child_process.execSync(`node ./scripts/xml2json.js ${xmlPath} ${jsonPath}`);

  // 3. json to txt
  console.log(`Transforming json to txt (${newName}) ...`);
  child_process.execSync(`node ./scripts/json2txt.js ${jsonPath} ${txtPath}`);

  // 4. extract useful information
  console.log(`Extracting structural information from txt to md (${newName}) ...`);
  const info = child_process.execSync(`node ./scripts/txt2md.js ${txtPath} ${mdPath}`, { encoding: 'utf8' });
  console.log(info);

  // 5. translation，两种写法均可

  /**  
   * 要实时显示程序输出，得用异步版的.spawn()，但异步版的.spawn()堵塞不住主进程。
   * 如果有多个文件需要处理，程序便会继续进行下一次迭代，运行到下一个.spawn()时，就会再开一个异步子进程。如果前面文件的翻译工作尚未完成，便会有多个子进程同时访问服务器。
   * 好处是并行翻译多个文件，翻译得快；坏处是每个子进程的访问频率虽然被限定了，但多个子进程同时访问事实上突破了设定的频率，容易被封杀，特别是文件多的时候。
  */

  // (1). 堵塞主进程的同步版，同一时间段只有一个子进程，只翻译一个文件
  // const output = child_process.execSync(`node ./scripts/translate.js ${mdPath}`, { encoding: 'utf8' });
  // console.log(output);

  // (2). 不堵塞主进程的异步版，同一时间段可能存在多个子进程，在翻译多个文件
  const stream = child_process.spawn('node', ['./scripts/translate.js', mdPath], { shell: true });
  stream.stdout.on('data', data => {
    console.log(`Translating: ${data}`);
  });
});