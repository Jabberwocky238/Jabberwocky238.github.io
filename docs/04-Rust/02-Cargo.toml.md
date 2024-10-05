---
sidebar_position: 2
sidebar_label: Cargo.toml
---

# Cargo.toml



## [workspace]

在 Rust 的 Cargo 系统里，`[workspace]` 部分用于定义一个工作区（workspace），它允许你管理多个crate，这些crate 通常被称为成员crate。工作区是一种组织多个相关项目的方法，它可以让你共享依赖项、编译参数和特性。

### 作用

1. **集中管理**：
   - 使用工作区可以集中管理多个crate的版本和依赖，方便统一升级和维护。

2. **共享依赖**：
   - 工作区中的所有crate可以共享相同的依赖，避免重复添加。

3. **同步发布**：
   - 你可以一次性发布工作区中的多个crate，确保它们都是兼容的版本。

4. **跨 crate 特性**：
   - 你可以定义跨 crate 的特性，以便于在开发时启用或禁用某些功能。

### 示例

假设你有一个包含两个 crate 的工作区：一个公共库和一个命令行应用程序，命令行应用程序依赖于这个库。

```toml
# Cargo.toml (工作区根目录)
[workspace]

members = [
    "crates/lib",
    "crates/bin"
]

[package]
name = "my-workspace"
version = "0.1.0"
edition = "2021"

# 可以为整个工作区定义依赖
[dependencies]
my-lib = { path = "crates/lib" }
```

```toml
# Cargo.toml (crates/lib目录)
[package]
name = "my-lib"
version = "0.1.0"
edition = "2021"

[lib]
path = "src/lib.rs"
```

```toml
# Cargo.toml (crates/bin目录)
[package]
name = "my-bin"
version = "0.1.0"
edition = "2021"

[[bin]]
name = "my-bin"
path = "src/main.rs"

[dependencies]
my-lib = { path = "../lib" }
```

### 详细选项

- **`members`**：
  - 定义工作区的成员列表，可以是路径或名称。

- **`packages`**：
  - 定义工作区的包列表，可以是路径或名称。

- **`exclude`**：
  - 定义要排除的成员列表。

- **`include`**：
  - 定义要包含的成员列表，即使它们通常被 `exclude` 排除。

### 使用

使用工作区时，你可以在工作区的根目录运行 Cargo 命令，如 `cargo build`、`cargo test` 和 `cargo run`，Cargo 会根据定义的成员执行相应的操作。

### 总结

`[workspace]` 在 `Cargo.toml` 中定义了工作区的配置，它允许你更有效地管理多个相关的 Rust 项目。通过集中管理依赖和构建配置，你可以简化开发流程并确保跨项目的一致性。


## 真实案例
serde
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

tao
```toml
[package.metadata.docs.rs]
features = [ "rwh_04", "rwh_05", "rwh_06", "serde" ]
default-target = "x86_64-unknown-linux-gnu"
targets = [
  "i686-pc-windows-msvc",
  "x86_64-pc-windows-msvc",
  "i686-unknown-linux-gnu",
  "x86_64-unknown-linux-gnu",
  "x86_64-apple-darwin"
]

[workspace]
members = [ "tao-macros" ]

[target."cfg(target_os = \"windows\")".dev-dependencies]
softbuffer = "0.4"

[target."cfg(any(target_os = \"android\", target_os = \"windows\"))".dependencies]
once_cell = "1"

[target."cfg(target_os = \"android\")".dependencies]
jni = "0.21"
ndk = "0.9"
ndk-sys = "0.6"
ndk-context = "0.1"
tao-macros = { version = "0.1.0", path = "./tao-macros" }

[target."cfg(any(target_os = \"ios\", target_os = \"macos\"))".dependencies]
objc = "0.2"

[target."cfg(target_os = \"macos\")".dependencies]
cocoa = "0.26"
core-foundation = "0.10"
core-graphics = "0.24"
dispatch = "0.2"
scopeguard = "1.2"

[target."cfg(any(target_os = \"linux\", target_os = \"dragonfly\", target_os = \"freebsd\", target_os = \"openbsd\", target_os = \"netbsd\"))".dependencies]
gtk = "0.18"
gdkx11-sys = "0.18"
gdkwayland-sys = "0.18.0"
x11-dl = "2.21"
parking_lot = "0.12"
dlopen2 = "0.7.0"
```