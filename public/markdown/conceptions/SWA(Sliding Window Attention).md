<h2>别名</h2>
<p>稀疏注意力计算</p>
<p>Mistral 使用了GQA和SWA两种方法来加速计算Attention，GQA在<a href="https://zhuanlan.zhihu.com/p/649756898">Llama 2详解</a>的文章中说明过，这里主要讲解一下SWA。我们知道在Attention的计算一般是<strong>Q</strong> 与shape为<code>[bst, multi-head,seq_len, head_dim]</code> 的<strong>KV</strong>进行注意力计算，其中<code>seq_len</code>为已处理所有tokens总数，GQA在多头上做文章使得多组Q共享一组KV；而SWA则是在<code>seq_len</code>这个维度做文章，不在将Q与所有seq-len的<strong>KV</strong> &quot;<strong>直接</strong>&quot;计算注意力，而是只与<strong>Sliding Window Size</strong>的<strong>KV</strong>&quot;<strong>直接</strong>&quot;计算注意力，如下示意图，为Sliding Window Size为3的情况
<img src="/markdown/assets/Pasted image 20240409182200.png" alt="Pasted image 20240409182200.png"></img>
<img src="/markdown/assets/Pasted image 20240409182226.png" alt="Pasted image 20240409182226.png"></img></p>