前文说过 Mixtral-8x7B就是Mistral 7B的MoE模型，除了上述Mistral 7B中的特性以外，[[Mixtral-8x7B]]还引入了MoE结构。MoE(Mixture-of-Experts) 其实也不是一个新技术，早在1991年就已经被Michael Jordan 和 Geoffrey Hinton所提出 [Adaptive mixtures of local experts](https://link.zhihu.com/?target=https%3A//readpaper.com/paper/2150884987) , 而且关于MoE的发展在深度学习界也从未停止过 (所谓经典永不过时说的便是如此)，相关的papers综述这里提供一个写的不错的Blog供大家参考一下：[MoE 经典论文一览](https://zhuanlan.zhihu.com/p/542465517)

这里简单的解释一下什么是MoE，简单点说就是我让一个网络模型结构有多条分支，每条分支代表一个Expert(专家)，每个Expert都有其擅长的领域，当具体任务来临时，可以通过一个门空位Gate来具体选择采用哪一个或者哪几个Experts进行计算，这样的好处就是让每个Expert更专注特定领域，降低了不同领域数据对权重学习的干扰。当然在训练MoE模型时也要注意各个Experts负载均衡，防止赢者通吃，达不到想要的目的。

可以发现，相对于Llama ，Mixtral 8x7B模型将FFN替换为MoE FFN，还是直接看代码
![[Pasted image 20240409182023.png]]

## Llama ，Mixtral 8x7B差异
具体而言，就是存在以下几点差异：

- 对于Attention部分使用[GQA (Group Query Attention)](https://link.zhihu.com/?target=https%3A//arxiv.org/pdf/2305.13245.pdf)来计算注意力机制，其中Q的头数为32，而KV 的头数为8，换句话说就是每4组Q共享一组KV。 这一点与Llama 2 不同，Llama 2 是在34B和70B中才使用了GQA，在7B中依然使用的是MHA(Multi-Head-Attention)  
- 使用[[SWA(Sliding Window Attention)]] 。GQA和SWA叠加来降低显存占用提高推理速度。  
- 增大FeedForward HiddenDim的值，由Llama-2 7B的11008 ，改为14336  
    

GQA和更改FFN HiddenDim的值 这两个改动都比较容易理解，那么接下来就主要来看看SWA(Sliding Window Attention)的原理和实现细节

https://www.zhihu.com/question/634844209/answer/3364787819

MoE基于Transformer架构，主要由两部分组成：

- **稀疏 MoE 层：** 这些层代替了传统 Transformer 模型中的前馈网络 (FFN) 层。MoE 层包含若干“专家”(例如 8 个)，每个专家本身是一个独立的神经网络。在实际应用中，这些专家通常是前馈网络 (FFN)，但它们也可以是更复杂的网络结构。

- **门控网络或路由**: 这个部分用于决定哪些 token 被发送到哪个专家。例如，在下图中，“More”这个 token 可能被发送到第二个专家，而“Parameters”这个 token 被发送到第一个专家。有时，一个 token 甚至可以被发送到多个专家。token 的路由方式是 MoE 使用中的一个关键点，因为路由器由学习的参数组成，并且与网络的其他部分一同进行预训练。

总结来说，在[混合专家模型 (MoE)](https://www.zhihu.com/search?q=%E6%B7%B7%E5%90%88%E4%B8%93%E5%AE%B6%E6%A8%A1%E5%9E%8B%20%28MoE%29%20&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A3364787819%7D) 中，我们将传统 Transformer 模型中的每个前馈网络 (FFN) 层替换为 MoE 层，其中 MoE 层由两个核心部分组成: **一个路由器（或者叫门控网络）和若干数量的专家**。

总结MoE大模型优点，主要有以下3点：

1. **训练速度更快，效果更好。**
2. **相同参数，推理成本低。**
3. **扩展性好**，允许模型在保持计算成本不变的情况下增加参数数量，这使得它能够扩展到非常大的模型规模，如[万亿参数模型](https://www.zhihu.com/search?q=%E4%B8%87%E4%BA%BF%E5%8F%82%E6%95%B0%E6%A8%A1%E5%9E%8B&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A3364787819%7D)。
4. **多任务学习能力**：MoE在多任务学习中具备很好的新能（比如Switch Transformer在所有101种语言上都显示出了性能提升，证明了其在多任务学习中的有效性）。

而MoE大模型的缺点，主要有以下4点：

1. **训练稳定性**：MoE在训练过程中可能会遇到稳定性问题。
2. **通信成本**：在分布式训练环境中，MoE的专家路由机制可能会增加通信成本，尤其是在模型规模较大时。
3. **模型复杂性**：MoE的设计相对复杂，可能需要更多的工程努力来实现和优化。
4. **下游任务性能**：MoE由于其稀疏性，使得在[Fine-tuning](https://www.zhihu.com/search?q=Fine-tuning&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A3364787819%7D)过程中容易出现过拟合。

## Adaptive mixtures of local experts
  
论文介绍了一种新的监督学习过程，用于由多个独立网络组成的系统，每个网络处理训练集合的子集。这种新方法可以看作是**多层监督网络的模块化版本**，或者是竞争性学习的关联版本，因此提供了这两种看似不同的方法之间的新联系。

如果一个多层网络用来训练不同的子任务，通常会有强烈的**干扰效应**，这会导致学习过程变慢和泛化能力差。这种干扰效应的原因在于，当网络试图同时学习多个子任务时，不同任务的学习过程可能会相互干扰。

例如，学习一个子任务时对权重的调整可能会影响其他子任务的学习效果，因为这些权重变化会改变其他子任务的loss。这种相互影响使得网络在处理每个子任务时都试图最小化所有其他子任务的loss。

为了解决这个问题，论文提出了使用多个模型（即专家，expert）去学习，使用一个门控网络（gating network）来决定每个数据应该被哪个模型去训练，这样就可以减轻不同类型样本之间的干扰。
![[Pasted image 20240412115911.png]]
在论文中，作者提到这个损失函数可能会导致专家网络之间的**强烈耦合**，因为一个专家网络的权重变化会影响到其他专家网络的loss。这种耦合可能会导致多个专家网络被用于处理每条样本，而不是专注于它们各自擅长的子任务。为了解决这个问题，论文提出了重新定义损失函数的方法，以**鼓励专家网络之间的相互竞争**。
![[Pasted image 20240412115920.png]]

就是先让不同的expert单独计算loss，然后再加权求和得到总体的loss。这意味着，每个expert在处理特定样本的目标是独立于其他expert的权重。尽管仍然存在一定的间接耦合（因为其他expert权重的变化可能会影响门控网络分配给expert的score）。

如果门控网络和expert都使用这个新的loss进行梯度下降训练，**系统倾向于将每个样本分配给一个单一expert**。当一个expert在给定样本上的的loss小于所有expert的平均loss时，它对该样本的门控score会增加；当它的表现不如平均loss时，它的门控score会减少。这种机制鼓励expert之间的竞争，而不是合作，从而提高了学习效率和泛化能力。




# appendix
https://zhuanlan.zhihu.com/p/684922663



