# -*- coding: utf-8 -*-
# translate.py

# This code shows an example of text translation from English to Simplified-Chinese.
# This code runs on Python 2.7.x and Python 3.x.
# You may install `requests` to run this code: pip install requests
# Please refer to `https://api.fanyi.baidu.com/doc/21` for complete api document

import os
import time
import pandas as pd
import requests
import random
import json
import re
from hashlib import md5


# global
# Set your own appid/appkey.
appid = '20210319000733266'
appkey = 'K1LAZrAz0u0qj1KnRxaT'

# For list of language codes, please refer to `https://api.fanyi.baidu.com/doc/21`
from_lang = 'en'
to_lang = 'zh'

url = 'http://api.fanyi.baidu.com/api/trans/vip/translate'


def getResultFromBaidu(text):
    '''
    调用百度翻译API
    每次传入一段，不要超过百度服务器单次接受的上限
    '''

    query = text

    # Generate salt and sign
    def make_md5(s, encoding='utf-8'):
        return md5(s.encode(encoding)).hexdigest()

    salt = random.randint(32768, 65536)
    sign = make_md5(appid + query + str(salt) + appkey)

    # Build request
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    payload = {
        'appid': appid,
        'q': query,
        'from': from_lang,
        'to': to_lang,
        'salt': salt,
        'sign': sign
    }

    # Send request
    r = requests.post(url, params=payload, headers=headers)
    result = r.json()

    # Show response 对象的整体结构
    # print(json.dumps(result, indent=4, ensure_ascii=False))

    # 提取出{原文, 译文}构成的list
    trans_result_list = result['trans_result']
    # 转化为二维数组
    queryArray = []
    for paragraph in trans_result_list:
        # print(paragraph['src']+'\n')
        print(paragraph['dst']+'\n\n')
        queryArray.append([paragraph['src'], paragraph['dst']])

    return queryArray


def translateTxt(txtname):
    '''
    split a .txt file to paragraphs, translate them and write the result  
    '''

    with open(("./txt/" + txtname + '.txt'), "r", encoding='utf-8') as f:
        corpusData = f.readlines()  # 读成一个大数组，每段是一个元素

    # 调用API翻译
    articleArray = []
    for paragraph in corpusData:
        if paragraph != '\n':
            # 二维数组不断合并
            articleArray += getResultFromBaidu(paragraph)
            time.sleep(0.1)  # 每秒查询的上限为10次

    # 输出翻译结果
    # 输出双语语料为csv
    colname = [from_lang, to_lang]
    df = pd.DataFrame(columns=colname, data=articleArray)
    df.to_csv(("./result/" + txtname + '-bi.csv'),
              index=False, encoding="utf-8-sig")

    # 输出双语对照 .txt
    fo = open(("./result/" + txtname + '-bi.txt'), "w", encoding="utf-8")
    # 二维向量一维化
    seq = [string for para in articleArray for string in para]
    fo.write("\n\n".join(seq))
    fo.close()

    # 输出中文 .md
    fo = open(("./result/" + txtname + '-zh.md'),
              "w", encoding="utf-8")
    seq = []
    for i in range(len(articleArray)):
        if i == 0:
            para_zh = '# '+articleArray[i][1]
        elif i == 1:
            para_zh = '## '+articleArray[i][1]
        else:
            if len(articleArray[i][1]) < 20:
                para_zh = "#### " + articleArray[i][1]
            else:
                para_zh = articleArray[i][1]
        seq.append(para_zh)
    fo.write("\n\n".join(seq))
    fo.close()

# save to .json file
# json_str = json.dumps(result, indent=4, ensure_ascii=False)
# with open('result.json', 'w') as json_file:
#     json_file.write(json_str)


# 主函数，翻译当前文件夹中所有的txt文件
def main():

    # 获取当前路径所有文件
    file_list = os.listdir(os.getcwd()+'/txt/')
    # 获取所有txt文件列表
    txt_list = [
        file for file in file_list if file.endswith((".txt"))]
    # 遍历每个txt文件
    for txt in txt_list:
        # 抽取出'.'之前的文件名
        txtname = os.path.splitext(txt)[0]
        translateTxt(txtname)


main()
