<p>Llama 2 在对序列进行位置编码时，也与标准Transformer不一样，Llama 2的位置编码==在每个Attention层中分别对QK进行RoPE位置编码==，==而不是在Transformer Block之前进行一次位置编码==，也就是说每次计算Attention时都分别要对Q K做位置编码(llama 2 官方代码中是这么干的)。</p>
<h3>绝对位置编码</h3>
<p><img src="/markdown/assets/Pasted image 20240409180416.png" alt="Pasted image 20240409180416.png"></img></p>
<h3>旋转位置编码</h3>
<p><img src="/markdown/assets/Pasted image 20240409180811.png" alt="Pasted image 20240409180811.png"></img>
<a href="https://spaces.ac.cn/archives/8265/comment-page-1">苏剑林原文</a></p>
