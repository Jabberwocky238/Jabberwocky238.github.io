# 原论文解读

Indeed, qualitative results show that the last attention layer naturally focuses on semantically consistent parts of images and often produces interpretable attention maps

事实上，定性结果表明，最后一个注意力层自然地关注图像的语义一致部分，并经常产生可解释的注意力图。

DINO算法所得到的模型已经被证明可以显示地得到图像的语义信息。定性的结果表明，最后一个注意力层会自然地关注到图像中的语义部分的信息，且通常会产生可解释的注意力图。利用这些属性，可以在 DINO 的基础上构建一些 object discovery 算法比如 [LOST](https://zhuanlan.zhihu.com/p/490813640)。这个算法可以无监督地收集注意力图中的信息，有效解锁了计算机视觉的新前沿。

DINO v2算法是 DINO 的后续工作，其得到的特征适合密集预测任务。DINO v2 在单目深度估计任务和语义分割任务中表现出色。尽管密集任务的性能很强，但作者观察到 Dinov2 与 LOST 不兼容。在这种情况下，其性能仅仅与有监督的视觉 Transformer 的性能是相当的。这一现象说明 DINO v2 和 DINO 表现截然不同，DINO v2 特征中的一些 "伪影" 在 DINO 中是不存在的。同样令人惊讶的是，对有监督训练得到的视觉 Transformer 使用相同的观察也暴露了类似的伪影，如下图2所示。这说明 DINO 是个例外，除了异常情况 DINO 外，很多视觉 Transformer 模型的特征中都会有 "伪影"。

> DINO牛逼， DINOv2有artefact虚影，LOST也牛逼，但是DINOv2和LOST不兼容

![[Pasted image 20240510213441.png]]

本文提出一种有效的方案来解决 "伪影" 的问题，如图1所示。本方法称之为寄存器 (Register)，就是为视觉 Transformer 添加几个额外的 tokens。和正常的 tokens 的不足之处是，这些寄存器的输出特征不参与到分类过程中。寄存器的功能得到了实验验证，可以：1) 使得自监督训练得到的视觉 Transformer 在密集预测任务中取得 SOTA。2) 使大一点的模型具有 object discovery 的能力。3) 使得特征图和注意力图更加平滑，有利于下游的视觉处理。

## 视觉 Transformer 中 "伪影" 的特点

#### 1) "伪影" 是范数值很高的异常 token。
#### 2) "伪影" (异常值) 出现在大模型的训练中
#### 3) 在当前 Patch 信息冗余时，范数值很高的异常 token 出现。

为了验证这一点，作者计算了在 Patch Embedding 层之后的高范数 token 和 4 个相邻 tokens 的余弦相似度，并绘制曲线如下图6所示。可以看到，"伪影" (异常值) 出现时与周围相邻 tokens 的余弦相似度高的 tokens 所占得比例很大，说明这些 tokens 包含冗余信息，并且模型可以在不损害图像表示质量的情况下丢弃它们的信息。这个结论也和图2的定性观察匹配，即 "伪影" 一般出现在图片的背景区域中。

#### 4) 高范数值异常 token 几乎不包含局部信息。

- **位置预测**

做法：训练一个 Linear Model 来从 Patch Embedding 中预测图像中每个 Patch 的位置，并测量其准确性。位置信息以绝对位置嵌入的形式在第一个 ViT 层之前的 token 中注入。作者观察到高范数 token 的准确度远低于其他 tokens，这表明它们包含有关它们在图像中的位置的信息较少。

- **像素重建**

做法：训练一个 Linear Model 来从 Patch Embedding 中预测图像的像素值 (Pixel Value)，并测量该模型的准确性。作者再次观察到，高范数 tokens 比其他 tokens 实现了更低的准确度。这表明高范数 tokens 包含的信息比其他标记少。

