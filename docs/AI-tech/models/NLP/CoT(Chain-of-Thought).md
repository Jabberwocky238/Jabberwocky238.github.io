
思维链，在人工智能领域，是一个非常非常新的概念。强大的逻辑推理是大语言模型“智能涌现”出的核心能力之一，好像AI有了人的意识一样。而推理能力的关键在于——思维链（Chain of Thought，CoT）。

一种prompt方法，对于复杂问题（尤其是复杂的数学题），大模型很难直接给出正确答案。COT通过要求模型在输出最终答案之前，**显式输出中间逐步的推理步骤**这一方法来增强大模型的算数、常识和推理能力。简单，但有效。

CoT 大幅度提高了 LLM 在复杂推理任务上的表现，并且输出的中间步骤**方便使用者了解模型的思考过程，提高了大模型推理的可解释性**。目前，思维链推理已经成为大模型处理复杂任务的一个常用手段

2022 年，在 Google 发布的论文《Chain-of-Thought Prompting Elicits Reasoning in Large Language Models》中首次提出，**通过让大模型逐步参与将一个复杂问题分解为一步一步的子问题并依次进行求解的过程可以显著提升大模型的性能。而这一系列推理的中间步骤就被称为思维链（Chain of Thought）**。

![](https://pic1.zhimg.com/80/v2-749732cad45582c29625e22d814e3ee8_1440w.webp)

区别于传统的 Prompt 从输入直接到输出的映射 <input——>output> 的方式，CoT 完成了从输入到思维链再到输出的映射，即 <input——>reasoning chain——>output>。如果将使用 CoT 的 Prompt 进行分解，可以更加详细的观察到 CoT 的工作流程。

![](https://pic3.zhimg.com/80/v2-a36e119c28196235b5b0cf9c4d45d87e_1440w.webp)

如上图所示，**一个完整的包含 CoT 的 Prompt 往往由指令（Instruction），逻辑依据（Rationale），示例（Exemplars）三部分组成**。一般而言指令用于描述问题并且告知大模型的输出格式，逻辑依据即指 CoT 的中间推理过程，可以包含问题的解决方案、中间推理步骤以及与问题相关的任何外部知识，而示例则指以少样本的方式为大模型提供输入输出对的基本格式，每一个示例都包含：问题，推理过程与答案。

以是否包含示例为区分，可以将 CoT 分为 Zero-Shot-CoT 与 Few-Shot-CoT，**在上图中，Zero-Shot-CoT 不添加示例而仅仅在指令中添加一行经典的“Let's think step by step”，就可以“唤醒”大模型的推理能力。而 Few-Shot-Cot 则在示例中详细描述了“解题步骤”，让模型照猫画虎得到推理能力**。

首先，从工程的角度而言，CoT 的适用场景抽象一下可以被归纳为三点，**分别是使用大模型（1），任务需要复杂推理（2），参数量的增加无法使得模型性能显著提升（3）**。此外，现有的论文实验也表明，CoT 更加适合复杂的推理任务，比如计算或编程，不太适用于简单的单项选择、序列标记等任务之中，并且 CoT 并不适用于那些参数量较小的模型（20B以下），在小模型中使用 CoT 非常有可能会造成机器幻觉等等问题。

而从理论角度，一篇来自斯坦福的论文《Why think step-by-step? reasoning emerges from the locality of experience》揭示了**当大模型的训练数据表现出了如上图中的变量的局部簇结构（Local Clusters of Variables）时，CoT 将会展现极好的效果**。而变量的局部簇主要指训练数据中变量之间有着强的相互作用，相互影响的关系。

**CoT 应当被用于 20B 以上参数规模的模型之中，并且模型的训练数据应当于任务问题相关且彼此相互有较强的联结。**

### **COT**构造

1、人工构造：质量高，但人力成本大，不好优化、不好跨任务迁移

2、自动构造：分为 Zero-shot CoT 和 Auto CoT 两种方式。前者通过特定的提示文本激发模型在没有示例的情况下生成推理链条；后者则是使用前者零样本生成的推理链条，并结合示例选择策略，通过少样本学习的方式生成推理链条。但自动的质量一般没有人工的好，导致大模型幻觉问题严重。

![](https://pic2.zhimg.com/80/v2-d5d8345848ddc7dc9c839c50ad795dc9_1440w.webp)

**总的来说，CoT 的发展方向有三条主要的路径，如图从左到右分别是 “Prompt 模式”，“推理结构”以及“应用场景”**。从这三个主要的发展方向出发，我们来概述一下主要的论文：

### **Prompt 模式**

首先，是 Prompt 模式，在上图中的最左边，**Prompt 模式主要研究“向大模型输入怎样的 Prompt 可以使得大模型获得更好的推理能力”**，关于 Prompt 模式的研究也可以分为两类，分别是指令生成与范例生成。

对于指令生成问题，又可以分为手动指令生成与自动指令生成，显然简单的“Let's think step by step”就属于手动指令生成模式，此外，另一类的手动指令生成模式是 Plan-and-Solve 方法，其主要思想在于让模型制定一个将任务分为更小子任务的计划，再让模型一步一步执行计划、解决问题，其 Prompt 为“Let’s first understand the problem and devise a plan to solve the problem. Then, let’s carry out the plan and solve the problem step by step”。

显然，手动指令生成无法适应复杂的实际情况，因此自动指令生成应运而生，自动指令生成的代表作有两个，分别是自动 Prompt 工程（APE）以及提示优化（OPRO），**如上图所示，APE 与 OPRO 的核心思想都在于设计了一套机制让大模型通过观察各个候选的 Prompt 的实际任务中的表现，通过最大化表现得分来自动选择最优的 Prompt 。**


CoT 验证最经典的工作即是自我验证（Self-Verification），自我验证有两个步骤，分别是（1）对多个候选的推理路径进行采样；（2）给定问题结论让大模型验证条件是否满足结论，并根据验证分数对候选结论进行排序。

**应用场景**

**除了对 CoT 本身的改变，还有许多工作将 CoT “部署”于不同的应用场景之下以提升各种场景下大模型的能力**，譬如最简单的从单语言 CoT 扩展到多语言 CoT。这些应用场景包括从单模态到多模态以及从复杂推理任务到通用推理任务的扩展。其中，多模态 CoT 具有很大的应用前景，在 CoT 中，多模态可以分为两类：输入多模态与输出多模态。

其中，MM-CoT 是输入多模态研究的第一篇工作，MM-CoT 侧重使用微调方法嵌入 CoT，通过将语言和图像合并在一个包含推理生成与答案推理的两阶段的框架中，使用微调大模型赋予输入多模态 CoT 的能力。基于 MM-CoT，GoT-Input 方法通过对 CoT 生成的思维图进行抽取构建三元组，并使用 GNN 将文本、图像与 CoT 统一，从而生成包含 CoT 信息的最终答案。而区别于输入多模型，VCoT 解决了一个输出多模态的问题，VCoT 通过以生成图片的“标题”以及识别核心关注点作为图像生成的启动过程，通过递归的方式填充图像信息，从而实现输出多模态。

除了多模态 CoT 以外，CoT 目前也已经用于如文本摘要（SumCoT），开放域问答（Self-Prompting LLMs），机器翻译（MAPS），化学（ChemCrow）、医学（Med-PaLM）等等领域






# appendix
https://zhuanlan.zhihu.com/p/670907685

