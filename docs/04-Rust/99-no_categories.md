---
sidebar_label: "*未分类*"
sidebar_class_name: green
---

# serde/src/de/impls.rs line 989
```rust
macro_rules! seq_impl {
    (
        $(#[$attr:meta])*
        $ty:ident <T $(: $tbound1:ident $(+ $tbound2:ident)*)* $(, $typaram:ident : $bound1:ident $(+ $bound2:ident)*)*>,
        $access:ident,
        $clear:expr,
        $with_capacity:expr,
        $reserve:expr,
        $insert:expr
    ) => {
        $(#[$attr])*
        impl<'de, T $(, $typaram)*> Deserialize<'de> for $ty<T $(, $typaram)*>
        where
            T: Deserialize<'de> $(+ $tbound1 $(+ $tbound2)*)*,
            $($typaram: $bound1 $(+ $bound2)*,)*
        {
```

这段代码定义了一个 Rust 的过程宏，名为 `seq_impl`。过程宏在 Rust 中是一种非常强大的工具，允许开发者编写可以生成复杂代码模板的宏。这个特定的宏 `seq_impl` 看起来是为了实现序列化和反序列化操作，特别是针对某个泛型类型 `$ty`。让我们逐行分析这个宏的定义：

### 宏定义结构

1. **属性和泛型参数**
   - `$(#[$attr:meta])*`: 这是一个重复参数，用于捕获零个或多个属性。这些属性将被应用到生成的 `impl` 块上。
   - `$ty:ident <T $(: $tbound1:ident $(+ $tbound2:ident)*)*`: 定义了一个泛型类型 `$ty`，其中 `T` 是类型参数，后面跟着一个或多个 trait 绑定（例如 `: Deserialize`）。
   - `$(, $typaram:ident : $bound1:ident $(+ $bound2:ident)*)*`: 可选的额外类型参数和它们的 trait 绑定。

2. **方法和表达式**
   - `$access:ident`, `$clear:expr`, `$with_capacity:expr`, `$reserve:expr`, `$insert:expr`: 这些是宏调用时提供的表达式或方法名，用于在生成的代码中访问、清除、带容量初始化、保留空间和插入元素。

### 宏展开

- **生成的代码**
  - `impl<'de, T $(, $typaram)*> Deserialize<'de> for $ty<T $(, $typaram)*>`: 为类型 `$ty` 实现 `Deserialize` trait。这里的 `'de` 是一个生命周期参数，用于反序列化操作。
  - `where` 子句列出了所有类型参数 `T` 和 `$typaram` 需要满足的 trait 绑定。

### 示例用法

假设我们有一个类型 `MySeq` 和一个类型 `MyTrait`，我们希望为 `MySeq<T>` 实现 `Deserialize`，其中 `T` 必须实现 `Deserialize` 和 `MyTrait`：

```rust
seq_impl!(
    /// MySeq deserializer.
    MySeq<T: Deserialize + MyTrait>,
    access,
    clear,
    with_capacity,
    reserve,
    insert
);
```

在这个例子中，宏会生成一个 `impl` 块，为 `MySeq<T>` 实现 `Deserialize` trait，其中 `T` 需要实现 `Deserialize` 和 `MyTrait`。

### 注意事项

- **复杂性**：过程宏可以非常复杂，尤其是当它们处理多个泛型参数和 trait 绑定时。
- **调试难度**：由于过程宏在编译时展开，它们可能导致难以跟踪的错误。
- **性能**：尽管宏可以生成优化的代码，但过度使用或不当使用可能导致编译时间增加。

这个宏的设计允许它在多种不同的类型和约束上重用，使得代码更加模块化和可维护。

