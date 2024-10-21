---
sidebar_position: 8
sidebar_label: 💩过程宏 proc macros
sidebar_class_name: green
---

# 过程宏

## proc_macro和macro_rules!的区别
在 Rust 中，`proc_macro` 和 `macro_rules!` 是两种不同类型的宏系统，它们在功能和用途上有所区别：

### `macro_rules!`

- **定义宏的方式**：`macro_rules!` 是一种声明式宏系统，允许你定义一系列的模式和匹配这些模式的替换代码。它基于模式匹配来实现宏的行为。
- **编译时执行**：`macro_rules!` 宏在编译时展开，它们的执行结果将直接替换宏调用的位置。
- **易于理解和使用**：对于大多数简单的宏，`macro_rules!` 提供了一种相对简单和直观的方式来定义宏。
- **适用场景**：适合定义通用的、复杂的宏，如条件编译、循环、迭代等。

### `proc_macro`

- **定义宏的方式**：`proc_macro` 是一种功能更强大的过程宏系统，允许你编写更复杂的宏，这些宏可以访问和修改 Rust 代码的抽象语法树（AST）。
- **单独的 Crate**：`proc_macro` 定义在单独的 crate 中，并且需要使用 `proc_macro` 作为 crate 类型来构建。
- **动态执行**：与 `macro_rules!` 不同，`proc_macro` 宏不是在每个调用点静态展开的，而是作为一个单独的过程运行，可以动态地生成代码。
- **依赖外部库**：通常需要使用外部库，如 `syn` 来解析 Rust 代码，`quote` 来生成代码，`proc_macro2` 来处理 token streams。
- **适用场景**：适合定义需要深入分析和转换代码的宏，如外部衍生的 trait 实现（derive macros）、复杂代码生成等。

### 示例

- **`macro_rules!` 示例**：

```rust
macro_rules! vec_to_string {
    ($v:expr) => {
        $v.iter().map(|i| i.to_string()).collect::<String>()
    };
}

fn main() {
    let v = vec![1, 2, 3];
    let s = vec_to_string!(v);
    println!("{}", s); // 输出: 123
}
```

- **`proc_macro` 示例**：

```rust
// 在一个单独的 proc-macro crate 中
#[proc_macro_derive(ToLower)]
pub fn to_lower(input: TokenStream) -> TokenStream {
    // 使用 syn 和 quote 等库解析和生成代码
}

// 在使用该宏的 crate 中
use to_lower_derive::ToLower;

#[derive(ToLower)]
struct MyStruct;

fn main() {
    let my_struct = MyStruct{};
    // 自动实现 to_lower 方法
}
```

### 总结

- **`macro_rules!`** 是一种简单、声明式的宏系统，适合大多数简单的宏定义。
- **`proc_macro`** 是一种更复杂、功能更强大的宏系统，适合需要深入代码分析和生成的场景。

选择哪种宏系统取决于你的具体需求和宏的复杂性。


## serde/src/de/impls.rs line 989
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



## syn神了我操，编译器开洞


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

## quote!
字符流组合，合并函数
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

## 真实案例

### tauri/tao
:::info[tao/tao-macros/src/lib.rs, line 190]
```rust
#[proc_macro]
pub fn android_fn(tokens: TokenStream) -> TokenStream {
  let tokens = parse_macro_input!(tokens as AndroidFnInput);
  let AndroidFnInput {
    domain,
    package,
    class,
    function,
    ret,
    args,
    non_jni_args,
    function_before,
  } = tokens;

  let domain = domain.to_string();
  let package = package.to_string().replace('_', "_1");
  let class = class.to_string();
  let args = args
    .into_iter()
    .enumerate()
    .map(|(i, t)| IdentArgPair(format_ident!("a_{}", i), t))
    .collect::<Vec<_>>();
  let non_jni_args = non_jni_args.into_iter().collect::<Vec<_>>();

  let java_fn_name = format_ident!(
    "Java_{domain}_{package}_{class}_{function}",
    domain = domain,
    package = package,
    class = class,
    function = function,
  );

  let args_ = args.iter().map(|a| &a.0);

  let ret = if let Some(ret) = ret {
    syn::ReturnType::Type(
      syn::token::RArrow(proc_macro2::Span::call_site()),
      Box::new(ret),
    )
  } else {
    syn::ReturnType::Default
  };

  let comma_before_non_jni_args = if non_jni_args.is_empty() {
    None
  } else {
    Some(syn::token::Comma(proc_macro2::Span::call_site()))
  };

  quote! {
    #[no_mangle]
    unsafe extern "C" fn #java_fn_name<'local>(
      env: JNIEnv<'local>,
      class: JClass<'local>,
      #(#args),*
    )  #ret {
      #function_before();
      #function(env, class, #(#args_),*  #comma_before_non_jni_args #(#non_jni_args),*)
    }

  }
  .into()
}
```
这段代码是一个 Rust 的过程宏，用于生成 Android Native Interface (JNI) 函数的 Rust 绑定。过程宏在 Rust 中是一类强大的宏，可以在编译时对代码进行分析和生成新的代码。这个特定的宏 `android_fn` 接受特定的输入并生成 JNI 函数的 Rust 代码。让我们逐步分析这段代码：

