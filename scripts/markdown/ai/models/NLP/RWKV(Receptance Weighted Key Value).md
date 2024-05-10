Transformer 模型由于其处理局部和长程依赖关系的能力以及可并行化训练的特点而成为一个强大的替代方案，如 GPT-3、ChatGPT、GPT-4、LLaMA 和 Chinchilla 等都展示了这种架构的能力，推动了自然语言处理领域的前沿。尽管取得了这些重大进展，Transformer 中固有的自注意力机制带来了独特的挑战，主要是由于其二次复杂度造成的。这种复杂性使得该架构在涉及长输入序列或资源受限情况下计算成本高昂且占用内存。这也促使了大量研究的发布，旨在改善 Transformer 的扩展性，但往往以牺牲一些特性为代价。

为了应对这些挑战，一个由 27 所大学、研究机构组成的开源研究团队，联合发表论文《 RWKV: Reinventing RNNs for the Transformer Era 》，文中介绍了一种新型模型：RWKV（Receptance Weighted Key Value），这是一种新颖的架构，有效地结合了 RNN 和 Transformer 的优点，同时规避了两者的缺点。RWKV 设计精良，能够缓解 Transformer 所带来的内存瓶颈和二次方扩展问题，实现更有效的线性扩展，同时保留了使 Transformer 在这个领域占主导的一些性质。

![](https://pic2.zhimg.com/80/v2-2b9a9da6c6ac38385c21375442339241_1440w.webp)
![[Pasted image 20240510230251.png]]

本文利用线性注意力机制，允许将模型定义为 Transformer 或 RNN，从而在训练期间并行化计算，并在推理过程中保持恒定的计算和内存复杂性，使其成为第一个可扩展到数百亿参数的非 Transformer 架构。

RWKV和Mamba等recurrence模型都存在着状态机制，而这个状态的大小是恒定的。这种恒定大小的状态足够记录所有的历史信息以用来进行后续复杂的推理吗？简单的分类任务也许能很好的handle,但是更复杂的任务以及对记忆要求很高的任务呢？

## RWKV和Mamba等recurrence类的模型真的能够击败transformer吗？

![[Pasted image 20240423104118.png]]
![[Pasted image 20240423104255.png]]
![[Pasted image 20240423104315.png]]

# appendix

> 这篇没看完，RWKV感觉很牛，以后有时间研究
https://zhuanlan.zhihu.com/p/631729146

[RWKV和Mamba等recurrence类的模型真的能够击败transformer吗？](https://www.zhihu.com/question/647212700/answer/3427664354)
