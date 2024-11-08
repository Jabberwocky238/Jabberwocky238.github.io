---
sidebar_position: 10
sidebar_label: 💩派生宏 proc macro derive
sidebar_class_name: green
---

# 派生宏
这段代码展示了如何在 Rust 中使用过程宏来实现自定义的派生（derive）宏，用于序列化和反序列化。这些宏利用了 `proc_macro_derive` 属性来创建 `Serialize` 和 `Deserialize` 特性的派生实现。让我们逐步分析这段代码：

### 序列化派生宏

```rust
#[proc_macro_derive(Serialize, attributes(serde))]
pub fn derive_serialize(input: TokenStream) -> TokenStream {
    let mut input = parse_macro_input!(input as DeriveInput);
    ser::expand_derive_serialize(&mut input)
        .unwrap_or_else(syn::Error::into_compile_error)
        .into()
}
```

1. **属性 `#[proc_macro_derive(Serialize, attributes(serde))]`**:
   - 这告诉 Rust 编译器，这个函数是一个派生宏，用于实现 `Serialize` trait。
   - `attributes(serde)` 指定了宏可以接受 `serde` 属性。

2. **函数签名 `pub fn derive_serialize(input: TokenStream) -> TokenStream`**:
   - 输入 `input` 是一个 `TokenStream`，这是 Rust 宏系统中的抽象，代表 Rust 代码的一系列 token。
   - 输出也是一个 `TokenStream`，表示宏展开后的 Rust 代码。

3. **解析输入 `let mut input = parse_macro_input!(input as DeriveInput);`**:
   - 使用 `parse_macro_input!` 宏将输入的 `TokenStream` 解析为 `DeriveInput` 结构体，它包含了 Rust 项（如结构体、枚举等）的详细信息。

4. **展开宏 `ser::expand_derive_serialize(&mut input)`**:
   - 调用 `ser` 模块中的 `expand_derive_serialize` 函数，传入解析后的 `DeriveInput`。
   - 这个函数负责生成实现 `Serialize` trait 的代码。

5. **错误处理 `.unwrap_or_else(syn::Error::into_compile_error)`**:
   - 如果展开失败，将错误转换为编译时错误。

6. **转换为 `TokenStream`**:
   - 最后，将结果转换回 `TokenStream` 以供编译器使用。

### 反序列化派生宏

```rust
#[proc_macro_derive(Deserialize, attributes(serde))]
pub fn derive_deserialize(input: TokenStream) -> TokenStream {
    let mut input = parse_macro_input!(input as DeriveInput);
    de::expand_derive_deserialize(&mut input)
        .unwrap_or_else(syn::Error::into_compile_error)
        .into()
}
```

1. **属性 `#[proc_macro_derive(Deserialize, attributes(serde))]`**:
   - 类似于序列化宏，这个属性指定了宏用于实现 `Deserialize` trait。

2. **函数签名和解析输入与序列化宏相同**。

3. **展开宏 `de::expand_derive_deserialize(&mut input)`**:
   - 调用 `de` 模块中的 `expand_derive_deserialize` 函数，生成实现 `Deserialize` trait 的代码。

4. **错误处理和转换为 `TokenStream`**:
   - 与序列化宏相同，处理错误并转换输出。

### 总结

这些宏使得开发者可以通过在 Rust 结构体或枚举上使用 `#[derive(Serialize, Deserialize)]` 来自动实现序列化和反序列化功能，而不需要手动实现 `serde::Serialize` 和 `serde::Deserialize` traits。这是通过在编译时生成所需的代码来实现的，极大地简化了数据序列化和反序列化的处理。

```rust
quote! {
    impl #impl_generics #ident #ty_generics #where_clause {
        #vis fn serialize<__S>(__self: &#remote #ty_generics, __serializer: __S) -> #serde::__private::Result<__S::Ok, __S::Error>
        where
            __S: #serde::Serializer,
        {
            #used
            #body
        }
    }
}
```
这段代码使用 `quote!` 宏来生成 Rust 代码，通常用于定义或扩展一个类型的 `serialize` 方法作为 `Serialize` trait 的实现。`quote!` 宏是 `proc_macro` 库的一部分，允许开发者动态生成 Rust 代码。这种代码生成通常在过程宏中使用。让我们分解这段代码：

### 组件解析

1. **`impl #impl_generics #ident #ty_generics #where_clause`**:
   - 这是 `impl` 块的开始，用于实现一个 trait 或为一个类型添加方法。
   - `#impl_generics`: 表示实现泛型参数（例如 `<T: Trait + 'a>`）。
   - `#ident`: 表示类型名称（例如 `MyType`）。
   - `#ty_generics`: 表示类型后的泛型参数（例如 `<T, U>`）。
   - `#where_clause`: 表示 `where` 子句，用于添加泛型参数的约束（例如 `where T: Serialize`）。

2. **`#vis fn serialize<__S>(__self: &#remote #ty_generics, __serializer: __S) -> #serde::__private::Result<__S::Ok, __S::Error>`**:
   - `#vis`: 表示可见性修饰符，如 `pub` 或 `pub(crate)`。
   - 函数 `serialize` 是尝试为类型添加序列化功能的方法。
   - `__S`: 表示序列化器的类型，它实现了 `serde::Serializer` trait。
   - `__self`: 表示方法的 `self` 参数，这里是对当前类型的引用。
   - `__serializer`: 表示用于序列化的序列化器实例。

3. **`where __S: #serde::Serializer,`**:
   - 这是一个约束，确保 `__S` 类型实现了 `serde::Serializer` trait。

4. **`#used` 和 `#body`**:
   - `#used`: 可能是用来标记某些代码段已经被使用，避免未使用代码的警告。
   - `#body`: 是实际的序列化逻辑，这部分代码将具体实现如何将 `__self` 序列化。

### 示例解释

假设我们有一个结构体 `Person`，我们想要为其实现自定义的序列化逻辑：

```rust
struct Person {
    name: String,
    age: u32,
}

impl Person {
    pub fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(&self.name)
    }
}
```

使用 `quote!` 宏，我们可以动态生成类似的代码。这里的 `#ident` 可以被替换为 `Person`，`#ty_generics` 可以为空（因为 `Person` 没有泛型参数），`#used` 和 `#body` 可以包含实际的序列化逻辑。

### 总结

这种代码生成方式在处理复杂的泛型类型和需要为多种类型生成相似代码时非常有用。通过使用 `quote!` 宏，开发者可以减少重复代码，提高代码的可维护性和灵活性。

编译器开洞组合
```toml
proc-macro2 = { workspace = true, features = ["proc-macro"] }
quote = { workspace = true, features = ["proc-macro"] }
syn = { workspace = true, features = ["clone-impls", "derive", "parsing", "printing", "proc-macro"] }
```

我瑟瑟发抖
```rust
use proc_macro2::Span;
use quote::ToTokens;
use std::mem;
use syn::punctuated::Punctuated;
use syn::{
    parse_quote, Data, DeriveInput, Expr, ExprPath, GenericArgument, GenericParam, Generics, Macro,
    Path, PathArguments, QSelf, ReturnType, Token, Type, TypeParamBound, TypePath, WherePredicate,
};
```
