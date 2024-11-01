## **1. Transformer与FFN**

Transformer的基本单位就是一层block这里，一个block包含 MSA + FFN，目前公认的说法是，

1. **Attention** 作为token-mixer做spatial interaction。
2. **FFN** （又称MLP）在后面作为channel-mixer进一步增强representation。

从2017至今，过去绝大部分Transformer优化，尤其是针对NLP tasks的Efficient Transformer都是在Attention上的，因为文本有显著的long sequence问题。安利一个很好的总结[Efficient Transformers: A Survey](https://link.zhihu.com/?target=https%3A//arxiv.org/abs/2009.06732)， 来自大佬[Yi Tay](https://link.zhihu.com/?target=https%3A//www.yitay.net/)。到了ViT上又有一堆[attention](https://link.zhihu.com/?target=https%3A//github.com/cmhungsteve/Awesome-Transformer-Attention)改进，这个repo一直在更新，总结的有点多，可以当辅助资料查阅。

而FFN这里，自从Transformer提出基本就是一个 Linear Proj + Activation + Linear Proj的结构，整体改动十分incremental。

![](https://pic2.zhimg.com/80/v2-e6bd8cb1aaeaf0eb7e0ba9ab9e14ef9d_1440w.webp)

Transformer Block示意图 + FFN内部


## **2. Activation Function**

经历了ReLU， GeLU，Swish， SwiGLU等等，基本都是empirical observations，但都是为了给representation加上非线性变换做增强。

- **ReLU** 对pruning挺有帮助，尤其是过去对CNN做pruning的工作，激活值为0大致意味着某个channel不重要，可以去掉。相关工作可查这个[repo](https://link.zhihu.com/?target=https%3A//github.com/he-y/Awesome-Pruning)。即便如此，ReLU造成dead neurons，因此在Transformer上逐渐被抛弃。
- **GeLU** 在过去一段时间占比相当大，直到现在ViT上使用十分广泛，当然也有用Swish的，如[MobileViT](https://link.zhihu.com/?target=https%3A//arxiv.org/abs/2110.02178)。
- **Gated Linear Units** 目前在LLM上非常流行，其效果和分析来源于[GLU Variants Improve Transformer](https://link.zhihu.com/?target=https%3A//arxiv.org/abs/2002.05202)。如PaLM和LLaMA都采用了SwiGLU, 谷歌的Gemma使用GeGLU。

不过，从个人经验上来看（偏CV），改变FFN中间的activation function，基本不会有极大的性能差距，总体的性能提升会显得incremental。NLP上估计会帮助reduce overfitting, improve generalization，但是与其花时间改这个地方不如好好clean data。。。目前来说


## **3. Linear Projections**

说白了就是一个matrix multiplication, 已经几乎是GPU上的大部分人改model的时候遇到的最小基本单位。dense matrix multiplication的加速很难，目前基本靠GPU更新迭代。

**不过有一个例外：** 小矩阵乘法可以结合软硬件同时加速，比如instant-ngp的tiny cuda nn, 64 x 64这种级别的matrix multiplication可以使得网络权重直接放到register， 激活值放到shared memory, 这样运算极快。

![](https://pic3.zhimg.com/80/v2-21e10c00647873a50ab81055c64bbb82_1440w.webp)

Source: https://github.com/nvlabs/tiny-cuda-nn

但是这对今天的LLM和ViT来讲不现实，最小的ViT-Tiny中，FFN也是个192 x (4 x 192）这种级别，更不用说LLM这种能> 10000的。

**那为什么Linear Projection在Transformer里就需要这么大？**

**常见的说法是Knowledge Neurons**。tokens在前一层attention做global interaction之后，通过FFN的参数中存放着大量training过程中学习到的比较抽象的knowledge来进一步update。目前有些studies是说明这件事的，如

- [Transformer Feed-Forward Layers Are Key-Value Memories](https://link.zhihu.com/?target=https%3A//aclanthology.org/2021.emnlp-main.446/)
- [Knowledge Neurons in Pretrained Transformers](https://link.zhihu.com/?target=https%3A//aclanthology.org/2022.acl-long.581/)


问题来了，如果FFN存储着Transformer的knowledge，那么注定了这个地方不好做压缩加速:

1. **FFN变小意味着model capacity也变小**，大概率会让整体performance变得很差。我自己也有过一些ViT上的实验 (相信其他人也做过)，两个FC中间会有个hidden dimension的expansion ratio，一般设置为4。把这个地方调小会发现怎么都不如大点好。当然太大也不行，因为FFN这里的expansion ratio决定了整个Transformer 在推理时的peak memory consumption，有可能造成out-of-memory (OOM) error，所以大部分我们看到的expansion ration也就在4倍，一个比较合适的performance-memory trade-off.
2. **FFN中的activations非低秩。** 过去convnet上大家又发现activations有明显的低秩特性，所以可以通过low rank做加速，如Kaiming的[这篇文章](https://link.zhihu.com/?target=https%3A//ieeexplore.ieee.org/document/7332968)，如下图所示。但是FFN中间的outputs很难看出低秩的特性，实际做网络压缩的时候会发现pruning FFN的trade-off明显不如convnets，而unstructured pruning又对硬件不友好。


![](https://pic3.zhimg.com/80/v2-9bab40a57803c242790adc1d3025872e_1440w.webp)

Source: Zhang et.al, Accelerating Very Deep Convolutional Networks for Classification and Detection

**4. 所以FFN真的改不动了吗？**

当然不是。

我们想改动一个model or module的时候，无非是两个动机：1）Performance。2）Efficiency。

**性能上**，目前在NLP上可以做[Gated MLP](https://link.zhihu.com/?target=https%3A//arxiv.org/abs/2105.08050), 如[Mamba](https://link.zhihu.com/?target=https%3A//arxiv.org/abs/2312.00752)的block中，或者DeepMind的新结构[Griffin](https://link.zhihu.com/?target=https%3A//arxiv.org/abs/2402.19427)。

![](https://pic2.zhimg.com/80/v2-5b63963f44dcb2172319092916d57ab1_1440w.webp)

Source: Griffin: Mixing Gated Linear Recurrences with Local Attention for Efficient Language Models

但是难说这个地方的性能提升是不是来自于更多的参数量和模型复杂度。

在CV上，有个心照不宣的trick，那就是加depthwise convolution引入locality，试过的朋友都知道这个地方的提升在CV任务上有多明显，例如CIFAR100上，DeiT-Ti可以涨接近10个点这样子。。。

但是呢，鉴于最原始的FFN依然是目前采用最广泛的，并且conv引入了inductive bias，破坏了原先permutation invariant的sequence（因为卷积要求规整的shape，width x height）。大规模ViT训练依然没有采用depthwise conv，如CLIP, DINOv2, SAM, etc。

**效率上，** 目前最promising是改成 **Mixture-of-Expert (MoE)**，但其实。。。GPT4和Mixtral 8x7B没出来之前基本是Google在solo，没人关注。当然现在时代变了，Mixtral 8x7B让MoE起死回生。最近这个地方的paper相当多，简单列几个自己感兴趣的：

- [Soft MoE: From Sparse to Soft Mixtures of Experts](https://link.zhihu.com/?target=https%3A//arxiv.org/abs/2308.00951)
- [LoRA MoE: Alleviate World Knowledge Forgetting in Large Language Models via MoE-Style Plugin](https://link.zhihu.com/?target=https%3A//arxiv.org/abs/2312.09979)
- [DeepSeekMoE: Towards Ultimate Expert Specialization in Mixture-of-Experts Language Models](https://link.zhihu.com/?target=https%3A//arxiv.org/abs/2401.06066)

## **5. 达到AGI需要什么结构？**

目前这个阶段，没人知道一周以后会有什么大新闻，就像Sora悄无声息放出来，一夜之间干掉U-Net，我也没法说什么结构是最有效的。

总体上，目前没有任何结构能真的完全beat Transformer，Mamba _目前_ 也不行，如[这篇](https://link.zhihu.com/?target=https%3A//arxiv.org/abs/2402.01032)发现 copy and paste不太行，scaling和in-context能力也有待查看。

考虑到未来扩展，优秀的结构应该满足这么几个东西，个人按重要性排序：

1. **Scaling Law。** 如果model很难通过scale up提升性能，意义不大（针对AGI来讲）。但是建议大家不要针对这个地方过度攻击学术界paper，学术界很难有资源进行这种实验，路都是一步一步踩出来的，提出一个新architecture需要勇气和信心，给一些宽容。嗯，说的就是Mamba。
2. **In-Context Learning能力。** 这个能力需要强大的retrieval能力和足够的capacity，而对于Transformer来讲，retrieval靠Attention，capacity靠FFN。scaling带来的是两者协同提升，进而涌现强大的in-context learning能力。
3. **Better Efficiency。** 说到底这也是为什么我们想换掉Transformer。做过的朋友都知道Transformer训练太耗卡了，无论是NLP还是CV上。部署的时候又不像CNN可以做bn conv融合，inference memory大，low-bit quantization效果上也不如CNN，大概率是attention这个地方low-bit损失大。在满足1,2的情况下，如果一个新结构能在speed, memory上展现出优势那非常有潜力。Mamba能火有很大一部分原因是引入hardware-aware的实现，极大提升了原先SSM的计算效率。
4. **Life-long learning.** 知识是不断更新的，训练一个LLM需要海量tokens，强如OpenAI也不可能每次[Common Crawl](https://link.zhihu.com/?target=https%3A//commoncrawl.org/) 放出新data就从头训一遍，目前比较实际的方案是持续训练，但依然很耗资源。未来的结构需要更高效且持久地学习新知识。

Hallucination问题我反倒觉得不是大问题，毕竟人也有幻觉，比如对于不知道的，或自以为是的东西很自信的胡说一通，强推Hinton怼Gary Marcus这个[视频](https://link.zhihu.com/?target=https%3A//twitter.com/tsarnick/status/1754439023551213845)。我现在写的东西再过几年回来看，说不定也是个Hallucination。。。

**总结:** FFN因为结构最简单但是最有效，被大家沿用至今。相比之下，Transformer改进的大部分精力都在Attention这个更明显的bottleneck上，有机会再写个文章聊一聊这里。

Transformer可以说是最成功的**序列建模架构**。最近，基于Transformer的时间序列分析解决方案也出现了激增，包括**LogTrans**(NeurIPS 2019)、**Informer**(AAAI 2021最佳论文)、**Autoformer**(NeurIPS 2021)、**Pyraformer**(ICLR 2022 Oral)、**Triformer**(IJCAI 2022)和最近的**FEDformer**(ICML 2022)。

Transformer的主要工作动力来自于它的**多头自注意力机制**，它具有显著的**提取长序列元素之间语义相关性的能力**(例如，文本中的单词或图像中的二维patches)。然而，自注意力在一定程度上具有**排列不变性**和“**反序性**”。虽然使用各种类型的位置编码技术可以保留一些有序信息，但在其上**加上自注意力后，仍然不可避免地存在时间信息丢失**。对于语义丰富的应用程序，如NLP，这通常不是一个严重的问题，例如，即使我们重新排序其中的一些单词，句子的语义也会在很大程度上保留下来。然而，在分析时间序列数据时，通常数值数据本身缺乏语义，我们主要感兴趣的是对连续点之间的时间变化进行建模。**也就是说，顺序本身起着最关键的作用**。因此，我们提出了以下有趣的问题：Transformer对长期时间序列预测真的有效吗?

在基于Transformer的解决方案的实验中，所有比较的 **(non-Transformer)基线** 都执行 **自回归**或 **迭代多步**(IMS)预测，已知这些基线在LTSF问题中存在显著的**误差累积效应**。因此，在这项工作中，我们用直接**多步骤(DMS)** 预测策略挑战基于Transformer的LTSF解决方案，以验证其真实性能。

并非所有的时间序列都是可预测的，更不用说长期预测了(例如，对于混沌系统)。我们假设**长期预测只适用于那些趋势和周期性相对明显的时间序列**。由于线性模型已经可以提取这些信息，我们引入了一组令人尴尬的简单模型，称为**LTSF-Linear**，作为比较的**新基线**。LTSF-Linear用单层线性模型对历史时间序列进行回归，直接预测未来时间序列。我们发现，与现有的Transformer中的声明相反，它们中的大多数不能从长序列中提取时间关系，即随着回看窗口大小的增加，预测误差并没有减少(有时甚至增加)。最后，我们对现有的基于Transformer的TSF解决方案进行了各种消融研究，以研究其中各种设计元素的影响。

我们对现有的基于Transformer的解决方案的各个方面进行了全面的实证研究，包括**建模长输入的能力**、**对时间序列顺序的敏感性**、**位置编码**和**子序列嵌入**的影响以及效率比较。

综上所述，我们得出**结论**，Transformer对时间序列的时间建模能力被**夸大了**，至少对于现有的LTSF基准来说是这样。同时，LTSF-Linear实现了更好的预测精度。

# Transformer中常用的模型压缩方法

- 量化：量化的基本思想即利用低比特的数据类型来替代原本的高比特数据类型，同时对数据的存储空间与计算的复杂度进行轻量化。简单的训练后量化，即直接对训练好的模型参数进行量化会带来很大的误差，目前主要会采用量化感知训练（Quantized-Aware Training, QAT）的方式，在训练时全精度优化，仅模拟低精度的推理过程，很好的降低了量化过程的性能损失。

- 剪枝：剪枝方法基于lottery ticket假设，即模型中只有小部分参数起了核心作用，其他的大部分参数是无效参数，可以去除掉。剪枝可以分为非结构化剪枝与结构化剪枝。非结构化剪枝即定位参数矩阵中接近于0或者有接近0趋势的参数，并将这些参数归零，使参数矩阵稀疏化。结构化剪枝即消减模型中结构化的部分，如多头注意力中不需要的注意力头，多层Transformer中不需要的若干层等等。

非结构化剪枝

- 知识蒸馏：知识蒸馏通常在一个大的老师模型与一个小的学生模型之间进行。通过老师模型在监督数据上输出的“软标签分布”来训练学生模型。这种“软标签”的学习能够很好的克服监督数据中标签偏差的问题，带来了很好的知识迁移的能力。

![[Pasted image 20240425134604.png]]


# 以下是笔者整理的几篇经典的预训练语言模型中的轻量化工作，供读者参考。


- Q8BERT: Quantized 8Bit BERT

Q8BERT是量化方法在Bert上的朴素运用。除了采用了基本的量化感知训练方式外，Q8BERT还采用了指数滑动平均的方式平滑QAT的训练过程。最终，在压缩了近4倍参数量，取得4倍推理加速的前提下，Q8BERT在GLUE与SQUAD数据集上取得了接近Bert的效果，证明了量化方法在Bert上的有效性。

Q8BERT在下游任务上的表现

- DistilBERT, a distilled version of BERT: smaller, faster, cheaper and lighter

DistillBERT是huggingface发布的一个小版本的Bert模型，它只在输出层面采用了软标签的蒸馏，将Bert的层数压缩到了原本的1/2，并在各个下游任务上取得了不错的结果。

在GLUE上，DisitlBERT只用了60%的参数，保留了97%的性能

- TinyBERT: Distilling BERT for Natural Language Understanding

与DistilBERT相同，TinyBERT同样是知识蒸馏在Bert压缩上的应用。不同于DistillBERT只在预训练阶段采用知识蒸馏，TinyBERT同时在预训练和微调阶段采用了两阶段的知识蒸馏，使得小模型能够学到通用与任务相关的语义知识。

TinyBERT蒸馏策略

同时，TinyBERT采用了更加细粒度的知识蒸馏方式，对embedding层的输出，Transformer每一层中隐藏层与注意力计算的输出以及整个模型的软标签进行了知识蒸馏，得到了更加精准的知识迁移效果。

更加细粒度的蒸馏方式

最终，TinyBERT将BERT模型蒸馏成了一个4层且隐藏层维度更小的模型，并取得了不亚于更高参数量的DistilBERT的效果。

- ALBERT: A LITE BERT FOR SELF-SUPERVISED LEARNING OF LANGUAGE REPRESENTATIONS

ALBERT是Google在ICLR2020上的一篇工作。它首先采用了词表矩阵分解的方法，由于Bert采用了一个很大的词表，因此词表的embedding层包含了很大的参数量，ALBERT采用了参数分解（Factorized embedding parameterization）的方式减少这部分的参数量。具体而言，对于一个包含_**V**_ 个单词的词表，假如词表的隐藏层大小_**E**_ 与模型的隐藏层大小_**H**_ 相等，则embedding层包含的参数量为_**V**_ × _**E**_ 。考虑到_**V**_ 通常较大，embedding的总参数量也会较大。为了减少参数量， 与直接对one-hot的词向量映射到 H 维空间不同，ALBERT首先将词向量映射到较小的_**E**_ 维空间，再映射到**H** 维空间。将参数量从_O_(**_V_** × **_H_**)降低到了_O_(_**V**_ × _**E**_ + _**E**_ × _**H**_) ，实现了embedding层的压缩。

除此之外，ALBERT还进行了Transformer内跨层的参数压缩，通过跨Tranformer层的完全参数共享，ALBERT对参数量进行了充分的压缩，在低参数量的条件下取得了与Bert-base相似的效果，同时在相近的参数量下可以保证模型更深，隐藏层维度更大，在下游任务下的表现更好。


# 计算机视觉中的轻量化Transformer


尽管Transformer在计算机视觉领域的应用相较于NLP领域稍慢一步，但Vision Transformer的横空出世使得Transformer也占据了视觉模型的主流。后期基于MAE与BEiT的预训练方法更加巩固了Transformer在计算机视觉领域的地位。与自然语言理解领域相同，计算机视觉中的Transformer同样面临着参数量过多，部署困难的问题，因此也需要轻量化的Transformer来高效的完成下游任务。以下是笔者整理的几篇近年来计算机视觉领域中的轻量化工作，供读者参考。

- Training data-efficient image transformers & distillation through attention

DeiT是Facebook在2021年的一篇工作，模型的核心方法是通过知识蒸馏对视觉Transformer进行压缩。DeiT采用了两种蒸馏方法实现了老师模型到学生模型的知识迁移：

1. Soft Distillation：通过老师模型输出的软标签进行知识蒸馏。
    
2. Hard-label Distillation：通过老师模型预测出的实际标签进行知识蒸馏，意义在于纠正可能存在的有监督数据的标签偏差。
    

DeiT在蒸馏过程中引入了Distillation token的概念，其作用与Class token类似，但Class token用于在原数据上利用交叉熵进行训练，Distillation token用于模拟老师模型的软分布输出或利用老师模型预测的hard-label进行训练。

- TinyViT: Fast Pretraining Distillation for Small Vision Transformers


TinyViT是微软在2022年的一篇工作，这篇工作的核心依然是知识蒸馏，但是在工程实现上进行了一些优化，使得小模型能够在更大的数据规模下通过知识蒸馏获取到大模型的知识。DeiT采用的知识蒸馏方法是相当昂贵的，因为在蒸馏过程中，教师模型与老师模型会同时占用GPU的内存，限制了batch_size的增加与学生模型的训练速度。且软标签在老师模型输出端到学生模型输出端的迁移也会带来一定的计算资源损耗。

为了解决这个问题，TinyViT提出了一种软标签预生成的方法，即解耦软标签的生成与学生模型的训练过程。先进行软标签的生成与预存储，再利用预存储的软标签对学生模型进行训练。由于预存储软标签向量会带来极大的存储损耗，考虑到这些向量大部分是稀疏的（因为对于一个训练好的老师模型，给定一张图片，只有极小部分类别会存在成为正确标签的概率），作者采用了存储稀疏标签的策略，即只存储top-k概率的标签以及其对应的概率。在训练学生模型时将这样的稀疏标签还原成完整的概率分布，并进行知识蒸馏。整个pipeline如下图所示：

- MiniViT: Compressing Vision Transformers with Weight Multiplexing
https://openaccess.thecvf.com/content/CVPR2022/papers/Zhang_MiniViT_Compressing_Vision_Transformers_With_Weight_Multiplexing_CVPR_2022_paper.pdf
值得看

MiniViT是微软在CVPR2022的一篇工作，采用了权重复用的方法来压缩模型的参数。与ALBERT不同的是，作者发现单纯的权重复用会导致每层梯度l2范数的同质化以及最后几层输出特征相关性的降低。为了解决这个问题，MiniViT采用了Weight Transformation与Weight Distillation的方法来解决这个问题。Weight Transformation，即在每一层之间插入小型的类似Adapter的结构，以保证每层的输出不会因为参数量相同而同质化。Weight Distillation，即采用一个老师模型来引导MiniViT的输出以增强模型性能。

作为一个通用的压缩方法，作者在DeiT与Swin-Transformer上进行了测试。在更小的参数量下，在ImageNet数据集上，Mini版本的模型均取得了不亚于甚至更好的效果。


DynamicViT: Efficient Vision Transformers with Dynamic Token Sparsification

本文是清华大学在Nips2021上的一篇工作，其借鉴了模型压缩中剪枝的思想，但是是对Transformer每一层的输入token进行了稀疏化。Token稀疏化的基本假设在于：对于一张图片，一定会存在一些冗余部分对模型的预测结果影响很小，对这些部分的削减可以很大程度的增加模型的推理速度。  

DynamicViT的具体做法是：通过在每一层间增加一个轻量化的预测模块，预测哪一些部分的token是可以被丢弃掉的。在预测完后通过一个二进制的决策掩码来完成对token的丢弃。同时，作者修改了训练的目标函数，保证了每一层丢弃的token数量是有限的。

最终，在上述的稀疏化策略下，DynamicViT在原始的ViT基础上取得了很好的加速，并在模型性能与推理速度之间达到了一个很好的平衡。


# 多模态中的轻量化Transformer

- MiniVLM: A Smaller and Faster Vision-Language Model

MiniVLM是微软在Oscar模型上的轻量化工作。MiniVLM的轻量化基于一个观察假设：即在大多数多模态任务中，多模态模型的视觉端不需要特别强的目标检测信息，而目标检测器往往是模型的瓶颈部分。因此，用一个不那么精确的目标检测器可以有效的压缩模型的参数量与加快推理速度，同时尽可能的减少性能损失。

为了达到上述效果，MiniVLM采用了一个基于EfficientNet与Bi-FPN的轻量化目标检测器。同时，为了进行进一步压缩，MiniVLM对多模态Tranformer端也进行了压缩，将原本的Bert结构更换到了更加轻量化的MiniLM，


- Compressing Visual-linguistic Model via Knowledge Distillation

DistilVLM是MiniVLM工作的延续。不同的是，在更换目标检测器与Transformer架构的同时，DistilVLM同时采用了知识蒸馏来保持模型的性能。DistilVLM的蒸馏策略与TinyBERT相同，同样是进行预训练阶段和微调阶段的两阶段蒸馏

下面这段没看懂

由于采用了不同的目标检测器，在检测得到的目标区域不同的前提下，后续的知识蒸馏均是无效的。为了解决这个问题，DistilVLM采用了视觉token对齐的方式，老师模型和学生模型均采用相同的目标检测器，使得两个模型的检测区域对齐，保证了后续知识蒸馏的有效性。

# appendix
https://blog.csdn.net/qq_27590277/article/details/127525009
https://zhuanlan.zhihu.com/p/685943779
https://www.zhihu.com/question/428626879/answer/3385201279


[Are Transformers Effective for Time Series Forecasting? (AAAI 2023)](https://arxiv.org/pdf/2205.13504.pdf)
https://zhuanlan.zhihu.com/p/675683636





