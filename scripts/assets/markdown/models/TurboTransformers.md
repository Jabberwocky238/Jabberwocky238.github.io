[论文](https://arxiv.org/abs/2010.05680)
[代码](https://github.com/Tencent/TurboTransformers)


目的是对标FasterTransformers，
里面介绍了我提出了针对encoder-only架构的变长输入问题的两个创新点。第一个是用chunk来管理动态内存，平衡GPU内存footprint大小和临时分配overhead。想法和Paged Attention的思想有些类似，只不过是用page（chunk）管理推理的中间结果activations，而PagedAttention用page来管理KVCache。第二个是，用动态规划寻找最优的padding策略以获得最优吞吐速度，减少无效计算。虽然思路比较巧妙，但其实实用性一般，比较适合只能处理静态shape的推理runtime。