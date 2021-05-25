

[TOC]

## 外文 PDF 批量自动翻译项目——Node.js 版



### 使用方法

1. 下载或克隆（`git clone`）项目文件夹到本地。项目地址为：

   1. 国内：https://e.coding.net/humoonruc/node.js-demo/translate-pdf-node.git
   2. 海外：https://github.com/Humoonruc/translate-pdf-node.git
   3. 可复用 API：https://humoonruc.github.io/translate-pdf-node/

   ![git-clone](http://humoon-image-hosting-service.oss-cn-beijing.aliyuncs.com/img/typora/JavaScript/git-clone.gif)

2. 在百度翻译开放平台（https://api.fanyi.baidu.com/product/11）申请通用翻译API（每月免费额度为2000万字符），获得 APP ID和密钥

3. 在项目文件夹的 `/scripts/` 子文件夹中，新建 `config.js` 文件，写入以下内容，并填入刚刚申请好的百度翻译 APP ID 和密钥，以及根据需求调整源文件语言和目标语言的参数码

   ```js
   // config.js
   
   module.exports.BAIDU_TRANSLATE_ID = 'APP ID';
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

   ![npm-install](http://humoon-image-hosting-service.oss-cn-beijing.aliyuncs.com/img/typora/JavaScript/npm-install.gif)

6. 安装所需的 python 第三方库：继续在终端输入

   ```shell
   pip install pdfminer.six
   ```

   ![image-20210524185248516](http://humoon-image-hosting-service.oss-cn-beijing.aliyuncs.com/img/typora/JavaScript/image-20210524185248516.png)

7. 将想要翻译的外文 pdf 文件放入项目文件夹的 `/pdf/` 子文件夹

8. 在终端中切换到项目文件夹根目录，输入：

   ```shell
   node index.js
   ```

   ![node-index](http://humoon-image-hosting-service.oss-cn-beijing.aliyuncs.com/img/typora/JavaScript/node-index.gif)
   
   然后等待程序运行完毕即可。翻译完成的 md 文件位于 `/md/translate-result/`子文件夹中，这是一种文本文件，用记事本即可打开。
   
   ![translated](http://humoon-image-hosting-service.oss-cn-beijing.aliyuncs.com/img/typora/JavaScript/translated.gif)

### 程序流程

1. 使用 Node 模块`child_process`调用系统终端开启子进程，如此可以广泛地调用各种语言编写的脚本文件。
2. 修改 pdf 文件名。学术论文的文件名中常有许多空格，会给程序运行带来极大隐患，故首先将所有的空格用连字符`-`替换。
3. 使用 Python 第三方库`pdfminer.six`，将 pdf 文件解析为 xml 文件，尽最大可能恢复文档的结构。在解析 pdf 领域，pdfminer 似乎是目前最好的第三方库，我在 npm 上找了很久，都没有找到性能与之接近的 JavaScript 模块。
4. 使用 Node 模块`x2js`，将 xml 文件转换为易操作的 json 文件。
5. 从 json 中提取结构化的字符信息，重新整合为行、段、页、篇，并保存为 txt 纯文本文件。
6. 运用正则表达式解析文本，从 txt 文件中提取文章主体（不要参考文献），以及 abstract、keywords、Introduction、conclusion 等重要信息，保存为 md 文件。
7. 调用云计算商提供的翻译 api，翻译英文文本，将翻译结果保存为 md 文件。

本项目中，原始 pdf 文档的格式经历了如下变化：pdf->xml->json->txt->md，最大限度地保留了 pdf 文本的结构信息。

如此批量翻译外文 pdf 文件，可以极大地减轻泛读文献、报告的压力。

### 优化方向

本项目的初版借鉴过 GitHub 上的一个自动生成综述的开源项目。那个作者的代码层级过深，再加上 Python 强制要求4格缩进，后面就出现了缩进地狱，可读性非常差：

![缩进地狱2](http://humoon-image-hosting-service.oss-cn-beijing.aliyuncs.com/img/typora/JavaScript/缩进地狱2.png)

因此本项目的新版将编程语言从 Python 切回了用大括号和分号间隔代码块的 JavaScript，在代码的组织上也充分利用了模块系统，写起来顺手了很多，代码的逻辑性和可读性都大大增强了。

![image-20210525091818415](http://humoon-image-hosting-service.oss-cn-beijing.aliyuncs.com/img/typora/JavaScript/image-20210525091818415.png)

但这个小工具使用起来仍然不是太方便，安装流程也不够傻瓜化。以后假如有时间，考虑写成网页版，用户输入自己的账号密码，把 PDF 往网页里一扔，过一会儿就能返回可供下载的结果，这是最好的。

但这貌似是砸某些人的饭碗呀！

各大公司的 PDF 全文翻译服务卖到现在这种高价，简直无良。希望这个价格以后能降下来，我又何必做这种小工具呢。
