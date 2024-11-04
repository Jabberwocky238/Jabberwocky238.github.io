---
authors: [jabberwocky238]
tags: 
    - zh
---
# markdown上传知乎最佳实践

长期维护，变动多

<!-- truncate -->

## 一，图片处理

知乎不能识别base64风格的markdown图片，不能通过这种方式上传，但是它可以识别github生链接和gitee生链接。

gitee有审查，可能会麻烦，但是简单容易debug的方式，就是上传gitee，把该图片的生链接找到，直接嵌入文件，实现单文件上传。

### 1. 举例

我在gitee仓库里有一张图片：

```
七草日花.jpg
```

转换成https的gitee连接：

[gitee仓库图片](https://gitee.com/jabberwocky238/jabberwocky238.github.io/tree/main/blog/2024-11-02-zhihu-markdown-best-practice/七草日花.jpg)

```txt
https://gitee.com/jabberwocky238/jabberwocky238.github.io/tree/main/blog/2024-11-02-zhihu-markdown-best-practice/七草日花.jpg
```

转换成raw文件的连接：

[gitee仓库raw文件](https://gitee.com/jabberwocky238/jabberwocky238.github.io/raw/main/blog/2024-11-02-zhihu-markdown-best-practice/七草日花.jpg)

```txt
https://gitee.com/jabberwocky238/jabberwocky238.github.io/raw/main/blog/2024-11-02-zhihu-markdown-best-practice/七草日花.jpg
```

嵌入文件：

```md
![七草日花](https://gitee.com/jabberwocky238/jabberwocky238.github.io/raw/main/blog/2024-11-02-zhihu-markdown-best-practice/七草日花.jpg)
```

最终效果：

![七草日花](七草日花.jpg)

同理可以转化成github版本，或者自建站。


## CHANGELOG  
> created at: 2024-11-02T13:00  


