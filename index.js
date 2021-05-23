//@ts-check
'use strict';
// index.js

const fs = require('fs');
const child_process = require('child_process');


// 1.
// child_process.execSync(`python ./pdf/tools/pdf2txt.py -o ${xmlPath} ${pdfPath}`);



// 2. 
// child_process.execSync('node xml2txt.js');



// 3. 翻译，两种写法均可
const stream = child_process.execSync('node ./scripts/translate.js', { encoding: 'utf8' });
console.log(stream);

// const stream = child_process.spawnSync('node', ['./scripts/translate.js'], { encoding: 'utf8' }); // 这是一个流
// console.log(stream.stdout); // 持续输出这个流