```rust
seq_impl!(
    #[cfg(any(feature = "std", feature = "alloc"))]
    #[cfg_attr(docsrs, doc(cfg(any(feature = "std", feature = "alloc"))))]
    BinaryHeap<T: Ord>,
    seq,
    BinaryHeap::clear,
    BinaryHeap::with_capacity(size_hint::cautious::<T>(seq.size_hint())),
    BinaryHeap::reserve,
    BinaryHeap::push
);

seq_impl!(
    #[cfg(any(feature = "std", feature = "alloc"))]
    #[cfg_attr(docsrs, doc(cfg(any(feature = "std", feature = "alloc"))))]
    BTreeSet<T: Eq + Ord>,
    seq,
    BTreeSet::clear,
    BTreeSet::new(),
    nop_reserve,
    BTreeSet::insert
);
```
在 Rust 宏系统中，`ident` 和 `expr` 是两种不同类型的模式，用于匹配宏定义中的输入。它们的主要区别在于它们所匹配的语法种类：

1. **`ident`**：
   - `ident` 用于匹配标识符。
   - 标识符是 Rust 代码中的名字，比如变量名、函数名、类型名等。
   - 示例：`fn`、`loop`、`Result`、`x`、`y`。

2. **`expr`**：
   - `expr` 用于匹配表达式。
   - 表达式是 Rust 代码中的一个完整的计算单元，可以是字面量、变量引用、函数调用、运算符应用等。
   - 示例：`2 + 2`、`x * y`、`foo()`、`[1, 2, 3]`。

### 详细说明

- **`ident`**：
  - 在宏定义中，`ident` 模式可以捕获一个标识符，并在宏展开时作为标识符使用。
  - 它通常用于捕获函数名、变量名或其他类型的名称。
  - 在宏的替换文本中，捕获的标识符可以通过 `${ident}` 的形式使用。

- **`expr`**：
  - `expr` 模式可以匹配任何有效的 Rust 表达式。
  - 它用于捕获更复杂的代码结构，比如函数调用、算术运算、条件表达式等。
  - 在宏的替换文本中，捕获的表达式可以直接使用，或者通过其他宏规则进一步处理。

### 示例

```rust
// 定义一个简单的宏，使用 ident 和 expr
macro_rules! create_function {
    ($name:ident -> $ret_type:ty { $body:expr }) => {
        fn $name() -> $ret_type {
            $body
        }
    };
}

// 使用宏创建一个函数
create_function!(square -> i32 { (3 * 3) });
```

在这个例子中：
- `$name:ident` 捕获了标识符 `square`。
- `-> $ret_type:ty` 捕获了返回类型 `i32`。
- `{ $body:expr }` 捕获了表达式 `(3 * 3)`。

宏展开后，生成的代码如下：

```rust
fn square() -> i32 {
    (3 * 3)
}
```

### 总结

- **`ident`** 用于匹配和生成标识符。
- **`expr`** 用于匹配和生成表达式。

了解这两种模式的区别对于编写灵活且强大的 Rust 宏至关重要。

在 Rust 的宏系统中，`ty` 和 `block` 是用于匹配特定类型的模式。它们分别用于类型和代码块的匹配。

### `ty` 模式

`ty` 模式用于匹配 Rust 中的类型。它捕获的是一个类型表达式，可以是简单类型，如 `i32`、`&str`，也可以是复杂类型，如 `Vec<T>` 或自定义类型。

**示例**：

```rust
macro_rules! type_of {
    ($val:expr) => {
        std::mem::discriminant(&$val)
    };
}

fn main() {
    type_of!(42); // 匹配类型 i32
    type_of!("hello"); // 匹配类型 &str
}
```

在这个例子中，宏 `type_of!` 使用 `expr` 模式来匹配任何表达式，并将其传递给 `std::mem::discriminant` 函数，该函数需要一个类型标识符作为参数。

### `block` 模式

`block` 模式用于匹配 Rust 中的代码块 `{}`。它捕获的是一个代码块表达式，可以包含任意多的语句。

**示例**：

```rust
macro_rules! block_example {
    ($block:block) => {
        {
            // 可以在这里处理 $block
            $block
        }
    };
}

fn main() {
    let result = block_example!({
        let x = 10;
        x + 2
    });
    println!("The result is: {}", result);
}
```

在这个例子中，宏 `block_example!` 使用 `block` 模式来匹配一个代码块，并将其作为参数传递。在宏的展开中，代码块被包含在一个新创建的代码块中，允许在其中执行一些初始化或最终处理。

### 注意事项

