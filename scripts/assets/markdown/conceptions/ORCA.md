更适合Transformer宝宝体质的Batching方法
[原文](https://zhuanlan.zhihu.com/p/676109470)
ORCA借鉴BatchMaker方法，将它适配到Transformer Decoder生成过程。虽然Transformer Decoder和RNN在生成过程中都是逐个token地迭代生成，但它们之间存在一些本质区别。

1. 首先，Transformer Decoding阶段每个迭代时，将当前token和之前生成的token序列拼接起来传入模型。尽管每次只生成一个token，计算量近似，但每个迭代的KVCache的长度会逐渐增加。

2. 其次，Decoder在进行解码时需要进行Prefill过程，这是RNN没有的。Prefill计算是一堆token一起算，和Decoding阶段计算模式截然不同。前者是计算密集，后者是访存密集。