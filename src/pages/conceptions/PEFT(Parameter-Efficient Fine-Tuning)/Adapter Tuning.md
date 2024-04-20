https://zhuanlan.zhihu.com/p/574191259

随着计算机硬件性能的提高，预训练模型参数量越来越多，在训练下游任务时进行全模型微调变得昂贵且耗时，Adapter 的出现缓解了这个问题。Adapter在预训练模型每层中插入用于下游任务的参数，在微调时将模型主体冻结，仅训练特定于任务的参数，减少训练时算力开销。

![[Pasted image 20240411220531.png]]

在预训练模型每一层(或某些层)中添加Adapter模块(如上图左侧结构所示)，微调时冻结预训练模型主体，由Adapter模块学习特定下游任务的知识。每个Adapter模块由两个前馈子层组成，第一个前馈子层将Transformer块的输出作为输入，将原始输入维度d投影到m，通过控制m的大小来限制Adapter模块的参数量，通常情况下m<<d。

在输出阶段，通过第二个前馈子层还原输入维度，将m重新投影到d，作为Adapter模块的输出(如上图右侧结构)。通过添加Adapter模块来产生一个易于扩展的下游模型，每当出现新的下游任务，通过添加Adapter模块来避免全模型微调与灾难性遗忘的问题。Adapter方法不需要微调预训练模型的全部参数，通过引入少量针对特定任务的参数，来存储有关该任务的知识，降低对模型微调的算力要求。

**「AdapterFusion」** 2020年，Pfeiffer J等人对Adapter进行改进，**「提出AdapterFusion算法，用以实现多个Adapter模块间的最大化任务迁移」**(其模型结构如下图所示)。(Non-Destructive Task Composition for Transfer Learning)
![[Pasted image 20240411220854.png]]
AdapterFusion将学习过程分为两个阶段：
- 1.**「知识提取阶段」**：训练Adapter模块学习下游任务的特定知识，将知识封装在Adapter模块参数中。
- 2.**「知识组合阶段」**：将预训练模型参数与特定于任务的Adapter参数固定，引入新参数学习组合多个Adapter中的知识，提高模型在目标任务中的表现。
- 
**「AdapterDrop」**: RückléA等人对Adapter的计算效率进行分析，发现与全模型微调相比适配器在训练时快60%，但是在推理时慢4%-6%，并提出了AdapterDrop方法缓解该问题。**「AdapterDrop在不影响任务性能的情况下，对Adapter动态高效的移除，尽可能的减少模型的参数量，提高模型在反向传播（训练）和正向传播（推理）时的效率」**。在删除了前五层的Adapter后，在对八个任务进行推理时，效率提高了39%。

**「自适应机器翻译」**：BapnaA等人**「基于Adapter的思想在机器翻译领域提出了一种简单的自适应机器翻译方法」**。首先在大型语料库中训练一个基础通用NMT(NeuralMachineTranslation;神经机器翻译)模型，作为预训练模型。在模型收敛后将模型主体部分进行冻结，保留在预训练阶段学习的通用知识。在每个Transformer层中为每种语言分别添加Adapter模块，在对应语料库中进行训练，调整Adapter参数，让其学习对应语言知识。与全模型微调相比，基于Adapter的机器翻译获得了更好的效果，并且无需对不同自适应数据集和模型容量进行调整。

**「K-Adapter」**：2020年，WangR等人**「将Adapter应用在迁移学习领域，提出K-Adapter方法。解决新知识注入时，历史知识被冲走(灾难性遗忘)的问题」**。主要思想与Adapter类似，固定预训练模型参数，针对每一种新知识添加一个Adapter模块进行训练。将Adapter模块作为预训练模型的插件，每个插件之间没有信息流传输，这样可以有效的训练多个Adapter模块，做到即插即用。避免了新的任务出现，需要对所有任务重新训练的问题。

**【Visual Adapter】** Learning multiple visual domains with residual adapters
https://zhuanlan.zhihu.com/p/638419532
perception 两大挑战:
- (1) 从给定的图像中提取各种信息，如: image-level labels, semantic segments, object bounding boxes, object contours, occluding boundaries, vanishing points
- (2) 同时对许多不同的visual domain进行建模, 如Internet images, characters, glyph, animal breeds, sketches, galaxies, planktons.
- 本文关注第二点 
- look at how deep learning techniques can be used to learn universal representations全局表征
- **multiple-domain learning:**
- learn well from many domains & learn without forgetting
- 使用残差结构的优势: A major advantage of adopting a residual architecture for the adapter modules is that the adapters reduce to the **identity function** when their coefficients are zero.
- In our architecture, we **_incorporate the BN layers into the adapter modules_**.
- BN层位于卷积层之前
![[Pasted image 20240411222040.png]]


### **存在的问题**

 Prompt在自然语言处理领域大放异彩，取得的优异成绩足以证明其的有效性。Adapter和Prompt中连续模板的构造需要在预训练模型的基础上添加参数，并在训练过程中对参数进行优化。与全模型微调方法相比，虽然降低了训练成本，但是在模型中新添加了参数，会导致模型在推理过程中效率的降低，在实际中应用中这个缺点会被放大。**「如何在少量添加模型参数甚至不添加的情况下将模型微调至较好的效果是未来的一个研究方向」**。