- `ty` 模式只能匹配类型，不能匹配值。
- `block` 模式匹配的是代码块，它可以包含任意多的语句。

使用这些模式可以帮助你编写更灵活的宏，以适应不同的代码结构和类型。

# mod超屌用法
```rust
// Used by generated code and doc tests. Not public API.
#[doc(hidden)]
#[path = "private/mod.rs"]
pub mod __private;

#[path = "de/seed.rs"]
mod seed;
```


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

# syn
神了我操，编译器开洞

```rust
#[macro_export]
macro_rules! Token {
    [abstract]    => { $crate::token::Abstract };
    [as]          => { $crate::token::As };
    [async]       => { $crate::token::Async };
    [auto]        => { $crate::token::Auto };
    [await]       => { $crate::token::Await };
    [become]      => { $crate::token::Become };
    [box]         => { $crate::token::Box };
    [break]       => { $crate::token::Break };
    [const]       => { $crate::token::Const };
    [continue]    => { $crate::token::Continue };
    [crate]       => { $crate::token::Crate };
    [default]     => { $crate::token::Default };
    [do]          => { $crate::token::Do };
    [dyn]         => { $crate::token::Dyn };
    [else]        => { $crate::token::Else };
    [enum]        => { $crate::token::Enum };
    [extern]      => { $crate::token::Extern };
    [final]       => { $crate::token::Final };
    [fn]          => { $crate::token::Fn };
    [for]         => { $crate::token::For };
    [if]          => { $crate::token::If };
    [impl]        => { $crate::token::Impl };
    [in]          => { $crate::token::In };
    [let]         => { $crate::token::Let };
    [loop]        => { $crate::token::Loop };
    [macro]       => { $crate::token::Macro };
    [match]       => { $crate::token::Match };
    [mod]         => { $crate::token::Mod };
    [move]        => { $crate::token::Move };
    [mut]         => { $crate::token::Mut };
    [override]    => { $crate::token::Override };
    [priv]        => { $crate::token::Priv };
    [pub]         => { $crate::token::Pub };
    [ref]         => { $crate::token::Ref };
    [return]      => { $crate::token::Return };
    [Self]        => { $crate::token::SelfType };
    [self]        => { $crate::token::SelfValue };
    [static]      => { $crate::token::Static };
    [struct]      => { $crate::token::Struct };
    [super]       => { $crate::token::Super };
    [trait]       => { $crate::token::Trait };
    [try]         => { $crate::token::Try };
    [type]        => { $crate::token::Type };
    [typeof]      => { $crate::token::Typeof };
    [union]       => { $crate::token::Union };
    [unsafe]      => { $crate::token::Unsafe };
    [unsized]     => { $crate::token::Unsized };
    [use]         => { $crate::token::Use };
    [virtual]     => { $crate::token::Virtual };
    [where]       => { $crate::token::Where };
    [while]       => { $crate::token::While };
    [yield]       => { $crate::token::Yield };
    [&]           => { $crate::token::And };
    [&&]          => { $crate::token::AndAnd };
    [&=]          => { $crate::token::AndEq };
    [@]           => { $crate::token::At };
    [^]           => { $crate::token::Caret };
    [^=]          => { $crate::token::CaretEq };
    [:]           => { $crate::token::Colon };
    [,]           => { $crate::token::Comma };
    [$]           => { $crate::token::Dollar };
    [.]           => { $crate::token::Dot };
    [..]          => { $crate::token::DotDot };
    [...]         => { $crate::token::DotDotDot };
    [..=]         => { $crate::token::DotDotEq };
    [=]           => { $crate::token::Eq };
    [==]          => { $crate::token::EqEq };
    [=>]          => { $crate::token::FatArrow };
    [>=]          => { $crate::token::Ge };
    [>]           => { $crate::token::Gt };
    [<-]          => { $crate::token::LArrow };
    [<=]          => { $crate::token::Le };
    [<]           => { $crate::token::Lt };
    [-]           => { $crate::token::Minus };
    [-=]          => { $crate::token::MinusEq };
    [!=]          => { $crate::token::Ne };
    [!]           => { $crate::token::Not };
    [|]           => { $crate::token::Or };
    [|=]          => { $crate::token::OrEq };
    [||]          => { $crate::token::OrOr };
    [::]          => { $crate::token::PathSep };
    [%]           => { $crate::token::Percent };
    [%=]          => { $crate::token::PercentEq };
    [+]           => { $crate::token::Plus };
    [+=]          => { $crate::token::PlusEq };
    [#]           => { $crate::token::Pound };
    [?]           => { $crate::token::Question };
    [->]          => { $crate::token::RArrow };
    [;]           => { $crate::token::Semi };
    [<<]          => { $crate::token::Shl };
    [<<=]         => { $crate::token::ShlEq };
    [>>]          => { $crate::token::Shr };
    [>>=]         => { $crate::token::ShrEq };
    [/]           => { $crate::token::Slash };
    [/=]          => { $crate::token::SlashEq };
    [*]           => { $crate::token::Star };
    [*=]          => { $crate::token::StarEq };
    [~]           => { $crate::token::Tilde };
    [_]           => { $crate::token::Underscore };
}
pub struct Match(pub Fragment);

impl ToTokens for Match {
    fn to_tokens(&self, out: &mut TokenStream) {
        match &self.0 {
            Fragment::Expr(expr) => {
                expr.to_tokens(out);
                <Token![,]>::default().to_tokens(out);
            }
            Fragment::Block(block) => {
                token::Brace::default().surround(out, |out| block.to_tokens(out));
            }
        }
    }
}
```

