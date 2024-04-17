
https://zhuanlan.zhihu.com/p/685154159

**总的来说，主要区别在于在策略方法中，数据收集和策略更新是基于当前策略进行的，而在离策略方法中，数据收集和策略更新可以独立于当前策略。**

在强化学习中，"on-policy"（在策略）和"off-policy"（离策略）是两种不同的学习框架，它们之间的主要区别在于算法如何使用收集到的数据来更新策略。

**On-policy（在策略）**：  
- 在策略方法是指在训练过程中，智能体使用当前策略（例如ε-贪心策略）与环境进行交互，并且使用从这些交互中获得的数据来更新策略。
- 具体来说，在策略方法通常使用的是状态-动作对的轨迹（也称为样本）来更新策略。这意味着策略更新所使用的数据是由当前策略生成的。
- 常见的在策略学习算法包括SARSA（State-Action-Reward-State-Action）和A2C（Advantage Actor-Critic）。

**Off-policy（离策略）**： 
- 离策略方法是指在训练过程中，智能体可以使用以往收集的经验，而不是当前策略与环境进行交互。换句话说，它可以使用来自任意策略生成的数据来更新策略。
- 具体来说，离策略方法通常使用的是状态-动作对的经验回放缓冲区中的样本来更新策略。这些样本可以是从任何策略生成的。
- 常见的离策略学习算法包括Q-learning和DQN（Deep Q-Network）。


https://zhuanlan.zhihu.com/p/657538428

On-policy和Off-policy在强化学习领域非常重要，那么on-policy 与off-policy到底有什么区别？

**学习方式上的区别：**

若agent与环境互动，则为**On-policy**（此时因为agent亲身参与，所以互动时的policy和目标的policy一致）；若agent看别的agent与环境互动，自己不参与互动，则为**Off-policy**（此时因为互动的和目标优化的是两个agent，所以他们的policy不一致）

**采样数据利用上的区别：**

**On-policy：** 采样所用的policy和目标policy一致，采样后进行学习，学习后目标policy更新，此时需要把采样的policy同步更新以保持和目标policy一致，这也就导致了需要重新采样。

**Off-policy**：采样的policy和目标的policy不一样，所以你目标的policy随便更新，采样后的数据可以用很多次

上述理解还是不够深刻，最近看了一篇文章，理解深刻到位。

**online/offline是从能否和环境交互来说的，**

**on-policy和off-policy是算法利用的是不是当前这个策略的数据来评价自己**。

**因此，offline一定得用off-policy的数据，因为offline dataset肯定不是当前这个策略采的。online用on-policy和off-policy都可以，但是off-policy样本效率高很多，同时也更不容易训练**。

