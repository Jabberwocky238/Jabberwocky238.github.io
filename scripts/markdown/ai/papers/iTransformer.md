# Inverted Transformers Are Effective for Time Series Forecasting

https://www.bilibili.com/list/watchlater?bvid=BV1bb421Y7ZF&oid=1803662043
https://zhuanlan.zhihu.com/p/683534152
https://zhuanlan.zhihu.com/p/687481605

```text
中文名称: ITRANSFORMER：倒置Transformers在时间序列预测中的有效性
链接: https://openreview.net/forum?id=X6ZmOsTYVs
代码: https://github.com/thuml/iTransformer
作者: Yong Liu, Tengge Hu, Haoran Zhang, Haixu Wu, Shiyu Wang, Lintao Ma, Mingsheng Long
机构: 清华大学软件学院, 清华大学国家数字化治理工程技术研究中心, 蚂蚁集团日期: 2023-10-10
```
作者提出了一个疑问：为什么在很多情况下，时序问题使用 Transformer 结构反而不如线性模型好？按理说，Transformer 作为预测序列化数据的模型，应该更擅长处理时序问题。作者认为可能是数据组织方式不够优化引起。

文章主要讨论了多变量时序预测的问题，即使用多变量的 X 来预测 Y，例如使用过去的天气数据和地域数据等来预测未来的天气。

之前我们处理时序数据也存在相同的问题：每种数据的频率和范围都不一样，如果在某个时间点上对所有数据进行采样也不太合适。

因此，作者提出了针对时间序列的另一种输入方式。以前是将每个时间点的所有变量作为一个 token 传递给模型；而现在，将每个变量的整个时间序列独立地嵌入到一个 token 中。简单来说：如果想要预测明天的天气，就将之前一段时间的天气打包成一个 token 传入模型。这样既可以学习到数据时序的前后关系，也可以学习到不同特征之间的相互作用。

最近，线性预测模型蓬勃发展，导致修改基于transformer预测器架构的热情降低。这些预测器利用transformer对时间序列的时间token进行全局依赖性建模，每个token由相同时间戳的多个变体组成。

然而，由于性能下降和计算爆炸，transformer在预测具有较大回溯窗口的序列时面临挑战。此外，每个时间token的嵌入融合了代表潜在延迟事件和不同物理测量的多个变量，这可能无法学习以变量为中心的表征，并导致无意义的attention map。具体来说：

●同一时间点的点基本上代表了完全不同的物理意义，而这些点是由不一致的测量记录下来的，它们被嵌入到一个token中，多变量相关性被抹去了；

●由于同一时间点所代表的局部感受野和时间不一致事件过多，单个时间步形成的token难以揭示有益信息；

●即便序列变化会受到序列顺序的很大影响，在时间维度上没有适当地采用排列不变的attention机制；

因此，Transformer 在捕捉基本序列表征和刻画多变量相关性方面的能力较弱，限制了其对不同时间序列数据的处理能力和泛化能力。

![](https://pic4.zhimg.com/80/v2-6858cb2ed524fa8f333b8e3d29e13697_1440w.webp)

### 2.4 前馈网络

Transformer采用前馈网络（FFN）作为token编码的基本构件，并对每个token进行相同的编码。在普通transformer中，构成token的同一时间点的多个变量可能会错位，并且过于局部化，无法为预测提供足够的信息。在转置版本中，FFN利用的是每个变量token的序列表示。根据通用近似定理，它们可以提取复杂的表示来描述时间序列。通过转置模块的堆叠对观察到的时间序列进行编码，并利用密集的非线性连接对未来序列的表示进行解码，这与最近建立在MLP上的工作一样有效。

最近对线性预测的重新研究强调，MLP提取的时间特征可以在不同的时间序列中共享。本文提出了一个合理的解释，即MLP的神经元被训练来描绘任何时间序列的内在属性，如振幅、周期性和偶频频谱（神经元作为滤波器），与应用于时间点的self-attention相比，它是一种更有效的预测表征学习器。
### 2.5 self-attention

以往的预测通常采用attention机制来促进时间依赖性建模，而转置模型则将整个单变量序列视为一个独立的过程。

![[Pasted image 20240427160225.png]]

### 3.4 更好地利用回溯窗口

随着回溯窗口长度的增加，iTransformers 的预测性能有了显著提高

![](https://pic3.zhimg.com/80/v2-b7cd59679f9b5b22938bac6b8e793fb2_1440w.webp)

回溯长度T∈48，96，192，336，720和固定预测长度S=96时的预测性能。虽然基于transformer预测器的性能并不一定受益于回溯长度的增加，但转置框架增强了原始transformer及其变体在扩大回溯

![[Pasted image 20240427154601.png]]







