## 别名

稀疏注意力计算

Mistral 使用了GQA和SWA两种方法来加速计算Attention，GQA在[Llama 2详解](https://zhuanlan.zhihu.com/p/649756898)的文章中说明过，这里主要讲解一下SWA。我们知道在Attention的计算一般是**Q** 与shape为`[bst, multi-head,seq_len, head_dim]` 的**KV**进行注意力计算，其中`seq_len`为已处理所有tokens总数，GQA在多头上做文章使得多组Q共享一组KV；而SWA则是在`seq_len`这个维度做文章，不在将Q与所有seq-len的**KV** "**直接**"计算注意力，而是只与**Sliding Window Size**的**KV**"**直接**"计算注意力，如下示意图，为Sliding Window Size为3的情况
![[Pasted image 20240409182200.png]]
而在generation阶段，因为是自回归生成所以mask起不到作用，那此时mistral则使用了RotatingBufferCache来实现此操作，具体而言，就是采用一种循环右移的存储方式，剔除离得远的K，保存靠近的K 。

![](https://pic1.zhimg.com/80/v2-3e386df3b971a60710ac235eeeca7410_1440w.webp)

如上图展示了一个Window Size为4的Cache，循环右移的写Cache的示意图。

我相信多数读者读到这里会跟我有一样的疑问，只让Q与前面Window Size的KV计算Attention，不会影响最终的预测精度吗？因为我们知道当前生成的token是由前面所有token共同决定的。而且论文中并没有特别详细说明，且给出的示意图(下图) 也有些让人费解。

这里结合Crane佬的解答和mistral官方repo的 [issuse](https://link.zhihu.com/?target=https%3A//github.com/mistralai/mistral-src/issues/40) ，我大概弄明白了：

SWA确实限制了每个token的Q只能关注固定大小(Window Size)内的其他token，然而，信息通过网络的传播并不仅仅局限于Window Size的大小，它还设计多层Transformer之间的信息传递。

举个例子，假设我有一组tokens [𝐴,𝐵,𝐶,𝐷,𝐸,𝐹,𝐺,𝐻]，并且我假设此时Sliding Window Size为3，当前处理的token为𝐻

那么对于𝐿𝑎𝑦𝑒𝑟𝑛而言，此时KV cache中存的分别是{𝐾𝐻,𝐾𝐺,𝐾𝐹}和{𝑉𝐻,𝑉𝐺,𝑉𝐹} ，所以此时的𝑄𝐻能**直接**获得最远的token信息是𝐾𝐹,𝑉𝐹 ,而𝐾𝐹,𝑉𝐹又是由前层𝐿𝑎𝑦𝑒𝑟𝑛−1输出𝑌𝑛−1计算而来，而𝑌𝑛−1中又汇总了tokens-𝐹,𝐸,𝐷的信息，同理类推𝐾𝐷𝑛−1,𝑉𝐷𝑛−1又是由前前层𝐿𝑎𝑦𝑒𝑟𝑛−1的输出𝑌𝑛−2计算而来，所以他们又带了tokens-𝐷,𝐶,𝐵的信息

$$
𝐾_{𝐹𝑛}=𝑊𝑘𝑛𝑌𝑛−1,𝑉_{𝐹𝑛}=𝑊𝑣𝑛𝑌𝑛−1
$$
$$
𝑌𝑛−1=𝐴𝑡𝑡𝑒𝑛𝑡𝑖𝑜𝑛\{𝑄𝐹𝑛−1,\{𝐾𝐹𝑛−1,𝐾𝐸𝑛−1,𝐾𝐷𝑛−1\},\{𝑉𝐹𝑛−1,𝑉𝐸𝑛−1,𝑉𝐷𝑛−1\}\}
$$

综上所述，对于𝐿𝑎𝑦𝑒𝑟𝑛而言虽然𝑄𝐻只能直接与tokens - {𝐻,𝐺,𝐹}直接进行注意力机制计算，但是却可以**间接与更早**的tokens - {𝐸,𝐹,𝐶,𝐷..}参与注意力机制运算，以此类推，**只要层数𝑛足够大，配合这种传递方式就可以覆盖整个序列**。论文中还举例说明，对于一个序列长度是16k，Window Size为4K的SWA，只需要四层，最后一个token就能看到之前的全部token信息。
