
首先MoCo v3不应该是这篇论文的重点，这篇论文的重点应该是将目前无监督学习最常用的对比学习应用在ViT上。MoCo v3相比v2去掉了memory queue，转而像SimCLR那样采用large batch来取得稍好一点的结果，从结构上encoder fkf_k 借鉴BYOL那样增加了一个prediction head，在ResNet上效果有稍许提升

MoCo v3 的算法原理不应该是这篇论文的重点，这篇论文的重点应该是将目前无监督学习最常用的对比学习应用在 ViT 上。MoCo v3 相比 v2 去掉了 memory queue，转而像SimCLR 那样采用[large batch](https://www.zhihu.com/search?q=large%20batch&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A2581091949%7D)来取得稍好一点的结果，从结构上 encoder f_q 借鉴 BYOL（Bootstrap Your Own Latent: A New Approach to Self-Supervised Learning） 那样增加了一个 [prediction head](https://www.zhihu.com/search?q=prediction%20head&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A2581091949%7D)（两层FC），在ResNet上效果有稍许提升。最后通过大量的实验，去证明如何去克服自监督中引入 ViT 训练不稳定的问题。

作者给出的结论是：影响自监督 ViT 模型训练的关键是：instability，即训练的不稳定性。这种训练的不稳定性所造成的结果并不是训练过程无法收敛 (convergence)，而是性能的轻微下降 (下降1%-3%的精度)。

不一样的是 MoCo V3 在网络结构的组成 Framework 有所差异，具体如图所示。因为引入了 ViT 视觉Transformer结构，所以对数据的输入不再是一张完成的图片，而是 image Patch。另外 Transformer对于长序列具有 Attention 的 Q、K、V 结构能够存储和记忆大量的信息，因此取消了 Memory Queue，直接利用大 Batch Size 来进行学习训练。

![](https://picx.zhimg.com/80/v2-3ce6edec7d95f0203541f2584bea9844_1440w.webp?source=1def8aca)

MoCo v3 的训练方法和 MoCo v1/2 的训练方法的差异是：

**取消 Memory Queue，用大 Batch Size**：MoCo V3 的 Framework 里面没有 Memory Queue，这就意味着 MoCo v3 所观察的负样本都来自一个 Batch 的图片。换句话讲，只有当 Batch size 足够大时，模型才能看到足够的负样本，所以 MoCo v3 中 Batch size = 4096 这样一个巨大的 Batch size。

**学习 BYOL 添加 Prediction head**：Encoder f_q 除了 Backbone 和预测头 Projection head 以外，还添加了个 Prediction head，是遵循了 BYOL 这篇论文的方法。即 Encoder f_q（ViT(BP) + Projection head + Prediction head），Encoder f_k（ViT(Momentum) + Projection head）。  

**Contrastive loss的更新方式修改**：对于同一张图片的2个增强版本 x1​,x2​ ，分别通过 Encoder f_q​ 和 Momentum Encoder f_k​ 得到 q1​,q2​ 和 k1​,k2​。让 q1​,k2​ 通过 Contrastive loss (式 1) 进行优化 Encoder f_q​的参数，让 q2​,k1​ 通过 Contrastive loss (式 1) 进行优化 Encoder f_q​的参数。Momentum Encoder f_k ​则跟 MoCo V1 版本相同通过动量更新。即：
$$
loss = contrastive(q1,k2)+contrastive(q2,k1)
$$

重头戏主要在MoCo v3在ViT上的实验，这里简单总结如下：

（1）从实验结果来看，基于MoCo v3训练的ViT-BN-L/7模型在ImageNet linear probing protocol上取得了新的SOTA，超过Top-1 acc达到81.0%，超过79.8% with SimCLR v2 (SK-ResNet152-3×), and 79.6% with BYOL (ResNet200-2×)。这证明了ViT在[无监督训练](https://www.zhihu.com/search?q=%E6%97%A0%E7%9B%91%E7%9D%A3%E8%AE%AD%E7%BB%83&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A1826367462%7D)上的优势。

（2）发现了**ViT在无监督训练过程中的[instability](https://www.zhihu.com/search?q=instability&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A1826367462%7D)**，这个训练不稳定并不会导致灾难性的性能骤降，而只是稍许的性能下降，这就比较难以察觉。batch size和lr会明显影响ViT训练的稳定性，比如batch size为6144时，从训练过程中的[acc曲线](https://www.zhihu.com/search?q=acc%E6%9B%B2%E7%BA%BF&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A1826367462%7D)可以看到会出现比较明显的“dips”，这就好像网络又重开始训练一样。虽然训练不稳定，但最终的效果为69.7，相比[batch size](https://www.zhihu.com/search?q=batch%20size&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A1826367462%7D)为2048的72.6只掉了不到3个点。当lr过大时也会导致instability。

![](https://picx.zhimg.com/80/v2-127d6c3127ada44a5324bc1f6b28ea41_1440w.webp?source=2c26e567)

论文中进一步分析这个"dips"出现的原因，发现其实是训练过程中的梯度会出现陡峰造成的，而且发现[first layer](https://www.zhihu.com/search?q=first%20layer&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A1826367462%7D)先出现，然后延迟一些iterations后[last layer](https://www.zhihu.com/search?q=last%20layer&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A1826367462%7D)也出现梯度骤增。所以这种训练不稳定性是由于first layer造成的可能性比较大。

![](https://picx.zhimg.com/80/v2-5ada77c50e302ee562c5956f4780a5fe_1440w.webp?source=2c26e567)

论文中提出的一种解决方案是，ViT采用**a fixed random patch projection layer**，这相当于这[patch embedding](https://www.zhihu.com/search?q=patch%20embedding&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A1826367462%7D)是固定的，而不是训练得到的（其实对projection layer做gradient clip也是可以，但是最终发现需要设定一个极小的阈值，这就等价于freeze它了）。这个简单的trick可以解决部分这种训练的instability：

![](https://pic1.zhimg.com/80/v2-e3d7405ceccd5ae0f952b7eb09b50f7b_1440w.webp?source=2c26e567)

但这并没有本质解决这个问题，因为当lr过大时这种现象还是会出现的。

（3）尽管更大的ViT模型可以取得更好的效果，但是还是可以**发现模型越来越大时会出现[saturation](https://www.zhihu.com/search?q=saturation&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A1826367462%7D)的趋势**，当然最简单的解决方案是喂给更多的数据。还有可能是基于instance discrimination的pretext task过于简单，还需要设计更好的pretext task。

（4）**[position embedding](https://www.zhihu.com/search?q=position%20embedding&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A1826367462%7D)的影响**：去除PE，在无监督训练过程去除PE，效果也下降了1个多点。在有监督训练中，去除PE的影响会更大一些，ViT论文中是报道掉了3个点以上。去除PE还能学习的这么好，说明ViT的学习能力很强，在没有位置信息的情况下就可以学习的很好；从另外一个角度来看，也说明ViT并没有充分利用好PE而取得更好的效果，具体是哪个原因还需要进一步的研究。最近的CPVT和CvT也提出引入卷积来去除PE。

![](https://pic1.zhimg.com/80/v2-810140650aacb0fb86e56b8cbcee5f5a_1440w.webp?source=2c26e567)

---

最后摘抄论文中的两段脚注（**透过现象看本质**）：

**self-attention** vs **convolution**

> We argue that it is imprecise to simply compare self-attention against “convolutions”. Convolutions [26] by definition have several properties: weight-sharing, locally-connected, translation-equivariant. **All projection layers in a self-attention block have all these properties of convolutions, and are equivalent to 1×1 convolutions**. The counterpart of [self-attention](https://www.zhihu.com/search?q=self-attention&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A1826367462%7D) is more appropriately the non-degenerated (e.g., 3×3) convolutions.

**transformer** vs **resnet**

> **Transformers [41] by design consist of residual blocks [20], and thus are a form of residual networks**. In the literature on “Transformer vs. ResNet”, precisely speaking, the term of “ResNet” refers to the specific design that has [non-degenerated](https://www.zhihu.com/search?q=non-degenerated&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A1826367462%7D) (e.g., 3×3) convolutions

### MoCo V3 算法分析

1. 数据增强：

在ImageNet中 有一堆无标签的数据，拿出一个 MiniBatch，代码表示为 x，也就是 N 张图片，分别进行两种不同的数据增强，得到 x_1 和 x_2，此时 x_1 是 N 张图片，x_2 也是 N 张图片。

```python
for x in loader: # load a minibatch x with N samples
    x1, x2 = aug(x), aug(x) # augmentation
```

2. 分别通过 Encoder 和 Momentum Encoder：

x_1 分别通过 Encoder 和 Momentum Encoder 得到特征 q_1 和 k_1，维度是 [N,C]，这里特征空间由一个长度为 C=128 的向量表示。

x_2 分别通过 Encoder 和 Momentum Encoder 得到特征 q_2 和 k_2，维度是 [N,C] ，这里特征空间由一个长度为 C=128 的向量表示。

```python
q1, q2 = f_q(x1), f_q(x2) # queries: [N, C] each
    k1, k2 = f_k(x1), f_k(x2) # keys: [N, C] each
```

3. Contrastive loss 的定义：

对两个维度是 [N,C] 的矩阵（比如是q_1和k_2）做矩阵相乘，得到维度是 [N,N] 的矩阵，其对角线元素代表的就是 positive sample 的相似度，就是让对角线元素越大越好，所以目标是整个 [N,N] 的矩阵越接近单位阵越好。

```python
def ctr(q, k):
    logits = mm(q, k.t()) # [N, N] pairs
    labels = range(N) # positives are in diagonal
    loss = CrossEntropyLoss(logits/tau, labels)
    return 2 * tau * loss
```

4. Contrastive loss 优化：

通过一个 Contrastive loss 优化 q_1 和 k_2，通过另一个 Contrastive loss 优化 q_2 和 k_1，并反向传播更新 f_q 的参数：

```python
loss = ctr(q1, k2) + ctr(q2, k1) # symmetrized
    loss.backward()

    update(f_q) # optimizer update: f_q
```

1. Momentum Encoder的参数使用动量更新：

```python
f_k = m*f_k + (1-m)*f_q # momentum update: f_k
```

正常在CNN架构上，Batch size越大，那么自监督学习中负样本数量越大，能够学习更多的负样本特征，但是使用 ViT结构取消 Memory Queue，用大 Batch Size后却出现了 dip 现象，继续实验。

1. Learning rate 过大使得训练不稳定

如下图，Encoder 架构换成 ViT-B/16 ，Batch size=4096，在 ImageNet 数据集上训练 100 epochs 的结果。作者使用了4种不同的 Learning rate：0.5e-4, 1.0e-4, 1.5e-4 的结果。可以看到当Learning rate 较大时，曲线出现了 dip 现象 (稍稍落下又急速升起)。这种不稳定现象导致了精度出现下降。

1. LARS optimizer 的不稳定性

如下图，使用了 LARS 优化器，分别使用了4种不同的 Learning rate：3e-4, 5e-4, 6e-4, 8e-4 的结果。结果发现当给定合适的学习率时，LARS的性能可以超过AdamW，但是当学习率稍微变大时，性能就会显著下降。而且曲线自始至终都是平滑的，没有 dip 现象。所以最终为了使得训练对学习率更鲁棒，作者还是采用 AdamW 作为优化器。因为若采用 LARS，则每换一个网络架构就要重新搜索最合适的 Learning rate。

![](https://picx.zhimg.com/80/v2-b4c6f91e665cfc6bbee92f98ef50d789_1440w.webp?source=1def8aca)

### 提升稳定性的方法
  
既然上面重点分析了 Batch Size、Learning rate 和 LARS optimizer对不稳定性的分析，论文实验中就给出了提升稳定性的方法：**[random patch projection](https://www.zhihu.com/search?q=random%20patch%20projection&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A2581091949%7D)**。

导致训练出现不稳定的这些 dip 跟梯度暴涨 (spike) 有关，第1层会先出现梯度暴涨的现象，结果几十次迭代后，会传到到最后1层。作者解决的办法是冻结第1层的参数，也就是patch embedding那层，随机初始化后，不再更新这一层的参数。

实验结果通过下面的图可以看到，使用 MoCo v3 or SimCLR, BYOL 方法，Encoder 架构换成 ViT-B/16 ，Batch size=4096，在 ImageNet 数据集上训练 100 epochs 的结果，不同的是冻结了patch embedding那层的参数，使用了随机参数初始化。

不论是 MoCo v3 还是 SimCLR, BYOL 方法，冻结 patch embedding 那层的参数都能够提升自监督 ViT 的训练稳定性。除此之外， [gradient-clip](https://www.zhihu.com/search?q=gradient-clip&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A2581091949%7D) 也能够帮助提升训练稳定性，其极限情况就是冻结参数，真的可以避免出现 dip 现象。

![](https://picx.zhimg.com/80/v2-c084c36fc7a516da3d515220a8d16940_1440w.webp?source=1def8aca)

## 对比实验

有意思的是这篇论文的写作方式，首先通过实验发现问题，然后通过实验去解决问题，然后再做一些对比实验，深度学习发文章真的是实验对比非常重要。

作者对 1) [position embedding](https://www.zhihu.com/search?q=position%20embedding&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A2581091949%7D) 的具体形式，2) class token 的必要性，3) Prediction head 的必要性和 4) momentum 超参数的影响分别做了不同的对照实验。其中 position embedding 和 [class token](https://www.zhihu.com/search?q=class%20token&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A2581091949%7D) 的影响分析比较重要，另外两个对精度影响在千分之一之间。

1. [位置编码](https://www.zhihu.com/search?q=%E4%BD%8D%E7%BD%AE%E7%BC%96%E7%A0%81&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A2581091949%7D)的具体形式

在 Transformer 结构里面position embedding很重要，在无监督训练过程去除位置编码，效果下降了1个多点，说明 ViT 的学习能力很强，在没有位置信息的情况下就可以学习的很好；从另外一个角度来看，也说明 ViT 并没有充分利用好位置信息。

![](https://picx.zhimg.com/80/v2-a51c63625dbeae0baf9174d7ce9811ad_1440w.webp?source=1def8aca)

1. class token 的必要性

使用 class token 的性能是76.5，而简单地取消 class token，并换成 Global Average Pooling 会下降到69.7，这时候最后一层后面有个LN层。如果把它也去掉，性能会提升到76.3。说明 class token 并不是必要的，LN的选择也很重要。个人猜测 负样本中的 Layer Norm 数据归一化很重要，否则会引起负样本数据不均衡。

![](https://pic1.zhimg.com/80/v2-9095a92c0d27ed5f3d04c1306d3a8de3_1440w.webp?source=1def8aca)

文章最值得一提的就是fix random patch这个骚操作了。想从另一个角度说下看法，这个看似诡异反直觉的idea，其实文章有很严谨的推理过程。我看完这个idea的第一感觉就是自己就算想出来也会立刻被自己毙掉不会去试，为什么作者会试并且work了呢，我想这里就体现出和顶级研究者的认知差距了吧。

我们捋一下作者是如何提出这个观点的，试图学习一下人家是怎么思考问题的：

1. **先debug模型：** 因为是自监督训练 ViT，没法直接看效果不好debug。所以想到了用kNN classifier Curve 的方法来极高效的看中间效果。发现训练中间确实会有偶尔 acc 猛掉的情况。
2. **如何观测**：自然想到是不是中间iter模型参数炸了，那我们看看训练中间的gradient怎么样，于是把训练中网络各个层的gradient 可视化，发现确实会偶然炸毛一下。而且发现第一层炸毛之后几十个iter后最后一层会炸毛。
3. **提出假设**：那么自然的因果假设就是，最后一层的炸毛是由第一层参数炸毛引起的，因此第一层参数可能是导致训练不稳定的原因。
4. **设计实验**：既然第一层是“罪魁祸首”，那就试试把他冻结住会怎么样了。于是就有了这篇文章。

这个过程就很自然丝滑，让人感慨深度学习真就不是炼丹，是很有逻辑的。

这点我在想是不是transformer本身就是一个比较 fragile 的结构，我们最近在训 ViT 的时候，也发现很容易炸。再往前追溯，在19年复现 Bert 的时候，也花了很多精力来调参，**可能 Transformer 是一个超参敏感的结构**？

用的还是一样的套路，一张图片，做两个random data augmentation，然后过两个encoder，然后算一个InfoNCE 的loss

## 自监督训练 ViT 的稳定性

这部分开始比较有意思了，开始讲怎么训练一个稳定的 ViT。作者的说法是，ViT 的不稳定，不会体现accuracy上，实际上不稳定的 ViT 也能拿到一个看起来还凑合的准确率。这就比较难办了。然而顶级研究者还是nb，**他们用** [[Unsupervised Feature Learning via Non-Parametric Instance Discrimination|KNN Curve]] **来监控训练是否稳定**


### Batch size & learning rate

Batch Size 和 Learning Rate 是一对好伙伴，要一起看。因为一般learning rate都会根据batch size 做一些scale的操作。这里也不例外，用的是最经典的setting：**_lr x batch_size / 256_**。

在base LR 一定的情况下，batch size越大，反而越挫。4096 和 6144 会比2048这些要差。在batch size一定的情况下（4096），learning rate 太大不行，太小也不行。这个就是overfit和underfit的问题了。

### optimizer

一般都是会选AdamW 来做优化器，作者还比较了一下LARS，在好好调了一下，能微弱涨0.1个点。**但是LARS对LR太敏感了，调一下很容易挫**，所以最后作者还是选了AdamW。我们之前还试过Adam和 SGD，在 ViT 的setting下也是比AdamW 挫一些。值得一提的是，Resnet 的setting下，SGD一直是yyds。

**kNN Curve**

这一部分作者没有细讲，但我挺感兴趣的，翻了一下对应的论文。其实就是一个无需训练的分类指标。做法就是，每个epoch结束之后，用当前的参数对整个test set进行编码得到embedding，然后每条数据和所有数据都算cosine相似度，召回top k，做一个weighted的投票来预测当前这条数据的类别。

**用kNN classifier Curve的好处就是，可以极其高效的看模型的效果**。可能会问，为什么不直接看train 的指标呢？因为train的指标容易过拟合。

其实在有监督的setting下，是没有这个问题的，因为有监督的setting下，每个epoch结束可以直接看val集的acc。但这里是自监督的setting，没法直接看下游的acc。

## Tricks on Stability

OK，讲完 ViT 训练不稳定之后，一个自然的问题就是，怎么让他稳定啊。一般遇到这么虚的问题，感觉都挺不知所措的。这里开始展现作者的功力了，作者将训练时每一个iteration的网络的每一层的gradient都记录了下来，如下图。**发现在训练的过程中，梯度会有一些尖刺。而且往往是第一层先出现，然后过几十个iter之后，最后一层会出现。**

![](https://pic4.zhimg.com/80/v2-395f9a6b97f545454f6a43fbd3ecdb0b_1440w.webp)

ViT 训练时 第一层和最后一层的gradient 可视化。发现第一层出现尖刺后，几十个iter之后最后一层也会出现尖刺。

在这个观察下，作者提出了一个假设：**训练不稳定是发生在训练时前面几层浅层网络上的，然后才慢慢衍生到后面层。并提出一个大单的做法：将第一层patch projection 层固定住！**看到这我还是挺吃惊的，毕竟在没训练的情况下，第一层patch projection是随机初始化的，这是要把一个随机初始化的参数冻结住，让网络学习一个随机层映射出来的表示？？好大胆的想法。结果证明，确实冻结住第一层会可以稳定训练

作者还尝试了其他的自监督方法，SimCLR、BYOL，fix random patch 这个trick也是work的。还在 SwAV 上试了一下，SwAV 的好处是，他的不稳定是直接nan loss（这个挺好的），然后这个trick依旧work。总而言之，**fix random patch 对所有自监督框架+ViT setting都有效**。

作者还试了可能能增加稳定性的方法，比如BatchNorm、WeightNorm、gradient clip。前两个norm没有用，gradient clip在很小的情况下有用，但很小的情况下就等价于fixed住了。

以前有knn Classifier、Linear Classfier和SemiSupervised Learning三种与分类器有关的度量特征空间的指标，knn就是用最近的几个来投票，Linear Classifier要用所有标签来训练一个fc层作为分类器，Semi Supervised Learning是每类取1%或者10%的标签训练一个fc作为分类器。现在knn已经被最新的paper废弃了，猜测可能是因为在这个指标上得不到好的结果，后两个指标还一直坚挺。但是，我个人觉得knn更简便一些，也更有挑战性，因为你在标数据的时候，是不知道标了多少数据才标了所有类别的1%，不知道所有类别到底多少类，另外标签不平衡，会导致那些样本少的数据很少有机会被标注到。
# appendix
https://www.zhihu.com/question/453203448/answer/1826367462  
https://www.zhihu.com/question/453203448/answer/2581091949
https://www.zhihu.com/question/453203448/answer/1840244013  
https://zhuanlan.zhihu.com/p/362895949

# paper
https://arxiv.org/abs/2104.02057
[[2104.02057v4.pdf]]