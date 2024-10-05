---
sidebar_label: Cargo.toml配置文件
---

```toml
[dependencies]
serde_derive = { version = "1", optional = true, path = "../serde_derive" }

[dev-dependencies]
serde_derive = { version = "1", path = "../serde_derive" }

[features] # 除了default，剩下都是可选特性列表，中括号内的是依赖项
default = ["std"]
derive = ["serde_derive"]
std = []
unstable = []
alloc = []
rc = []
```