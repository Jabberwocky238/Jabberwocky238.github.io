https://zhuanlan.zhihu.com/p/377768673


由于REINFORCE算法为基于monte-carlo的[[on policy]]，存在以下缺点：

1. 更新基于on policy方法的策略需要用到最新的样本（samples from the current policy），因此每次只更新一步便把样本舍弃，这意味着旧样本不能重复使用，造成data inefficiency。
2. 若是使用深度网络来拟合策略，则需要更多的更新步，更是造成训练过程缓慢。
3. Monte-Carlo的采样更新方式使得策略的学习效率低（每回合结束才开始更新）。
4. 方程中不含baseline，采样更新方差大。

