<h1>没看懂</h1>
<p><a href="https://zhuanlan.zhihu.com/p/686175505">https://zhuanlan.zhihu.com/p/686175505</a></p>
<p><img src="/markdown/ai/assets/imgs/Pasted image 20240412113329.png" alt="/markdown/ai/assets/imgs/Pasted image 20240412113329.png"></img></p>
<p><img src="/markdown/ai/assets/imgs/Pasted image 20240412113438.png" alt="/markdown/ai/assets/imgs/Pasted image 20240412113438.png"></img></p>
<p>P-Tuning计算流程大致如下：</p>
<ol>
<li>基于任务场景设计多个模板，模板中包含占位符(也叫做virtual token)，用来插入输入和需要预测的标签，例如：“这个电影是《MASK》的，因为《输入文本》”</li>
<li>用一个可训练的encoder将映射到语言模型隐藏层。</li>
<li>将固定的离散prompt和可学习连续prompt的隐藏层串联，然后输入语言模型进行预测。</li>
<li>通过反向传播更新virtual token，使其学习到有助于稳定和提升性能的表示。</li>
<li>重复上述步骤，直至virtual token收敛。</li>
<li>在测试时，使用最优化的virtual token串联离散prompt，输入语言模型进行预测。</li>
</ol>