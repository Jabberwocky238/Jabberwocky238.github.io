<p><a href="https://zhuanlan.zhihu.com/p/639685912">https://zhuanlan.zhihu.com/p/639685912</a></p>
<p>深度学习的研究中出现了许多大型预训练模型，例如BERT、GPT、GPT3等，这些模型在许多自然语言处理任务中取得了优异的性能表现。随着ChatGPT的迅速出圈，加速了大模型时代的变革。</p>
<p>受启发于In Context Learning（在输入前添加Prompt），作者也要在<strong>输入前</strong>添加Prompt。
离散的Prompt不稳定，因此将离散的提示词改进为<strong>连续的提示向量</strong>。</p>
<p>prefix Tuning是PEFT方法之一，prefix-tuning之前的工作主要是人工设计模板或者自动化搜索模板，也是prompt范式的第一阶段，就是在输入上加上prompt文本，再对输出进行映射。这种离散模板对模型的鲁棒性很差。所以后续的研究都将离散的方式转成连续。</p>
<p>prefix-tuning在模型输入前添加一个连续的且任务特定的向量序列称之为prefix，固定PLM的所有参数，只更新优化特定任务的prefix。</p>
<p><div class="markdown-img"><img src="/markdown/assets/Pasted image 20240412105248.png" alt="Pasted image 20240412105248.png"></img></div></p>
<h3>1、Prefix 具体添加到模型的哪部分？</h3>
<p>对于Decoder-only结构，其在Decoder每一层的Attention结构中加入Prefix向量。<strong>Attention由Q、K、V组成，prefix向量添加到K和V前面，也即concat(prefix, K)和concat(prefix, V)</strong>，每一层的prefix向量，每个K和V所拼接的prefix向量均不相同。</p>
<p><div class="markdown-img"><img src="/markdown/assets/Pasted image 20240412110720.png" alt="Pasted image 20240412110720.png"></img></div></p>
<p>对于Encoder-Decoder结构，其在Encoder每一层Attention的Q、K前添加Prefix向量，同理在Decoder每一层Attention的Q、K前也添加Prefix向量。Encoder和Decoder的Prefix向量不同，Encoder和Decoder每一层的Prefix向量也不同，每层Q和K的Prefix向量也不同。</p>
<p><div class="markdown-img"><img src="/markdown/assets/Pasted image 20240412110957.png" alt="Pasted image 20240412110957.png"></img></div></p>
<p>机制：将多个prompt vectors 放在每个multi-head attention的key矩阵和value矩阵之前
计算方式：相当于原始的token要多和这些soft prompt token计算相似度，然后聚合。
<div class="markdown-img"><img src="/markdown/assets/Pasted image 20240412105532.png" alt="Pasted image 20240412105532.png"></img></div>
<div class="markdown-img"><img src="/markdown/assets/Pasted image 20240412105740.png" alt="Pasted image 20240412105740.png"></img></div>
通过上面等式的变换，等式的前部分是不加入prefix向量的初始attention计算的公式，后半部分则是上下文向量无关的部分。通过一个类似门的机制来计算前后两部分的比重，如果用h表示原本的attention模块输出，那么prefix tuning的attention计算可以写成如下形式，加入prefix的attention模块输出等于原本attention模型输出和一个与上下文无关的增量之间的加权平均。</p>
<h3>2、Prefix矩阵分解</h3>
<p>作者发现直接更新多个虚拟token的参数效果不稳定，因此在Prefix层加了MLP，分解成了更小的embedding层 _更大的MLP层。原始的embedding层参数是n_prefix emb_dim,_调整后变为n_prefix <em>n_hidden + n_hidden</em> * emb_dim。训练完成后这部分就不再需要只保留MLP输出的参数进行推理即可。</p>
<h3>3、Prefix长度</h3>
<p>prefix部分到底使用多少个虚拟token，直接影响模型微调的参数量级，以及处理长文本的能力。默认的prefix长度为10，作者在不同任务上进行了微调，整体上prompt部分的参数量都在原模型的~0.1%。</p>
<p>在summarization任务上，Prefix-tuning性能不如fine tuning，原因或许如下：<br />
a. XSUM数据集（用来做摘要任务）比E2E、WebNLG、DART数据集(tabel-to-text任务)多包含4倍的样例<br />
b. XSUM数据集比E2E、WebNLG、DART数据集(tabel-to-text任务)样例长17倍<br />
c. summarization任务比table-to-text任务更复杂，需要一定的阅读理解能力</p>
<p>低数据量时，微调性能会下降。但是，Prefix-tuning整体高于fine-tuning，差距随着数据量的增大而减小。</p>
<p>个人思考：用低数据量去微调全部参数必然影响性能，不如prefix-tuning。当数据量增加时，两者之间的差距逐渐减小。</p>
<h2>从提示调优（<a href="/#/document/conceptions/PEFT(Parameter-Efficient Fine-Tuning)/Prompt Tuning.md">Prompt Tuning</a>）到前缀调优（Prefix Tuning）</h2>
<p>前缀调整的想法是向每个变换器块添加可训练的张量，而不是像在软提示调整中那样仅向输入嵌入添加。此外，我们通过全连接层（具有两层的迷你多层感知器和中间的非线性激活函数）获得软提示嵌入。下图说明了常规转换器块和使用前缀修改的转换器块之间的区别。</p>
<p><div class="markdown-img"><img src="/markdown/assets/Pasted image 20240412112150.png" alt="Pasted image 20240412112150.png"></img></div></p>
<p>请注意，在上图中，“全连接层”指的是一个小型多层感知器（两个全连接层，中间有一个非线性激活函数）。这些完全连接的层将软提示嵌入到与变换器块输入具有相同维度的特征空间中，以确保连接的兼容性。使用（Python）伪代码，我们可以说明常规转换器块和前缀修改转换器块之间的区别，如下所示：</p>
<p><div class="markdown-img"><img src="/markdown/assets/Pasted image 20240412112324.png" alt="Pasted image 20240412112324.png"></img></div></p>
