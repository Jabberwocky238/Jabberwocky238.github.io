<p>Continuous Batching现已成为大型<strong>模型推理框架</strong>的关键技术，也是框架性能优化的主战场。通过将多个在线请求进行批处理（Batching），可以提高 GPU 的使用效率。这些框架的Batching设计是针对具有相同形状的输入请求，如相同尺寸的图像。然而，Transformer 的出现使得输入序列和批次大小都变得可变，这为Batching带来了新的挑战和机遇。</p>
<p><a href="/#/document/ai/models/TurboTransformers.md">TurboTransformers</a></p>
<p><a href="https://www.anyscale.com/blog/continuous-batching-llm-inference">一篇英文博客</a></p>
<p><a href="/#/document/BatchMaker|BatchMaker.md">BatchMaker|BatchMaker</a></p>
