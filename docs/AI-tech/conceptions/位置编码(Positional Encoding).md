# 常见位置编码
1，[[RoPE]]
2，

# 知乎
https://www.zhihu.com/question/453193028/answer/1829291276
self-attention本身是对tokens的顺序是不敏感的，所以如果没有位置编码，那么transformer就只能依靠patches之间的纯语义来建模，这就相当于模型自己要学会“拼图”，或者类似一个“词袋模型”。从ViT的实验看，去掉position embedding后，性能会下降3个点以上，对结果还是影响比较大的。另外图像任务比如分割和检测大部分都是可变输入的，固定的PE对此并不友好，需要finetune。

目前的研究如CPVT和CvT可以在transformer引入卷积来隐式地编码位置信息，这就避免了直接使用PE，从结果上看，效果也和采用PE类似。

[CPVT：一个卷积就可以隐式编码位置信息148 赞同 · 21 评论文章](https://zhuanlan.zhihu.com/p/362484098)

另外MoCo v3中也提到了PE的问题，发现去掉PE，对ViT进行无监督训练，性能下降只有不到2%。He神更倾向认为就算加了PE，可能模型也没有充分利用好位置信息。这个问题还需要进一步研究。

[小小将：如何评价Kaiming He团队的MoCo v3？268 赞同 · 8 评论回答![](https://picx.zhimg.com/v2-043768f7b35cacfd5917d4d65b22aad2_720w.jpg?source=7e7ef6e2)](https://www.zhihu.com/answer/1826367462)
我个人认为文本和图像还是差异比较大的，图像毕竟属于一个高维连续空间。PE可能对文本建模影响比较大，但是对图像可能影响没那么大。ViT模型完全只依靠一堆无序的patches就能够学习得足够好。

- **混合的相关性：** 绝对位置编码采用加法操作将位置嵌入（positional embeddings）与词嵌入（word embeddings）相加。这个操作在位置信息和词义信息之间引入了混合的相关性，使得在[注意力机制](https://www.zhihu.com/search?q=%E6%B3%A8%E6%84%8F%E5%8A%9B%E6%9C%BA%E5%88%B6&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A3196023627%7D)中出现了混合和噪声的关联。这可能导致模型的表达能力受到限制。
- **随机性：** 由于混合相关性的存在，绝对位置编码可能引入不必要的随机性。在模型中，这种随机性可能表现为无法稳定地捕捉到单词位置与其含义之间的准确关系。这种随机性可能对模型的性能产生负面影响。

  
  