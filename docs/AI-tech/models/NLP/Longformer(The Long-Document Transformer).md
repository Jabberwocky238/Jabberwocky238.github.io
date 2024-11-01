
但是虽然自注意力机制很有效，但它所需的内存和算力会随着序列长度呈平方增长，这使得当前硬件在处理长序列的情况下不可行，或者说非常昂贵、代价很大。

现有的方法是将上下文缩短或者划分成为较小的序列，以限制这些序列在512的长度以内。但是这种划分可能导致重要的信息丢失。


## 模型

前面提到，现有的注意力计算方法时间和空间复杂度都是O(n²)，这使得难以在长序列上进行训练。

为了解决这个问题，作者根据一个“attention pattern”来稀疏完整的自注意力矩阵

![](https://pic3.zhimg.com/80/v2-36ba4d8dd5ccc42d0524e4d9fcd8f06a_1440w.webp)
b: [[SWA(Sliding Window Attention)]]

图中第一个是全自注意力矩阵，后面三个是作者提到的稀疏后的注意力矩阵

## Tensor Virtual Machine (TVM)

另外，值得一提的是，作者用TVM构建了自己的自定义CUDA kernel。这使得longformer的速度与full self-attention的操作几乎一样快，而且显存占用要小得多。

> 牛逼啊，手写cuda算子，还得是实力够硬才有饭吃

![](https://pic4.zhimg.com/80/v2-1e628bd21a3ec44ab2682b1c7a1b45d3_1440w.webp)

下面这个表展示了作者在不同attention pattern的配置上的实验结果。

![](https://pic3.zhimg.com/80/v2-e98df0491885c5dfb93aa931b0854ece_1440w.webp)

表格的上半部分展示了，递增窗口大小的表现最好，递减窗口大小表现最差，使用固定窗口的表现介于两者之间。

表格的下半部分展示了使不使用空洞窗口的区别，可以看出对两个head增加一些空洞比完全不使用空洞窗口表现要好一些。

# appendix
https://zhuanlan.zhihu.com/p/134748587