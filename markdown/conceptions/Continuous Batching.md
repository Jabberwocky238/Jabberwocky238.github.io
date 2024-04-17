Continuous Batching现已成为大型**模型推理框架**的关键技术，也是框架性能优化的主战场。通过将多个在线请求进行批处理（Batching），可以提高 GPU 的使用效率。这些框架的Batching设计是针对具有相同形状的输入请求，如相同尺寸的图像。然而，Transformer 的出现使得输入序列和批次大小都变得可变，这为Batching带来了新的挑战和机遇。

[[TurboTransformers]]
[一篇英文博客](https://www.anyscale.com/blog/continuous-batching-llm-inference)

[[BatchMaker： Low Latency RNN Inference with Cellular Batching |BatchMaker]]
