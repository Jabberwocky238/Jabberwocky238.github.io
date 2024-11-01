对于transformer来说，由于self-attention操作是permutation-invariant的，所以需要一个positional encodings（PE）来显示地编码sequence中tokens的位置信息。

ViT模型是采用学习的固定大小的positional embedding，但是当图像输入大小变化时，就需要对positional embedding来插值来适应输入tokens数量带来的变化，这一过程会造成性能损失。

这里介绍的CPVT，就主要来解决这个问题，CPVT的解决方案是引入一个带有zero-padding的卷积来隐式地编码位置信息（PEG），从而省去了显式的positional embedding，最重要的是CPVT模型在==输入图像大小变化时性能是稳定的==。

CPVT这种特性是很多图像任务所需要的，比如分割和检测往往需要大小变化的输入图像。

### **位置编码的影响**

由于self-attention的permutation-invariant使得transformer需要一个特殊的positional encodings来显式地引入sequence中tokens的位置信息，因为无论是文本还是图像sequence，位置信息都是非常重要的。论文中以DeiT-tiny为实验模型，分别采用**no positional encodings**，**learnable absolute positional encodings**，**fixed sin-cos positional encodings**以及**relative postional encodings**等，不同的策略在ImageNet下的效果如下表所示：

![](https://pic4.zhimg.com/80/v2-d334163ac725c0d07bdce8750b0c685f_1440w.webp)

主要结论如下：

- positional encodings对模型性能比较关键，不采用任何PE效果最差；
- relative postional encodings相比absolute positional encodings效果稍差，绝对位置编码比较重要；
- 采用显式的PE，当图像分辨率提升时直接对PE插值处理，性能会下降；

对于显式的PE，当图像分辨率与训练时不一致，往往需要finetune来弥补PE插值带来的性能损失。另外，论文中还提到了采用显式的PE会破坏图像tokens的“平移等价性”（translation equivariance，论文中说的是translation invariance：“平移不变性”，但是我理解应该前者更合适）：当一个物体在图像中进行平移时，只是物体对应的tokens发生了变化，但是token embeddings并不会变（卷积也具有平移等价性：物体平移，“特征”也是同样平移）。但是不同位置的PE是不同的，虽然token embeddings是一样的，但是会加上不同的PE，那么平移等价性就被破坏了。

### **PEG：Conditional Positional Encodings**

基于上面的实验分析，论文中认为一个理想的positional encoding应该满足一下条件：
1. 处理sequence时，操作具有permutation-variant但translation-equivariance特性：对位置敏感但同时具有平移等价性；  
2. 能够自然地处理变长的sequence；  
3. 能够一定程度上编码绝对位置信息（absolute position）。  
    
基于这三点，论文中给出的方案是采用一个带有zero padding的2D卷积（ kernel size k ≥ 3)来充当positional encodings。卷积是一种局部运算，所以当tokens顺序被打乱，特征就发生了变化，卷积天生具有平移等价性，所以卷积满足第一点，对于第二点更是毫无疑问。现在关键的是第三点，因为从直觉来看，卷积具有平移等价性，那么是无法编码绝对信息，这两个特性其实是相互矛盾的。但是其实CNN已经被证明了可以编码图像的绝对位置信息，这主要是因为图像的boundary effects以及卷积的zero-padding操作造成的。


另外，论文中还提出用GAP（ Global Average Pooling）来替换class token来实现分类，因为GAP是translation-invariant的（这里是平移不变性），配合PEG的平移等价性，模型就是translation-invariant的，这样效果更好。比如CPVT-Ti采用GAP相比CLT提升了1点以上。

# appendix

https://zhuanlan.zhihu.com/p/362484098







