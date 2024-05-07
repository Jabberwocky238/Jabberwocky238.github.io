<p><a href="https://zhuanlan.zhihu.com/p/623543497">https://zhuanlan.zhihu.com/p/623543497</a></p>
<p>那么那些小公司或者个人，又怎么能够利用这些开源的大模型，在自己的数据上继续训练，从而应用于自己的业务场景？有没有低成本的方法微调大模型？答案是有的。目前主流的方法包括2019年 Houlsby N 等人提出的 <a href="/#/document/ai/conceptions/PEFT(Parameter-Efficient Fine-Tuning)/Adapter Tuning.md">Adapter Tuning</a>，2021年微软提出的 LORA，斯坦福提出的 <a href="/#/document/ai/conceptions/PEFT(Parameter-Efficient Fine-Tuning)/Prefix Tuning.md">Prefix Tuning</a>，谷歌提出的 <a href="/#/document/ai/conceptions/PEFT(Parameter-Efficient Fine-Tuning)/Prompt Tuning.md">Prompt Tuning</a>，2022年清华提出的 <a href="/#/document/ai/conceptions/PEFT(Parameter-Efficient Fine-Tuning)/P-tuning v2.md">P-tuning v2</a>。</p>
<p>这些方法都有各自的特点，从个人使用情况来说，LORA 的效果会好于其它几种方法。其它方法都有各自的一些问题：</p>
<ul>
<li>Adapter Tuning 增加了模型层数，引入了额外的推理延迟</li>
<li>Prefix-Tuning 难于训练，且预留给 Prompt 的序列挤占了下游任务的输入序列空间，影响模型性能</li>
<li>P-tuning v2 很容易导致旧知识遗忘，微调之后的模型，在之前的问题上表现明显变差</li>
</ul>
<p>基于上述背景，LORA 得益于前人的一些关于内在维度（intrinsic dimension）的发现：</p>
<blockquote>
<p>模型是过参数化的，它们有更小的内在维度，模型主要依赖于这个低的内在维度（low intrinsic dimension）去做任务适配。</p>
</blockquote>
<p>假设模型在任务适配过程中权重的改变量是低秩（low rank）的，由此提出低秩自适应（LoRA）方法。</p>
<p>LoRA 允许我们通过优化适应过程中密集层变化的秩分解矩阵，来间接训练神经网络中的一些密集层，同时保持预先训练的权重不变。</p>