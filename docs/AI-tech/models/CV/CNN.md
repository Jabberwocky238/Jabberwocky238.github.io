
在很多任务下，CNN依然是SOTA；在计算机视觉领域，Transformer并不像在NLP领域对LSTM、RNN等传统方法具有“毁天灭地”的影响。

![](https://pic1.zhimg.com/80/v2-162b5bc0cff35cb5368e8ac58ee85845_1440w.webp?source=2c26e567)

卷积神经网络的核心是通过卷积核学习和检测图像中的模式和特征，随着卷积层的加深，[filters](https://www.zhihu.com/search?q=filters&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A3291275883%7D)逐渐学习到更高级的表征，比如从浅层的边缘、颜色等信息到深层的语义信息。

CNN中一个关键的概念是 **[归纳偏置](https://www.zhihu.com/search?q=%E5%BD%92%E7%BA%B3%E5%81%8F%E7%BD%AE&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A3291275883%7D)**（inductive biases），它通过这种机制对相邻像素的空间信息进行编码。[inductive biases](https://www.zhihu.com/search?q=inductive%20biases&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A3291275883%7D)对CNN非常重要，它强化了局部连接的概念，确保了图像数据中相邻数据之间往往有更强的连接关系。这些偏差帮助 CNN 学习并从图像中提取有用的特征，例如边缘、角点和纹理，所以在很多视觉人物中，CNN都可以作为一个的特征提取器（[feature extractor](https://www.zhihu.com/search?q=feature%20extractor&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A3291275883%7D)）来使用。

相比之下，Transformers 并不严重依赖这种局部偏差，而是使用自注意力机制来捕获输入数据中元素之间的关系。

通过[Transformer架构](https://www.zhihu.com/search?q=Transformer%E6%9E%B6%E6%9E%84&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A3291275883%7D)，ViTs像它在NLP领域中一样，能捕获长距离上下文之间的依赖关系，放在图像信息中，也就是对于[全局特征](https://www.zhihu.com/search?q=%E5%85%A8%E5%B1%80%E7%89%B9%E5%BE%81&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A3291275883%7D)的学习能力更强。就像其他答主做的类比中提到的，ViTs就像一个近视眼，能“模糊”的看清整张图片的内容。这一点与CNN是不同的，CNN使用局部卷积，对图像特征的学习与卷积层的深度有关系，到更深层，才有可能学习到更高级的全局特征。


关于ViTs和CNN之间更细致的差异，2022年，谷歌团队专门针对这个问题做了细致全面的研究。链接：[Do Vision Transformers See Like Convolutional Neural Networks?](https://link.zhihu.com/?target=https%3A//arxiv.org/abs/2108.08810)


研究人员分析了ViTs局部/全局空间信息的利用方式，发现 ViT 在较低层比 [ResNet](https://www.zhihu.com/search?q=ResNet&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A3291275883%7D) 包含了更多的全局信息，从而导致特征在数量上有所不同。为了理解 ViT，研究人员重点研究了这些模型的表征结构。通过定义CKA (Centered Kernel Alignment)指标比较不同网络结构中的[特征相似度](https://www.zhihu.com/search?q=%E7%89%B9%E5%BE%81%E7%9B%B8%E4%BC%BC%E5%BA%A6&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A3291275883%7D)。

![](https://pica.zhimg.com/80/v2-570efa67793374718ae5361ab7c49952_1440w.webp?source=2c26e567)

如上图所示，当在不同模型架构的层对之间绘制CKA相似度矩阵时，可以观察到ViT具有相对均匀的层相似度结构。相比之下，ResNet 模型在相似性结构上显示出明显的层级差异，较低层和较高层之间的相似度分数较小。这些结果说明，ViT 在整个模型中具有高度相似的表征，而 ResNet 模型在较低层和较高层之间的表征相似性要低得多。

### 在CV界，Transformer可以替代 CNN吗？

ViTs的出现确实刷新了很多benchmark的SOTA，但还是那句话，理论研究和工程应用是有很大区别的。 CNN 对于许多计算机视觉问题仍然有效且高效，特别是在图像数据较少或计算资源有限时，CNN具有不可替代的优势。

这里想多说几句。

CNN刚出来的时候，也有类似于[深度卷积神经网络](https://www.zhihu.com/search?q=%E6%B7%B1%E5%BA%A6%E5%8D%B7%E7%A7%AF%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A3291275883%7D)会彻底灭绝传统的特征点算法的说法，如果从刷榜这个角度来说，那传统特征点确实刷不过CNN，但问题是实际的应用场景千变万化，考虑到实际中的限制条件（有可能是数据，有可能是算力，等等），传统方法依然有它的不可替代之处。

### 多通道卷积

  “这里就要涉及到“卷积核”和“filter”这两个术语的区别。在只有一个通道的情况下，“卷积核”就相当于“filter”，这两个概念是可以互换的。
  
  但在一般情况下，它们是两个完全不同的概念。每个“filter”实际上恰好是“卷积核”的一个集合，在当前层，每个通道都对应一个卷积核，且这个卷积核是独一无二的”
  
  这句话有错吧，filter就是卷积核，filters才是卷积核集，每个卷积核有一个或者多个通道，这个通道数取决于输入的通道数，输入经过每个卷积核卷积形成一个通道，多少个卷积核最后对应着输出的通道数

### 扩张卷积（Dilated Convolution）又称Atrous Convolution

![动图封面](https://pic2.zhimg.com/v2-8f55016e0ffa1db415d8fa4deab31835_b.jpg)

2维卷积，卷积核大小为3，扩张率（dilation rate）为2，无Padding

扩张卷积在进行卷积操作时引入了另一个参数，即扩张率，用以捕捉像素之间的long dependency。扩张率定义了卷积核中的值与值之间的间隔。扩张率为2的3x3卷积核将具有与与5x5卷积核相同的视野，而只使用9个参数。想象一下，使用一个5x5卷积核并删除第二行和列。

这样操作，使得在相同的计算成本下，卷积计算具有更宽的视野，可以捕捉更长的依赖关系。扩张卷积在实时图像分割领域特别受欢迎。适用于需要更加宽泛的视野并且不用多个卷积或更大的卷积核情况。

[https://arxiv.org/abs/1609.03499](https://link.zhihu.com/?target=https%3A//arxiv.org/abs/1609.03499)

Fully Convoluted Network，论文下载地址[https://people.eecs.berkeley.edu/~jonlong/long_shelhamer_fcn.pdf](https://link.zhihu.com/?target=https%3A//people.eecs.berkeley.edu/~jonlong/long_shelhamer_fcn.pdf)

**可变形（Deformable）卷积**

我们常见的卷积核（filter）一般都是呈长方形或正方形的，规则的卷积核往往会限制特征抽取的有效性，更为有效的做法是让卷积和具有任意的形状，那么卷积核是否可以呈圆形或者随意的形状呢？答案是可行的，如下图所示，典型的代表就是Deformable Convolution Network。

![](https://pic2.zhimg.com/80/v2-eb5dec75b0aee02126e0a43b8e5b87e5_1440w.webp)

对比上图所示的a、b两图可以发现，任意形状的的卷积核使得网络可以重点关注一些重要的区域，更能有效且准确的抽取输入图像的特征。

怎么样来实现呢？

![](https://pic3.zhimg.com/80/v2-e2ab4f0272ea8f6985674fc17c5ba99a_1440w.webp)

如上图所示，网络会根据原始的卷积，如图a所示，学习一个offset偏量，通过一些列的旋转、尺度变换、缩放等Transform变换，改变成成任意形状的卷积核，如b、c、d图所示。

Offet代表的Transform怎么实现呢？

![](https://pic1.zhimg.com/80/v2-5226c0d75e580453e218f82dd7f3a3d8_1440w.webp)

在deformable convolution中，会进行两次卷积，第一次卷积计算得到offset的卷积核，第二次是利用第一步得到的offset卷积核进行常规的卷积得到最终输出。重点是第一步中获得offset卷积核。先从input feature map中通过卷积（conv）计算得到offset field，在基于offset field得到最终的offset。注意，offset得到的输出通道数是input feature map的两倍，因为offset包含了在x和y两个方向上的偏置项。

具体细节可以看考Deformable convolution
[https://arxiv.org/abs/1703.0621](https://link.zhihu.com/?target=https%3A//arxiv.org/abs/1703.06211)

**深度可分离（Depth Separable）卷积**

在可分离的卷积中，我们可以将卷积核操作拆分成多个步骤。我们用y = conv（x，k）表示卷积，其中y是输出图像，x是输入图像，k是卷积核。接下来，假设k由公式：k = k1.dot（k2）计算。这就是一个可分离的卷积，因为我们可以使用大小分别为k1和k2两个卷积核进行2个1D卷积来取得相同的结果，而不是用一个大小k进行二维卷积。

![](https://pic2.zhimg.com/80/v2-4c87ec614aea4285c10c3bf630e41a25_1440w.webp)


**Squeeze-and-Excitation Convolution**

Squeeze-and-Excitation 来源于ImageNet2017年的冠军网络SEnet。在传统的LeNet、Inception、ReseNet、DenseNet中，我们认为所有的特征通道（Channel）都是同等重要的，那是否可以给每个通道赋予一个权重呢？SEnet就通过Squeeze-and-Excitation block来实现了这一想法


**转置（Transposed）卷积**

（也称为deconvolutions 或 fractionally stride卷积）


# appendix

https://zhuanlan.zhihu.com/p/77471866