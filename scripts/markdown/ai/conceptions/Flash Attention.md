没看呢

FlashAttention主要解决[[Transformer]]计算速度慢和存储占用高的问题。但与绝大多数Efficient Transformer把改进方法集中在**降低模型的FLOPS**（floating point operations per second）不同，FlashAttention将优化重点放在了**降低存储访问开销**（Memory Access Cost，MAC）上。

### 1.1 Transformer的复杂度

在标准的Transformer计算中，给定大小为(N, d)的三个矩阵K、Q和V

两个相乘的矩阵大小分别为 (N×d) 和 (d×N)

因为我们需要拿第一个矩阵的每一行去与第二个矩阵的每一列做点乘，所以总共就需要 N2 次点乘。而每次点乘又需要 d 次乘法，所以复杂度就为 O(dN^2)

因为QK和QKV两次矩阵相乘是串行的，所以总复杂度 O(dN^2)

### 1.2 FLOPs & MAC

**大 O 表示法关注的是计算量级与输入规模之间的关系**，并不是具体的计算量。具体计算量通常用FLOPS体现。

**FLOPS直接定义了模型核心计算的密集程度**，所以模型的的计算量FLOPS与模型的计算速度有很大关系。

学界有很多利用各种技巧来降低Transformer FLOPS的方法，通常将由这些方法改进得到的模型称为Efficient Transformer。但大多数Efficient Transformer通常**只关注FLOPS**。

而实际上，FlashAttention的作者们发现，**这些Efficient Transformer虽然能够有效降低模型的FLOPS，但它们的计算速度并没有显著降低**。

导致该现象的根本原因是模型的计算速度除了与FLOPS有很大关系，同时也与MAC（Memory Access Cost，存储访问开销）有关。尤其是当计算本身已经很高效的情况下，MAC的开销更加不能忽略。**MAC的开销主要来自两方面。一是从存储中读取数据；二是向存储中写数据。** 与CPU的情况类似，在GPU中，当需要计算时，需将数据从显存中读取并由计算单元进行计算操作。在计算完毕后，再写回到显存中。

为了弄清MAC对计算速度的影响，可以根据计算的密集程度，将[operator](https://www.zhihu.com/search?q=operator&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A3132304304%7D)分为两类：

**Compute-bound**：计算密集型。整个计算的耗时主要在于计算本身，对显存的读写几乎可以忽略。典型的计算包括[大矩阵乘法](https://www.zhihu.com/search?q=%E5%A4%A7%E7%9F%A9%E9%98%B5%E4%B9%98%E6%B3%95&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A3132304304%7D)、大channel size的卷积操作等。对于这类operator，它们的FLOPS决定了计算的时耗。

**Memory-bound**：存储访问密集型。整个计算的耗时主要集中在存储的访问上，计算本身耗时较低。典型的计算包括逐元素操作（ReLU，Dropout等）、以及Reduce操作（求和、softmax、BatchNorm等）。对于这类operator，它们的MAC决定了计算的时耗。

**在绝大多数的神经网络中，因为含有大量的Memory-bound操作，所以MAC的开销都不能忽略**。但绝大多数Efficient Transformer都忽略了MAC，所以虽然它们整体的FLOPS降低了，但计算时耗并没有降低。

### 1.3 FlashAttention的核心思路

FlashAttention的目标是降低MAC，即使代价是增加了FLOPS。

标准Transformer的计算主要使用了GPU显存，一共包含八次HBM的矩阵读写操作。这八次读写操作分别为：

- 第一行对 Q和K读取以相乘，共两次，对矩阵乘法结果写一次，总共三次；
- 第二行对 Softmax前后一读一写，总共两次；
- 第一行对 Softmax和V读取以相乘，共两次，对结果 的写一次，总共三次。

为了减少对显存的读写，FlashAttention将参与计算的矩阵进行**分块**送进GPU静态缓存，来提高整体读写速度（减少了HBM读写）。但对于Self-Attention的计算来说，FlashAttention的**分块计算**方法并不直观、不自然。

对于矩阵乘法而言，可以直接通过分块来达到分块计算的目的。但Self-Attention中有 softmax计算，而 softmax的分母包含与所有元素相关的求和项，所以对Self-Attention进行分块计算的真正难点在于对 softmax的分块计算。

因为 softmax 的计算公式中含有指数项，当指数项 ie^{x_i} 中的 x_i 较大时，e^{x_i}的值也容易很大，从而在计算中出现溢出。

为了避免溢出的问题，大多数深度学习框架中都使用了 softmax 的稳定版本。仍以向量 x为例，稳定版的 softmax 的计算是在标准 softmax 每一项的基础上，在指数项中减去了一个最大值e^ {x_i - max(x)}

直觉上， softmax 难以分块计算的主要原因是它的分母“EXP求和项”依赖于输入向量 x 中的每一个值。

FlashAttention其实是一个增量计算的过程。我们首先计算一个分块的局部softmax值，然后存储起来。当处理完下一个分块时，可以根据此时的新的**全局最大值**和**全局EXP求和项**来更新旧的softmax值。接着再处理下一个分块，然后再更新。当处理完所有分块后，此时的所有分块的softmax值都是“全局的”。

  
实验对比，softmax比megatron-lm和huggingface都要快

![](https://pic1.zhimg.com/80/v2-0ff309f792d29576b98c3405e169c4d4_1440w.webp)