### 属性和函数签名

```rust
#[proc_macro]
pub fn android_fn(tokens: TokenStream) -> TokenStream {
```
- `#[proc_macro]`: 这个属性表明 `android_fn` 是一个过程宏，具体来说是用于处理过程宏的输入。
- `pub fn android_fn(tokens: TokenStream) -> TokenStream`: 函数接收并返回 `TokenStream`，这是 Rust 宏的输入和输出类型。

### 解析输入

```rust
let tokens = parse_macro_input!(tokens as AndroidFnInput);
```
- 使用 `parse_macro_input!` 宏解析输入的 `TokenStream` 为 `AndroidFnInput` 结构体，这个结构体应该由开发者定义，用于存储解析后的输入数据。

### 分解结构体

```rust
let AndroidFnInput {
    domain,
    package,
    class,
    function,
    ret,
    args,
    non_jni_args,
    function_before,
} = tokens;
```
- 分解 `AndroidFnInput` 结构体为多个部分，包括域、包、类、函数名、返回类型、参数、非 JNI 参数和函数执行前的代码。

### 处理标识符和参数

```rust
let domain = domain.to_string();
let package = package.to_string().replace('_', "_1");
let class = class.to_string();
let args = args
    .into_iter()
    .enumerate()
    .map(|(i, t)| IdentArgPair(format_ident!("a_{}", i), t))
    .collect::<Vec<_>>();
let non_jni_args = non_jni_args.into_iter().collect::<Vec<_>>();
```
- 将域、包和类转换为字符串。
- 参数被转换并编号，生成新的标识符。

### 生成 JNI 函数名

```rust
let java_fn_name = format_ident!(
    "Java_{domain}_{package}_{class}_{function}",
    domain = domain,
    package = package,
    class = class,
    function = function,
);
```
- 使用 `format_ident!` 宏生成 JNI 函数的名称。

### 处理返回类型

```rust
let ret = if let Some(ret) = ret {
    syn::ReturnType::Type(
      syn::token::RArrow(proc_macro2::Span::call_site()),
      Box::new(ret),
    )
  } else {
    syn::ReturnType::Default
  };
```
- 根据是否有返回类型生成相应的返回类型表达式。

### 生成代码

```rust
quote! {
    #[no_mangle]
    unsafe extern "C" fn #java_fn_name<'local>(
      env: JNIEnv<'local>,
      class: JClass<'local>,
      #(#args),*
    )  #ret {
      #function_before();
      #function(env, class, #(#args_),*  #comma_before_non_jni_args #(#non_jni_args),*)
    }
}
```
- 使用 `quote!` 宏生成 JNI 函数的完整定义，包括函数属性、签名、参数和函数体。

### 返回生成的代码

```rust
.into()
```
- 将生成的 `TokenStream` 返回。

### 总结

这个宏 `android_fn` 用于生成 JNI 函数的 Rust 绑定，使得 Rust 代码可以与 Java 代码互操作。它处理输入参数，生成适当的 JNI 函数名和函数体，并确保所有参数和返回类型正确处理。这是 Rust 生态中与 JNI 互操作的常见模式。

:::