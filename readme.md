

[TOC]

# 外文 PDF 批量自动翻译项目——Node.js 版



## 使用方法

1. 下载本项目文件夹到本地。地址为：

   1. 国内：https://e.coding.net/humoonruc/node.js-demo/translate-pdf-node.git
   2. 海外：https://github.com/Humoonruc/translate-pdf-node.git

2. 在百度翻译开放平台（https://api.fanyi.baidu.com/product/11）申请通用翻译API（每月免费额度为2000万字符），获得 APP ID和密钥

3. 在项目文件夹的 `/scripts/` 子文件夹中，新建 `config.js` 文件，写入以下内容，并填入刚刚申请好的百度翻译 APP ID 和密钥，以及根据需求调整源文件语言和目标语言的参数码

   ```js
   // config.js
   
   module.exports.BAIDU_TRANSLATE_ID = '百度翻译APP ID';
   module.exports.BAIDU_TRANSLATE_KEY = '密钥';
   module.exports.BAIDU_TRANSLATE_API_URL = 'http://api.fanyi.baidu.com/api/trans/vip/translate';
   module.exports.SOURCE_LANGUAGE = 'en'; // 要翻译的 pdf 源文件语言
   module.exports.TARGET_LANGUAGE = 'zh'; // 要翻译的目标语言
   
   /* 语言参数码：
   自动检测	auto
   英语	en
   简体中文	zh
   繁体中文	cht
   文言文	wyw
   日语	jp
   韩语	kor
   法语	fra
   西班牙语	spa
   阿拉伯语	ara
   俄语	ru
   葡萄牙语	pt
   德语	de
   意大利语	it
   希腊语	el
   荷兰语	nl
   波兰语	pl
   泰语	th
   越南语	vie
   */
   ```

4. 在计算机中安装 `Node.js`（下载地址：[Node.js (nodejs.org)](https://nodejs.org/en/)） 和 `Python`（下载地址：[Download Python | Python.org](https://www.python.org/downloads/) ）的最新版本

5. 安装所需的 node 第三方模块：打开终端（如 Windows 上的命令提示符），切换到项目文件夹根目录，输入

   ```shell
   npm install
   ```

6. 安装所需的 python 第三方库：继续在终端输入

   ```shell
   pip install pdfminer.six
   ```

7. 将想要翻译的外文 pdf 文件放入项目文件夹的 `/pdf/` 子文件夹

8. 在终端中切换到项目文件夹根目录，输入：

   ```shell
   node index.js
   ```

   然后等待程序运行完毕即可。翻译完成的 md 文件位于 `/md/translate-result/`子文件夹中，这是一种文本文件，用记事本即可打开。

## 程序流程

1. 使用 Node 模块`child_process`调用系统终端开启子进程，如此可以广泛地调用各种语言编写的脚本文件。
2. 修改 pdf 文件名。学术论文的文件名中常有许多空格，会给程序运行带来极大隐患，故首先将所有的空格用连字符`-`替换。
3. 使用 Python 第三方库`pdfminer.six`，将 pdf 文件解析为 xml 文件，尽最大可能恢复文档的结构。
4. 使用 Node 模块`x2js`，将 xml 文件转换为易操作的 json 文件。
5. 从 json 中提取结构化的字符信息，重新整合为行、段、页、篇，并保存为 txt 纯文本文件。
6. 运用正则表达式解析文本，从 txt 文件中提取文章主体（不要参考文献），以及 abstract、keywords、Introduction、conclusion 等重要信息，保存为 md 文件。
7. 调用云计算商提供的翻译 api[^api]，翻译英文文本，将翻译结果保存为 md 文件。

[^api]: 翻译 API 可以用百度的，最便宜，每月有 200 万字符的免费额度。

本项目中，原始 pdf 文档的格式经历了如下变化：pdf->xml->json->txt->md，最大限度地保留了 pdf 文本的结构信息。

如此批量翻译外文 pdf 文件，可以极大地减轻泛读文献、报告的压力。

## 优化方向

以后有时间了考虑实现网页版。
