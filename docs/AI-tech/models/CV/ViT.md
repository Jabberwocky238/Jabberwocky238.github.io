# 原论文解读
(Dosovitskiy et al., 2021)


# 坊间解读
## 位置编码
https://zhuanlan.zhihu.com/p/564970361
在VIT原论文中，作者使用了三种位置编码

第一种是1-D绝对位置编码，例如将图片切分后序列长度为9，宽度为768，则初始输入维度为9 x 768，经过Linear Projection之后序列维度依然为9 x 768，加上特殊字符后整个序列维度是10 x 768，此时在送入到Transformer Encoder之前需要sum上1-D位置编码，位置编码的维度也是10 x 768，这里的1-D绝对位置编码是可以学习的
![[Pasted image 20240414150411.png]]
2-D绝对位置编码考虑到了patches的二维位置信息，即认为每个图像块有横纵两个维度的坐标信息，第一个维度对应一组368-D的位置编码（蓝色），第二个维度对应另一组368-D的位置编码（红色），两个维度的位置编码concat之后维度依然是768，这里的位置编码同样是可以学习的
![[Pasted image 20240414150433.png]]


感觉很多答案都回答得很好了。

我就只说一点，经过在 Kaggle 上实践十几个数据集之后，我得到的结论是 [ViT 系模型](https://www.zhihu.com/search?q=ViT%20%E7%B3%BB%E6%A8%A1%E5%9E%8B&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A2797528246%7D)全都是“近视眼”。

（ViT 系模型: Vision Transformer 系列模型总称，包括 vit, swin, cait, deit, [xcit](https://www.zhihu.com/search?q=xcit&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A2797528246%7D), deit 等等）

比如说像下图这样的，哪怕你有近视眼，还是能分辨出狮子是狮子。
  

而 CV 科研界圣杯 ImageNet 里全是这样的图片，因此 ViT 系模型能大显身手。

在 Kaggle 里的类 ImageNet 数据的比赛中 ViT 确实能占一席之地，和 [CNN](https://www.zhihu.com/search?q=CNN&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A2797528246%7D) 分庭抗礼 （并不是一边倒）。

但如果换成这样的图片，要在几千x几千像素的图片里分辨出这种像素级别的细节，那就不是 ViT 系模型的强项了，甚至在某些个数据集上基本无法正常收敛。

![](https://picx.zhimg.com/80/v2-9bb19b55f2cb3028b3972662749095e3_1440w.webp?source=1def8aca)

可以去看 Kaggle 上近两年的医疗图像比赛，金牌区基本看不到用 ViT 系模型的，清一色 CNN。

没有，至少大核CNN没有。不但在CV界没有，在其他模态也没有。我们最新的工作表明，大核CNN的大一统能力可能不弱于[Transformer](https://www.zhihu.com/search?q=Transformer&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A3307390485%7D)。
  
**问：对视觉领域而言，在Transformer发展的浪潮下，继续研究CNN的意义是什么？是因为CNN在某些情况下（如小模型、边缘设备）更高效吗？**

**答：** 这个问题的提出似乎隐含了一个假设，就是“Transformer本质上强于CNN”，所以“CNN只有在某些Transformer看不上或者还没来得及吊打的领域苟延残喘”。

其实Transformer和CNN谁强谁弱这个问题被人从2020年讨论到2023年，也没什么意思了。反正都是以可学习的方式实现序列建模，训练过程也都是黑盒子，最终效果也差不多，我们有什么证据支持Transformer本质上强于CNN？即便把“某些情况”这种定语去掉，即便不考虑成本和部署的因素，就单纯比理想情况下的性能极限，也没有理由认为Transformer本质上更强。

Transformer本质优越论持有者普遍认为Transformer的scaling law更为优秀，在数据量和模型量级超大的情况下更强，但是google最新的工作（[https://arxiv.org/abs/2310.16764](https://link.zhihu.com/?target=https%3A//arxiv.org/abs/2310.16764)）用JFT-4B训练[NFNet](https://www.zhihu.com/search?q=NFNet&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A3307390485%7D)也达到了90.4%的ImageNet精度（NFNet可是年龄跟ViT差不多的老模型了），这证明至少在图像领域，Transformer和CNN只不过是相互交融的两种模型罢了，ViT也这么多年了，这种谁强谁弱的讨论没必要延续到2024年了。

**问：如何用CNN做各种生成任务？这是不是CNN的本质弱点？**

**答：** ViT刚出现的时候做的也不过就是图像分类，连目标检测和语义分割都不好做，被广泛评价为“难以处理下游任务，部署困难，训练昂贵，建议手上没有[TPU](https://www.zhihu.com/search?q=TPU&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A3307390485%7D)的玩家敬而远之”。


## appendix
https://www.zhihu.com/question/531529633/answer/2797528246  
https://www.zhihu.com/question/531529633/answer/3307390485  














