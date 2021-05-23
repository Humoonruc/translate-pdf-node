// testAPI.js

const baiduAPI = require('./baiduAPI');

main();

async function main() {
  console.log(await baiduAPI.getDstArticle('apple\r\nbanana', 'en', 'jp'));
}