![](https://pic1.zhimg.com/80/v2-ff6ff96ca470b99f96fb127715699d94_1440w.webp)

#### 5) "伪影" (异常值) 保留了全局信息

## 针对 "伪影" 的假设和补救措施

假设是：**经过充分训练的大模型学习去识别冗余的 tokens，并将它们用来存储，处理和检索全局位置的信息。** 

作者假定这种行为模式本身并不坏，但是对于模型的输出如果包含这种 tokens 就不太可取。事实上，这种异常的 tokens 会引导模型丢弃局部的信息，导致密集预测任务性能的降低。

因此，作者提出了一个简单的方法来解决这个问题：对 ViT 模型显式地添加一些新的 tokens，它们可以用来作为寄存器 (Registers)。它们类似于 [CLS] token，具有可学习的值。在 ViT 的输出层，这些 tokens 被丢弃了。[CLS] token 和其他正常的 image tokens 不丢弃，这点和 ViT 是一致的。这一点最早在 NLP 任务中被提出。有趣的是，作者在这里表明这种机制也适合视觉 Transformer，且在可解释性和性能方面给出了其他一些见解。

![](https://pic3.zhimg.com/80/v2-56ee137532087f8c7fb1b88671a19cf2_1440w.webp)

> 我怎么感觉除了DINOv2以外就没啥用呢

作者最后定性地探讨了 [reg] tokens 的行为，想验证它们是否都表现出相似的注意力模式，或者不同的 [reg] tokens 的模式有哪些不同，[CLS] token 和 [reg] tokens 的注意力图的可视化结果比较如下图14所示。可以看到，[reg] tokens 之间没有完全对齐的行为模式，一些选定的寄存器表现出有趣的注意力模式，关注场景中的不同对象，这种自然的多样性很有趣。

![](https://pic2.zhimg.com/80/v2-91d932a31f73fa976ac4aa45e72b2f51_1440w.webp)


## related works

### Feature extraction with pretrained models. 
> 预训练模型的特征提取

Using pretrained neural network models for extracting visual features has stood the test of time since the AlexNet (Krizhevsky et al., 2012) CNN model pretrained on ImageNet-1k (Russakovsky et al., 2015). More recent models have upgraded the same setup with modern architectures, such as ResNets (used in, e.g., DETR, Carion et al., 2020) or even Vision Transformers. As Transformers are easily able to handle different modalities during training, off-the-shelf backbones are now commonly trained on label supervision (e.g., DeiT-III on ImageNet- 22k, Touvron et al., 2022) or text supervision (e.g., CLIP (Radford et al., 2021)), providing strong visual foundation models, scaling well with model sizes, and enabling excellent performance on a variety of tasks including detection (Carion et al., 2020) and segmentation (Zheng et al., 2021; Kirillov et al., 2023). In this context, supervision relies on annotations in the form of labels or text alignment; the dataset biases (Torralba & Efros, 2011) are not well characterized, yet they drive 8 Published as a conference paper at ICLR 2024 learning and shape the learned models. An alternative approach consists of not using supervision and letting the models learn from the data via a pretext task that is designed to require understanding the content of images (Doersch et al., 2015). This self-supervised learning paradigm was explored in multiple methods using Vision Transformers: MAE (He et al., 2022) trains a model at reconstructing pixel values of hidden areas of an image and then applies fine-tuning to address a new task. With a different approach, the self-distillation family of methods (He et al., 2020; Caron et al., 2021; Zhou et al., 2022) showcase strong performance using frozen backbones, allowing for more robustness to domain shifts for task-specific downstream models. In this work, we focused the analysis on self- supervised learning, and more specifically on the DINOv2 approach (Oquab et al., 2023), which has shown to be particularly effective for learning local features. We showed that despite excellent benchmark scores, DINOv2 features exhibit undesirable artifacts and that correcting these artifacts in the learning process allows for further improvements in the benchmark performances. These phenomenon is even more surprising as DINOv2 builds upon DINO (Caron et al., 2021), which does not show signs of artifacts. We then further showed that the correction techniques hold for supervised paradigms by testing on DeiT-III and OpenCLIP

### Additional tokens in transformers
> transformers的附加tokens

Extending the transformer sequence with special tokens was popularized in [[BERT]] (Devlin et al., 2019). However, most approaches add new tokens either to provide the network with new information as for example SEP tokens in BERT, provide opportunity to spend more computation on the input as seen with the tape tokens in [[AdaTape]], or to gather information in these tokens, and use their output value as an output of the model: 
(Xue et al., 2023)
- for classification, as CLS tokens in [[BERT]] and [[ViT]] ; 
- for generative learning, as MASK in [[BERT]] and BEiT (Bao et al., 2021); 
- for detection, as object queries in [[DETR]] (Carion et al., 2020), detection tokens in YOLOS (Fang et al., 2021), and [[ViDT]] (Song et al., 2021); 
- for accumulating information from possibly multiple modalities before decoding, as latent token arrays in Perceivers (Jaegle et al., 2021; 2022). 

Different to these works, the tokens we add to the sequence add no information, and their output value is not used for any purpose. 

They are simply registers where the model can learn to store and retrieve information during the forward pass. The [[Memory Transformer]] (Burtsev et al., 2020), closer to our work, presents a simple approach to improve transformer models using memory tokens added to the token sequence, improving translation performance. 

In follow-up work, Bulatov et al. (2022) address complex copy-repeat-reverse tasks. Sandler et al. (2022) extend this line to the vision domain for fine-tuning but observe that such tokens do not transfer well across tasks. 
> 不同任务间效果不好

In contrast, we do not perform fine-tuning and employ additional tokens during pretraining to improve the features obtained for all tasks downstream. 

More importantly, our study contributes the following new insight in Sec. 2: the mechanism implemented through memory tokens already appears naturally in Vision Transformers; our study shows that such tokens allow us not to create but to isolate this existing behavior, and thus avoid collateral side-effects
### Attention maps of vision transformers. 


# appendix
https://zhuanlan.zhihu.com/p/670410297
[[Emerging properties in self-supervised vision transformers]]
Localizing objects with self-supervised transformers and no labels
DINOv2: Learning Robust Visual Features without Supervision
Memory Transformer
Deit iii: Revenge of the vit

# paper
[[2309.16588v2.pdf]]