---
title: rust中变换递归为循环的必要性
authors: [jabberwocky238]
tags: 
    - zh
    - tech
    - rust
date: 2024-10-07T01:45
description: rust中变换递归为循环的必要性
---

虽然现在已经凌晨一点45分但是这个技术点太牛逼了以至于我迫不及待地想要记录下来。

<!-- truncate -->

## 递归会有所有权问题
```rust
pub struct JManager<H, N> {
    nodes: HashMap<H, N>,
    /// hash, children's hash
    chash: HashMap<H, HashSet<H>>,      
}
// 函数的作用是查出所有子节点并删除
// 但是递归会导致所有权问题，以至于delete_node无法递归调用
impl JManager<u64, u64> {
    fn delete_node(&mut self, node: &u64) -> Result<(), Box<dyn std::error::Error>> {
        let chs = self.chash.get(ph).unwrap(); // borrow immutable self
        if !self.nodes.contains_key(&node) { // borrow immutable self
            for ch in chs.iter() {
                self.delete_node(ch); // borrow mutable self, panic!
            }
            Ok(())
        } else {
            Err("Node not exist".into())
        }
    }
}
```

## 循环可以避免所有权问题

```rust
impl JManager<u64, u64> {
    fn delete_node(&mut self, node: &u64) -> Result<(), Box<dyn std::error::Error>> {
        if !self.nodes.contains_key(&node) {
            return Err("Node not exist".into());
        } 
        let mut to_delete = vec![node.clone()]; // queue

        while let Some(h) = to_delete.pop() {
            // parent remove child
            if let Some(ph) = self.phash.get(&h) {
                self.chash.get_mut(ph).unwrap().remove(&h);
            }
            // add children to queue
            if let Some(chs) = self.chash.get(&h) {
                // 将子节点添加到待删除列表
                let chs = chs.iter().cloned().collect::<Vec<_>>();
                to_delete.extend(chs);
                // 这里是对chash的可变引用，而不是self，所以不会报错
                // 虽然我老感觉chash的引用有所有权问题
                self.chash.remove(&h);
            }

            // **SAME EFFECT AS ABOVE**
            // let chs = self.chash.get(&h).unwrap();
            // let chs = chs.iter().cloned().collect::<Vec<_>>();
            // to_delete.extend(chs);
            // self.chash.remove(&h);

            self.nodes.remove(&h);
        }
        Ok(())
    }
}
```

这段代码让我想到了DFS递归版和循环版，太优美了。