# quote!
字符流组合
```rust
pub fn pretend_used(cont: &Container, is_packed: bool) -> TokenStream {
    let pretend_fields = pretend_fields_used(cont, is_packed);
    let pretend_variants = pretend_variants_used(cont);

    quote! {
        #pretend_fields
        #pretend_variants
    }
}
```

# 高级特性PhantomData

在 Rust 中，`PhantomData` 是一个特殊的类型，用于指示一个泛型类型与其泛型参数之间的“使用”关系，即使这些泛型参数在类型定义中没有直接出现。`PhantomData` 主要用于解决 Rust 的类型系统和内存安全保证中的一些特定问题，特别是在空泛型参数（zero-sized types，ZSTs）和多态类型（如 trait 对象）中。

### 作用

1. **避免空泛型参数的警告**：
   当一个泛型类型参数没有被使用时，Rust 编译器会发出警告。`PhantomData` 可以用来告诉编译器这个类型参数实际上是被“使用”的。

2. **保持类型信息**：
   在某些情况下，你可能需要在运行时保留类型信息，即使该类型参数不直接参与数据的存储。`PhantomData` 可以用来保持这种类型信息。

3. **实现多态**：
   在使用 trait 对象时，`PhantomData` 可以用来指示 trait 与特定实现类型之间的关系。

### 示例

假设我们有一个泛型结构体 `Wrapper`，它不直接存储其泛型参数 `T`，但我们需要保留 `T` 的类型信息：

```rust
use std::marker::PhantomData;

struct Wrapper<T> {
    marker: PhantomData<T>,
}

fn main() {
    let w = Wrapper { marker: PhantomData };
}
```

在这个例子中，`Wrapper` 结构体包含一个 `PhantomData` 字段，用于指示它与泛型参数 `T` 的关系。这样，即使 `T` 不直接参与数据存储，编译器也会知道 `Wrapper` 依赖于 `T`。

### 注意事项

- **不增加内存使用**：
  `PhantomData` 本身不占用任何内存空间，它只是一个编译时的标记。

- **不提供运行时检查**：
  `PhantomData` 只是一个编译时的提示，它不会在运行时提供任何类型的检查或保证。

- **可能影响类型推断**：
  使用 `PhantomData` 可能会影响 Rust 的类型推断机制，因此在某些情况下需要小心使用。

`PhantomData` 是 Rust 类型系统的一个高级特性，它在处理复杂的泛型代码时非常有用，但也需要谨慎使用，以避免引入潜在的错误。


