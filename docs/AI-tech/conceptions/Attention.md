
**这篇文章介绍下global attention 和 local attention**

global和local的区别：whether the “attention”is placed on all source positions or on only a few source positions

今天看了下 论文 Effective Approaches to Attention-based Neural Machine Translation，里面研究了attention的两类架构：global attention 和 local attention。这里将读完论文的一些收获记录下来
## **1. Local Attention是什么？**

2020年的ViT横空出世，席卷了模型设计领域，铺天盖地的各种基于Transformer的结构开始被提出，一些在卷积神经网络中取得成功的先验知识，如local operation、多尺度、shuffled等等各种操作和inductive bias被引入Transformer之中。其中比较成功地将local operation引入ViT当中，利用shift window的Swin Transforerm一举获得多个任务的SOTA结果，并获得了Best Paper Award。而其中最核心的模块，Local Attention，究竟有什么神秘之处呢?

Local attention本质上实在一个2D local window内进行特征聚合，但其每个位置的聚合权重，通过KQV之间计算Attention similarity得到（主要包括dot-production, scaling, softmax），是一个无参数的动态计算的局部特征计算模块。

ICLR这篇文章的先前版本 （Demystifing Local Vision Transformer）在2021年六月就首次正在arxiv公布并分析了local attention的三个强大设计原则：

(1) 稀疏连接。指一些输出变量和一些输入变量直接没有相互连接。它有效的减少了模型的复杂度而不减少输入输出变量个数。在Local Attention当中，稀疏连接体现在两个方面：一是Local Attention在图像空间上，每一个output值仅与局部的local window内的input相连接，与ViT的全像素（token）连接不同。二是Local Attention在通道上，每一个output channel仅与一个input channel连接，没有交叉连接，不同于group convolution与normal convolution。

(2) 权重共享。意味着有一些连接的权重是相同且共享的，它降低了模型的参数量，同时不需要增加训练数据即可增强模型。在模型中，一个权重被共享使用，可以被认为针对该权重的训练样本增加，有助于模型的优化。在Local Attention中，权重共享通过multi-head self-attention来实现，通过讲channel分成head（group），在同一个head内共享使用了一组聚合权重，降低了聚合权重的参数量（非模型参数量）。

(3) 动态权重。是指根据不同样本的特征，动态地产生连接权重。它能够增加模型的容量。如果把连接权重看作是隐层变量，这种动态权重可以看作是增加模型的容量的二阶操作。Local Attention的动态权重体现在每一个连接的聚合权重都是根据样本特征使用基于dot-product的方式计算得到的。

通过以上三个模型设计原则，Local Attention表现出优异的效果。然而，这些特性也天然存在于CNN结构当中，尤其是（Dynamic）Depth-wise卷积。

## **2. （Dynamic）Depth-wise卷积和Local Attention的前世今生**

逐步拆解Local Attention的操作，可以发现在稀疏连接、权重共享、动态权重三个维度上，都与历史霸主CNN结构中的（Dynamic）Depth-wise卷积很相似。Depth-wise卷积可谓是一个被长期使用又被渐渐遗忘在历史长河中的结构，那么其在模型设计上又有哪些准则呢？

(1) 稀疏连接。不难发现，Depth-wise卷积的稀疏连接特性与Local Attention完全相同，在图像空间上局部链接，在通道上稀疏连接。

(2) 权重共享。权重共享的概念最初就诞生于卷积操作之中，Depth-wise卷积同样得益于权重共享操作，但与Local Attention略有不同，Depth-wise卷积在图像空间上共享权重，每一个空间位置都是用相同权重的卷积核来进行特征聚合，而在channel上，每一个channel使用独立的聚合权重。

(3) 动态权重。动态权重的设计原则在原始的Depth-wise卷积中并没有被使用，然而，动态卷积作为一个被广泛研究的领域，可以轻易的将dynamic特性引入Depth-wise卷积中，形成feature dependent的聚合权重。

尽管在权重共享上两者的共享方式不同，经过实验，本文发现以Local MLP（去掉dynamic特性的local attention）为例，在channel和spatial维度上共享权重的影响并不大，在任何一个维度共享权重，均可以降低模型的参数量，帮助模型优化。而在动态权重上，虽然两者不同，但Depth-wise卷积仍然可以轻易具备动态特性。

# appendix
[理解Attention:从起源到MHA,MQA和GQA](https://zhuanlan.zhihu.com/p/686149289)
[Transformer不比CNN强！Local Attention和动态Depth-wise卷积的前世今生](https://zhuanlan.zhihu.com/p/491105975)


