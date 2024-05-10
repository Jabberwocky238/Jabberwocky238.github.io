## 为什么其它领域的transformer都不惊艳？

Transformers 在 NLP 中取得成功的主要因素之一是使用自监督的预训练，其形式是 BERT中的MLM或 GPT 中的LM任务。这些自监督的预训练目标使用句子中的token来创建pretext task，**这些任务提供比预测每个句子单个标签的监督目标更丰富的学习信号**。

**然而，在图像中，图像级别的有监督任务例如图像分类，通常将图像中包含的丰富视觉信息减少为从数千个classes的预定义集合中选择的单个概念**。

虽然 NLP 中使用的self supervised pretext task 是特定于文本的，但许多现有的self supervised方法已经在带有卷积网络的图像上显示出它们的潜力。它们通常具有相似的结构，但具有不同的组件，旨在避免琐碎的解决方案（崩溃）或提高性能。在这项工作中，受这些方法的启发，我们研究了self supervised pretrain task 对 ViT 的representation space的影响。**特别有趣的是，我们已经确定了一些有趣的属性，这些属性不会出现在有监督的 ViT 中，也不会出现在卷积网络中**：

>没看完





# appendix
https://zhuanlan.zhihu.com/p/633011157





