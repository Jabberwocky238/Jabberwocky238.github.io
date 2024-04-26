## 别名
稀疏注意力计算


Mistral 使用了GQA和SWA两种方法来加速计算Attention，GQA在[Llama 2详解](https://zhuanlan.zhihu.com/p/649756898)的文章中说明过，这里主要讲解一下SWA。我们知道在Attention的计算一般是**Q** 与shape为`[bst, multi-head,seq_len, head_dim]` 的**KV**进行注意力计算，其中`seq_len`为已处理所有tokens总数，GQA在多头上做文章使得多组Q共享一组KV；而SWA则是在`seq_len`这个维度做文章，不在将Q与所有seq-len的**KV** "**直接**"计算注意力，而是只与**Sliding Window Size**的**KV**"**直接**"计算注意力，如下示意图，为Sliding Window Size为3的情况
![[Pasted image 20240409182200.png]]
![[Pasted image 20240409182226.png]]