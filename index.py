# index.py
import os


def translatePdf():
    '''
    遍历源文件目录，依次处理每个pdf
    '''

    # 获取源文件夹所有文件名
    filename_list = os.listdir(os.getcwd()+'/pdf/')
    # 获取所有pdf文件名列表
    pdfname_list = [
        filename for filename in filename_list if filename.endswith((".pdf"))]

    # 遍历每个pdf文件
    for pdfname in pdfname_list:
        # 分离文件名和后缀
        name = os.path.splitext(pdfname)[0]
        # 拼接绝对路径和文件名
        pdfpath = os.getcwd() + '/pdf/' + pdfname
        xmlpath = os.getcwd() + '/xml/' + name + '.xml'
        jsonpath = os.getcwd() + '/xml/' + name + '.json'
        txtpath = os.getcwd() + '/txt/' + name + '.txt'

        # pdf2xml
        print("文件类型转换中...")
        os.system(
            "python ./pdf/tools/pdf2txt.py -o {} {}".format(xmlpath, pdfpath)
        )
        # xml2txt
        print("文件内容解析中...")
        os.system("node xml2txt.js")
        # translate
        print("开始翻译：\n\n")
        os.system('python translate.py')

        # 一个pdf的翻译工作完成
        print("翻译完成："+name+'.pdf. Congratulations!! \n\n****************')
        # 删除xml和txt文件夹中的文件
        os.remove(xmlpath)
        os.remove(jsonpath)
        os.remove(txtpath)


translatePdf()
