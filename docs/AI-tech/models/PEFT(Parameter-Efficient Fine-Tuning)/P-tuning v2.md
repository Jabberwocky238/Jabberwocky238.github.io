https://zhuanlan.zhihu.com/p/686279338

在序列标注(sequence labeling)任务上的性能表现相对较差/不稳定。  

NLU任务按照困难程度，可以大致分为两类：简单的分类和困难的序列标注(sequence labeling)。简单分类任务主要是对标签空间进行分类，例如GLUE和SuperGLUE中的大部分数据集；而困难序列标注任务需要对每个输入token进行分类，例如命名实体识别和抽取式问答。在P-TUning v2之前的[[Prompt Tuning]]方法尚未证明其在困难序列标注任务上的有效性。序列标注需要为每个输入token预测一个标签，这可能更具挑战性，并可能不兼容提示调优中的verbalizers。

我们可以认为，p-Tuning v2是结合[[Prefix Tuning]]和[[P-tuning]]，来做NLU序列标注任务。