# Trait定义在Mod里
```rust
pub trait SeqAccess<'de> {
    /// The error type that can be returned if some error occurs during
    /// deserialization.
    type Error: Error;

    /// This returns `Ok(Some(value))` for the next value in the sequence, or
    /// `Ok(None)` if there are no more remaining items.
    ///
    /// `Deserialize` implementations should typically use
    /// `SeqAccess::next_element` instead.
    fn next_element_seed<T>(&mut self, seed: T) -> Result<Option<T::Value>, Self::Error>
    where
        T: DeserializeSeed<'de>;

    /// This returns `Ok(Some(value))` for the next value in the sequence, or
    /// `Ok(None)` if there are no more remaining items.
    ///
    /// This method exists as a convenience for `Deserialize` implementations.
    /// `SeqAccess` implementations should not override the default behavior.
    #[inline]
    fn next_element<T>(&mut self) -> Result<Option<T>, Self::Error>
    where
        T: Deserialize<'de>,
    {
        self.next_element_seed(PhantomData)
    }

    /// Returns the number of elements remaining in the sequence, if known.
    #[inline]
    fn size_hint(&self) -> Option<usize> {
        None
    }
}

impl<'de, 'a, A> SeqAccess<'de> for &'a mut A
where
    A: ?Sized + SeqAccess<'de>,
{
    type Error = A::Error;

    #[inline]
    fn next_element_seed<T>(&mut self, seed: T) -> Result<Option<T::Value>, Self::Error>
    where
        T: DeserializeSeed<'de>,
    {
        (**self).next_element_seed(seed)
    }

    #[inline]
    fn next_element<T>(&mut self) -> Result<Option<T>, Self::Error>
    where
        T: Deserialize<'de>,
    {
        (**self).next_element()
    }

    #[inline]
    fn size_hint(&self) -> Option<usize> {
        (**self).size_hint()
    }
}
```

## WTF
serde.lib.rs line 289
```rust
// None of this crate's error handling needs the `From::from` error conversion
// performed implicitly by the `?` operator or the standard library's `try!`
// macro. This simplified macro gives a 5.5% improvement in compile time
// compared to standard `try!`, and 9% improvement compared to `?`.
macro_rules! tri {
    ($expr:expr) => {
        match $expr {
            Ok(val) => val,
            Err(err) => return Err(err),
        }
    };
}
```

## DONT UNDERSANTAND
这些属性宏用于控制 Rust 宏的导出行为和文档的可见性。下面是每行代码的作用：

1. `#[macro_export(local_inner_macros)]`
   - 这是一个属性宏，用于导出宏定义，使其在其他 crate 中可用。
   - `local_inner_macros` 是 `macro_export` 属性的一个选项，它允许宏在导出时能够访问当前模块中的内部宏。

2. `#[doc(hidden)]`
   - 这是一个属性宏，用于指示该宏在生成的文档中应该是隐藏的。
   - 当你不希望某个宏出现在文档中时，可以使用这个属性宏。

3. `#[macro_export]`
   - 这是另一个 `macro_export` 属性宏，同样用于导出宏定义。

4. `#[macro_export(local_inner_macros)]`
   - 这行代码与第一行相同，再次强调了宏的导出行为。

### 示例

假设你有以下宏定义：

```rust
// 在 lib.rs 或 main.rs 中
#[macro_export(local_inner_macros)]
#[doc(hidden)]
macro_rules! my_macro {
    () => {
        println!("Hello from macro!");
    };
}

#[macro_export]
#[macro_export(local_inner_macros)]
macro_rules! another_macro {
    () => {
        println!("Hello from another macro!");
    };
}
```

在这个例子中：
- `my_macro!` 宏被导出，并且可以在其他 crate 中使用。同时，它被标记为隐藏，不会出现在生成的文档中。
- `another_macro!` 宏也被导出，并且可以访问当前模块中的内部宏。

### 注意事项

- `#[macro_export(local_inner_macros)]` 属性宏的使用需要 Rust 1.56 版本或更高。
- 如果你多次使用相同的属性宏，只有最后一次会生效。所以在这个例子中，`another_macro!` 的 `#[macro_export]` 属性宏是多余的，因为后面的 `#[macro_export(local_inner_macros)]` 已经覆盖了它。

这些属性宏的使用可以帮助你更好地控制宏的可见性和导出行为。
