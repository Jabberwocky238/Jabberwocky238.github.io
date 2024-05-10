<p><strong>DINO</strong> (<strong>D</strong>ETR with<strong>I</strong>mproved de<strong>N</strong>oising anch<strong>O</strong>r boxes)，从三月初霸榜至今（7月），该模型第一次让DETR （<strong>DE</strong>tection <strong>TR</strong>ansformer）类型的检测器取得了目标检测的SOTA性能，在COCO上取得了<strong>63.3</strong> AP的性能，相比之前的SOTA检测器将模型参数和训练数据减少了十倍以上！</p>
<p>DINO: DETR with Improved DeNoising Anchor Boxes for End-to-End Object Detection
<a href="https://arxiv.org/abs/2203.03605">https://arxiv.org/abs/2203.03605</a></p>
<h3>Motivation 出发点</h3>
<p>Transformer如今被广泛应用于自然语言处理和计算机视觉，并在很多主流的任务上都取得了最好的性能。然而，在目标检测领域，DETR这种基于Transformer的检测器虽然作为一种很有新意的检测器，但却没有作为一种主流的检测器得到广泛运用。例如，几乎所有的模型在P<a href="https://link.zhihu.com/?target=https%3A//paperswithcode.com/sota/object-detection-on-coco">aperWithCode</a>的榜单上都是使用传统的CNN检测头 （如HTC<a href="/#/document/1">1</a>(<a href="https://zhuanlan.zhihu.com/p/540786844#ref_1)%EF%BC%89%E3%80%82">https://zhuanlan.zhihu.com/p/540786844#ref_1)）。</a></p>
<p>因此，我们很感兴趣的事就是，DETR这种简洁、端到端可学习的目标检测器，同时还有更强的模型Transformer的加持，<strong>能否无法取得更好的表现</strong>？</p>
<h3>Background 背景简介</h3>
<p>在做DINO之前，我们实验室的几个同学完成了DAB-DETR 和DN-DETR，DINO也是我们几个同学一起接着这两篇工作的一个延续，沿用了这些设计。</p>
<p>DAB-DETR是在思考DETR query理解的问题。
它直接把DETR的positional query显示地建模为四维的框(𝑥,𝑦,𝑤,ℎ)
同时每一层decoder中都会去预测相对偏移量(Δ𝑥,Δ𝑦,Δ𝑤,Δℎ)并去更新检测框，
得到一个更加精确的检测框预测(𝑥′,𝑦′,𝑤′,ℎ′)=(𝑥,𝑦,𝑤,ℎ)+(Δ𝑥,Δ𝑦,Δ𝑤,Δℎ)，
动态更新这个检测框并用它来帮助decoder cross-attention来抽取feature。</p>
<p>DN-DETR是在思考DETR中的二分图匹配问题，或者说标签分配问题。我们发现DETR中的二分匹配在早期十分不稳定，这会导致优化目标不一致引起<strong>收敛缓慢</strong>的问题。因此，我们<strong>使用一个denoising task直接把带有噪声的真实框输入到decoder中，作为一个shortcut来学习相对偏移，它跳过了匹配过程直接进行学习</strong>（详细理解在<a href="https://www.zhihu.com/question/517340666/answer/2381304399">我之前的文章</a>）。</p>
<p>这两篇文章让我们对DETR的理解加深了很多，同时也把DETR类型模型的效果做到了和传统CNN模型在收敛速度和结果上comparable。如何进一步提高检测器性能和收敛速度？我们可以沿着DAB和DN去进一步思考：</p>
<ul>
<li><strong>DAB让我们意识到query的重要性，那么如何学到更好的或者初始化更好的query？</strong></li>
<li><strong>DN引入了去噪训练来稳定标签分配，如何进一步优化标签分配？</strong></li>
</ul>
<p><img src="https://pic1.zhimg.com/80/v2-bafe1187e49036f82e2c676dd83fef18_1440w.webp" alt="" /></p>
<p><strong>1.Contrastive denoising（DN）</strong></p>
<p>DN的去噪训练里面引入的噪声样本都是正样本来进行学习，然而模型不仅需要学习到如何回归出正样本，还需要意识到<strong>如何区分负样本</strong>。例如，DINO的decoder中用了900个query，而一张图中一般只会有几个物体，因此绝大部分都负样本。</p>
<p><img src="https://pic1.zhimg.com/80/v2-620582089e351f4e3ae38ed709fac678_1440w.webp" alt="" /></p>
<p>因此，我们设计了训练模型识别负样本的方法，如上图所示，我们对DN进行了改进，不仅要回归真实框，还需要辨别负样本。对于DN的输入当对真实框加入了较大噪声时，我们就认为其为负样本，在去噪训练中会被监督不预测物体。同时，这些负样本恰好是在真实框附近的，因此是相对很难区分难的负样本，让模型得以学习的正负样本的区分问题。</p>
<p><strong>2. Mix query selection</strong> ???</p>
<p>在大部分detr模型中，query是从数据集中学习出来的，并不和输入图片相关。为了更好得初始化decoder query，deformable detr提出用encoder的dense feature中预测出类别和框，并从这些密集预测中选出一些有意义的来初始化decoder feature。</p>
<p>然而，这种方式并没有在后来的工作中得到广泛运用，我们对这种方式进行了一些改进并重新强调其重要性。在query中，我们实际更关心position query，也就是框。同时，从encoder feature中选取的feature作为content query对于检测来说并不是最好的，因为这些feature都是很粗糙的没有经过优化，可能有歧义性。例如对“人”这个类别，选出的feature可能只包含人的一部分或者人周围的物体，并不准确，因为它是grid feature。</p>
<p>因此，我们对此进行了改进，让query selection只选择position query，而利用可学习的content query。</p>
<h1>appendix</h1>
<p><a href="https://zhuanlan.zhihu.com/p/540786844">https://zhuanlan.zhihu.com/p/540786844</a></p>
<h1>paper</h1>
<p><a href="/#/document/ai/assets/papers/2203.03605v4.pdf">2203.03605v4.pdf</a></p>
