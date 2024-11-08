---
sidebar_position: 9
sidebar_label: 属性宏(attribute macros)
sidebar_class_name: green
---

# 属性宏
用于配置编译器的行为或者提供元数据。

`#![doc]`和`#[doc]`的区别：

- `#![doc]` 是一个 crate 属性宏，它用于配置整个 crate 的文档生成行为。例如，你可以使用 `#![doc(html_root_url = "https://docs.rs/nalgebra/0.25.0")]` 来指定生成的文档的根 URL。
- `#[doc]` 是一个项属性宏，它用于配置单个项（例如函数、结构体、枚举等）的文档生成行为。例如，你可以使用 `#[doc(hidden)]` 来隐藏某个项的文档。

## #![doc]

### #![doc(html_root_url)]
### #![doc(html_favicon_url)]
这是一个文档属性宏，它告诉 Rust 文档生成器在生成文档时，将 Serde 类型链接到指定的 URL。这意味着当其他 crate 的文档中引用了 Serde 类型时，它们会被链接到这个 URL 上的相应文档页面。

:::info[nalgebra/src/lib.rs, line 92]
```rust
#![doc(
   html_favicon_url = "https://nalgebra.org/img/favicon.ico",
   html_root_url = "https://docs.rs/nalgebra/0.25.0"
)]
```
:::
### #![doc(no_inline)]
   `#![doc(no_inline)]`是 Rust 语言中的一个属性宏，用于控制文档生成时的行为。具体来说，这个属性宏的作用是：

   - **阻止内联文档**：当这个属性宏应用于一个函数、结构体、枚举、模块或其他项时，它会阻止 Rust 的文档生成工具 `rustdoc` 将该项的文档注释内联到引用它的地方。默认情况下，`rustdoc` 会将文档注释从源代码的位置复制到引用该项的每个地方。使用 `#[doc(no_inline)]` 可以覆盖这个默认行为。

   这个属性通常用于以下情况：

   1. **避免重复文档**：如果你不希望某个项的文档注释在文档中的多个地方重复出现，你可以使用 `#[doc(no_inline)]` 来防止这种情况。

   2. **集中文档**：有时候，你可能希望所有的文档都在一个地方，而不是分散在多个引用点。使用这个属性宏可以确保文档只在一个地方生成，从而更容易维护。

   
   #### 示例
   假设你有以下代码：

   ```rust
   /// 文档注释
   #[doc(no_inline)]
   pub fn my_function() {
      // 函数实现
   }
   ```

   在这个例子中，`my_function` 的文档注释不会被 `rustdoc` 内联到引用 `my_function` 的地方。这意味着无论在文档的哪个地方引用了 `my_function`，都不会显示这个函数的文档注释，除非你直接查看 `my_function` 的文档页面。使用 `#[doc(no_inline)]` 可以帮助你更精细地控制文档的布局和内容。

### #[doc(hidden)]
   - 这是一个属性宏，用于指示该宏在生成的文档中应该是隐藏的。
   - 当你不希望某个宏出现在文档中时，可以使用这个属性宏。

   ```rust
   // Used by generated code and doc tests. Not public API.
   #[doc(hidden)]
   #[path = "private/mod.rs"]
   pub mod __private;
   ```
## #![cfg_attr]
2. `#![cfg_attr(not(feature = "std"), no_std)]`
   这个属性宏用于条件编译。`cfg_attr` 宏检查是否没有启用 `std` 特性（通过 `feature = "std"` 指定）。如果没有启用 `std` 特性，那么 `no_std` 属性会被应用，允许 crate 在不依赖标准库的情况下编译。这对于编写可以用于嵌入式系统或其他不包含标准库的环境中的代码非常有用。

3. `#![cfg_attr(docsrs, feature(doc_cfg, rustdoc_internals))]`
   这个属性宏用于在生成文档时启用特定的 Rust 编译器特性。`cfg_attr` 宏检查是否在 `docsrs` 环境下（通常用于文档生成），如果是，则启用 `doc_cfg` 和 `rustdoc_internals` 特性。`doc_cfg` 允许在文档中使用条件编译属性，而 `rustdoc_internals` 启用了一些 Rust 文档工具的内部特性。

4. `#![cfg_attr(docsrs, allow(internal_features)))`
   这个属性宏同样用于条件编译。它允许在 `docsrs` 环境下使用内部特性，这些特性通常不推荐在普通代码中使用，因为它们可能会在未来的 Rust 版本中改变。

这些属性宏通常用于库的 `lib.rs` 或 `main.rs` 文件的顶部，以配置库的编译和文档生成行为。

```rust
#[cfg_attr(
    not(no_diagnostic_namespace),
    diagnostic::on_unimplemented(
        note = "for local types consider adding `#[derive(serde::Deserialize)]` to your `{Self}` type",
        note = "for types from other crates check whether the crate offers a `serde` feature flag",
    )
)]
```
这段代码是 Rust 语言中使用属性宏的一个例子，用于条件编译和自定义诊断信息。让我们逐行分析：

1. `#[cfg_attr(...)]`
   - `cfg_attr` 是 Rust 的一个属性宏，它允许开发者根据特定的编译时配置（feature flags）来包含或排除代码。如果括号内的条件为真，则包含该属性宏后面的代码；如果条件为假，则忽略它。

2. `not(no_diagnostic_namespace)`
   - 这是 `cfg_attr` 宏的条件部分。`not` 是一个检查特征（feature）是否没有被定义的条件。这里检查的是没有定义 `no_diagnostic_namespace` 特征。

3. `diagnostic::on_unimplemented(...)`
   - 如果上面的条件满足（即没有定义 `no_diagnostic_namespace` 特征），则应用 `diagnostic::on_unimplemented` 属性宏。这个宏用于在某个 trait 没有为特定类型实现时，提供一个自定义的错误或提示信息。

4. `note = "for local types consider adding `#[derive(serde::Deserialize)]` to your `{Self}` type",`
   - 这是 `diagnostic::on_unimplemented` 宏的一个参数，提供了一个备注信息。当一个类型没有实现某个 trait，并且这个 trait 是序列化相关的（如 `serde::Deserialize`），这个备注会提示开发者考虑为他们的类型添加 `#[derive(serde::Deserialize)]` 宏。

5. `note = "for types from other crates check whether the crate offers a `serde` feature flag",`
   - 这是另一个备注信息，用于提示开发者如果类型来自其他 crate，应该检查那个 crate 是否提供了一个 `serde` 特性标志（feature flag），这可能允许使用序列化功能。

综合来看，这段代码的作用是：

- 当没有定义 `no_diagnostic_namespace` 特征时，如果某个类型没有实现 `serde::Deserialize` trait，编译器会提供一个自定义的错误提示，指导开发者如何解决问题。

这种自定义的诊断信息非常有用，因为它可以提供更清晰的错误信息和解决问题的指导，从而改善开发者的体验。

## #![cfg]
1. `#[cfg(all(feature = "alloc", not(feature = "std")))]
   pub use alloc::borrow::{Cow, ToOwned};`
   - 这行代码使用 `cfg` 属性宏进行条件编译。`cfg` 宏允许开发者根据编译时的特征（features）来包含或排除代码。
   - `all` 函数用于确保所有列出的条件都必须为真，才能编译这段代码。
   - `feature = "alloc"` 检查是否启用了 `alloc` 特性。
   - `not(feature = "std")` 检查是否没有启用 `std` 特性。
   - 如果这两个条件都满足，那么 `Cow` 和 `ToOwned` 类型将从 `alloc::borrow` 模块中重新导出（pub use），使得它们可以在当前模块中直接使用。

2. `#[cfg(feature = "std")]
   pub use std::borrow::{Cow, ToOwned};`
   - 这行代码同样使用 `cfg` 属性宏进行条件编译。
   - `feature = "std"` 检查是否启用了 `std` 特性。
   - 如果启用了 `std` 特性，那么 `Cow` 和 `ToOwned` 类型将从 `std::borrow` 模块中重新导出。

这两段代码的目的是允许开发者根据是否启用了 `std` 特性来决定使用标准库的 `Cow` 和 `ToOwned` 类型，还是使用 `alloc` crate 提供的版本。`Cow`（Copy on Write）是一种智能指针，用于优化内存使用，而 `ToOwned` 是一个 trait，用于创建一个类型的所有权副本。

- 如果没有启用 `std` 特性，但启用了 `alloc` 特性，那么代码将使用 `alloc` crate 中的类型。
- 如果启用了 `std` 特性，那么代码将使用标准库中的类型。

这种条件编译的方式使得库可以在不同的环境下灵活使用，例如在嵌入式系统或 WebAssembly 中，可能不使用标准库，而是使用 `alloc` crate 来提供内存分配功能。

```rust
#[cfg(any(
   windows,
   target_os = "linux",
   target_os = "dragonfly",
   target_os = "freebsd",
   target_os = "netbsd",
   target_os = "openbsd",
   target_os = "macos",
))]
```

## #![deprecated]
```rust
#[deprecated(
   note = "The 'core' module is being renamed to 'base' to avoid conflicts with the 'core' crate."
)]
```

## #[macro]

### #[macro_use]
1. `#[macro_use]`
   - 这是一个属性宏，用于指定模块中的宏（macros）应该在当前作用域中可用。
   - 使用 `#[macro_use]` 属性宏，可以使得模块内的宏被自动导入到当前作用域中，而不需要显式地使用 `use` 语句。

2. `mod macros;`
   - 这是一个模块声明，它告诉 Rust 编译器有一个名为 `macros` 的模块。
   - `macros` 模块可能包含宏定义，这些宏定义在模块内部。

综合来看，这行代码的作用是：
- 声明一个名为 `macros` 的模块。
- 通过 `#[macro_use]` 属性宏，将 `macros` 模块中的宏自动导入到当前作用域中。

这样，你就可以在当前作用域中直接使用 `macros` 模块中定义的宏了。

#### 示例

假设你有以下代码结构：

```rust
// 在 lib.rs 或 main.rs 中
#[macro_use]
mod macros;

fn main() {
    my_macro!();
}
```

在这个例子中：
- `#[macro_use]` 属性宏使得 `macros` 模块中的宏自动导入到当前作用域。
- `mod macros;` 声明了一个名为 `macros` 的模块。
- 在 `main` 函数中，你可以直接使用 `my_macro!()` 宏，而不需要显式地使用 `use` 语句。

这样做的好处是简化了宏的导入过程，使得代码更加简洁。

### #[macro_export]
这些属性宏用于控制 Rust 宏的导出行为和文档的可见性。下面是每行代码的作用：

1. `#[macro_export(local_inner_macros)]`
   - 这是一个属性宏，用于导出宏定义，使其在其他 crate 中可用。
   - `local_inner_macros` 是 `macro_export` 属性的一个选项，它允许宏在导出时能够访问当前模块中的内部宏。
   
3. `#[macro_export]`
   - 这是另一个 `macro_export` 属性宏，同样用于导出宏定义。

4. `#[macro_export(local_inner_macros)]`
   - 这行代码与第一行相同，再次强调了宏的导出行为。

#### 示例

```rust
#[macro_export]
macro_rules! my_macro {
    () => {
        println!("Hello from macro!");
    };
}
```

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

#### 注意事项

- `#[macro_export(local_inner_macros)]` 属性宏的使用需要 Rust 1.56 版本或更高。
- 如果你多次使用相同的属性宏，只有最后一次会生效。所以在这个例子中，`another_macro!` 的 `#[macro_export]` 属性宏是多余的，因为后面的 `#[macro_export(local_inner_macros)]` 已经覆盖了它。

这些属性宏的使用可以帮助你更好地控制宏的可见性和导出行为。


## Built-in

### #[allow()] / #[warn()] / #![deny()]
这是一组共轭属性宏。

- `#[allow(dead_code)]`, 允许没有使用的代码
- unused_variables
- unused_macros

1. `#![deny(clippy::question_mark_used)]`
   - 这行代码使用 `deny` 属性宏来禁止使用 `clippy::question_mark_used` lint。Clippy 是 Rust 的一个代码检查工具，它帮助开发者写出更符合 Rust 社区习惯的代码。`clippy::question_mark_used` lint 检查代码中是否使用了 `?` 操作符。`?` 操作符用于错误传播，如果一个函数返回 `Result` 或 `Option` 类型，并且调用方想要立即处理错误，那么可以使用 `?` 来简化代码。使用 `deny` 属性宏禁止这个 lint 意味着如果代码中使用了 `?` 操作符，编译将会失败。

2. `#![deny(missing_docs, unused_imports)]`
   - 这行代码同样使用 `deny` 属性宏来禁止两个特定的 lint：`missing_docs` 和 `unused_imports`。
     - `missing_docs` lint 检查代码是否缺少文档注释。Rust 社区鼓励为公共 API 提供文档，这个 lint 确保所有的公共函数、结构体、枚举等都有文档注释。
     - `unused_imports` lint 检查代码中是否有未使用的导入（imports）。未使用的导入可能会使代码变得混乱，并且可能会引入不必要的依赖。


```rust
#![deny(
   missing_docs,
   nonstandard_style,
   unused_variables,
   unused_mut,
   unused_parens,
   rust_2018_idioms,
   rust_2018_compatibility,
   future_incompatible,
   missing_copy_implementations
)]
```

这段代码是 Rust 语言的属性宏 `#![deny(...)]` 的一个应用，它用于指定一组编译时的 lint 检查规则。这些规则会使得编译器在编译时对代码进行检查，如果代码违反了这些规则，编译器将会报错。下面是每个规则的解释：

1. **`missing_docs`**:
   - 检查公共接口是否缺少文档注释。

2. **`nonstandard_style`**:
   - 检查代码是否遵守 Rust 社区的命名和样式约定。

3. **`unused_variables`**:
   - 检查是否有声明了但没有使用的变量。

4. **`unused_mut`**:
   - 检查是否有声明为 `mut`（可变）但实际上没有被修改的变量。

5. **`unused_parens`**:
   - 检查是否有不必要的括号，这些括号不会影响代码的行为。

6. **`rust_2018_idioms`**:
   - 检查代码是否使用了 Rust 2018 edition 的惯用模式。

7. **`rust_2018_compatibility`**:
   - 检查代码是否与 Rust 2018 版兼容。

8. **`future_incompatible`**:
   - 检查代码中是否存在可能在未来版本的 Rust 中变得不兼容的用法。

9. **`missing_copy_implementations`**:
   - 检查是否缺少对 `Copy` trait 的实现。这通常用于提醒开发者为简单的数据类型实现 `Copy` trait，以便它们可以被隐式复制。

这些规则的目的是帮助开发者编写更高质量、更一致、更易于维护的代码。通过在编译时强制执行这些规则，可以减少潜在的错误和不一致性。

假设你有一个 Rust 源文件，其中包含以下代码：

```rust
/// This function does nothing.
fn do_nothing() {
    let _unused_variable = 42; // 违反了 unused_variables
}

fn main() {
    let mut mutable_variable = 1; // 违反了 unused_mut
}

fn add(a: i32, b: i32) {
    let result = (a + b); // 违反了 unused_parens
}
```

如果你在 `#![deny(...)]` 中包含了这些规则，编译器将会报错，指出 `_unused_variable`、`mutable_variable` 和多余的括号违反了相应的规则。

使用 `#![deny(...)]` 属性宏可以提高代码质量，确保代码遵循 Rust 社区的最佳实践和约定。这些规则有助于避免常见的编程错误和不一致性，使得代码更加健壮和可靠。


### #[inline]
在 Rust 语言中，`#[inline]` 是一个属性宏，用于向编译器提供内联函数的提示。内联函数是一种优化手段，它建议编译器在每次调用函数时将函数的代码直接插入到调用点，而不是进行常规的函数调用。这样做可以减少函数调用的开销，特别是对于小型函数来说，可以提高程序的执行效率。不过，编译器并不保证一定会按照这个提示进行内联，最终是否内联由编译器的优化策略决定。

#### 使用场景

1. **小型函数**：对于只有几行代码的小型函数，使用 `#[inline]` 可以减少函数调用的开销。

2. **递归函数**：对于递归函数，内联可以避免递归调用的开销。

3. **性能关键路径**：在性能敏感的代码路径上，内联可以减少函数调用的延迟。

#### 示例

```rust
#[inline]
fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    let result = add(2, 3);
    println!("The result is: {}", result);
}
```

在这个例子中，`add` 函数被标记为 `#[inline]`，建议编译器在每次调用 `add` 时将其内联。



#### 注意事项

- **滥用内联**：过度使用内联可能会导致代码膨胀，增加编译时间，甚至可能降低性能，因为编译器可能无法优化大块的内联代码。

- **编译器的决策**：即使使用了 `#[inline]`，编译器也可能因为各种原因（如代码大小、调用频率等）而选择不进行内联。

- **跨模块内联**：默认情况下，只能在定义函数的模块内进行内联。如果需要跨模块内联，可以使用 `#[inline(always)]` 强制编译器进行内联，但这通常不推荐，因为它会使得代码更难维护。


### #[path]
```rust
// Used by generated code and doc tests. Not public API.
#[doc(hidden)]
#[path = "private/mod.rs"]
pub mod __private;

#[path = "de/seed.rs"]
mod seed;
```

### #[must_use]
两种使用方法
```rust
#[must_use] 
#[must_use = "Did you mean to use inverse_mut()?"]
```
### #[non_exhaustive]

在 Rust 中，`#[non_exhaustive]` 是一个属性，用于指示一个类型（通常是枚举或结构体）的定义是不完整的，并且未来可能会添加更多的变体或字段，而不会破坏二进制兼容性。这个属性表明类型是“非穷尽的”（non-exhaustive），意味着你不能安全地使用 `match` 语句或模式匹配来覆盖所有的情况。`#[non_exhaustive]` 属性是在 Rust 1.53 版本中稳定下来的，所以需要至少这个版本的 Rust 来使用它。

#### 作用

1. **防止穷尽性检查**：
   - 当你在一个结构体或枚举上使用 `#[non_exhaustive]` 属性时，编译器会阻止你进行穷尽性检查。穷尽性检查是指编译器确保你的 `match` 语句覆盖了所有可能的枚举变体或结构体字段。

2. **未来兼容性**：
   - 如果你正在设计一个库，并且你希望在未来添加更多的变体或字段，但不想让这种添加影响现有用户的代码，你可以使用 `#[non_exhaustive]` 属性。这可以确保你的库的用户不会写依赖于类型完全穷尽的代码。

3. **保护模式匹配**：
   - 使用 `#[non_exhaustive]` 可以防止用户假设他们已经覆盖了所有的情况，从而避免未来添加新变体或字段时可能引入的错误。

```rust
#[non_exhaustive]
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
}

// 下面的代码将无法编译，因为 `Message` 是非穷尽的
//
// fn handle_message(msg: Message) {
//     match msg {
//         Message::Quit => {},
//         Message::Move { .. } => {},
//         Message::Write(_) => {},
//     }
// }
```

### #[repr]

#### #[repr(C)]
在 Rust 中，`#[repr(C)]` 是一个属性（attribute）用于指定一个类型（如结构体或枚举）的内存布局（representation）。`repr` 代表 "representation"，而 `C` 指的是 C 语言的内存布局。使用 `#[repr(C)]` 可以确保 Rust 类型的内存布局与 C 语言中的布局相匹配，这对于与 C 语言库进行接口（FFI - Foreign Function Interface）操作时非常重要。

#### #[repr(isize)]
#[repr(isize)] 是一个属性（attribute），用于指定一个类型（通常是枚举或结构体）的内存表示。repr 是 "representation" 的缩写，而 isize 指的是平台相关的整型大小（例如，在 32 位系统上是 32 位，在 64 位系统上是 64 位）。使用 #[repr(isize)] 可以确保类型的内存布局的大小与平台的 isize 类型大小相同。

#### #[repr(u8)]
保证在任何平台上都按照 u8 的对齐方式进行对齐。通常只用于无字段枚举。对于包含字段的枚举，通常使用 #[repr(C)] 来确保与 C 语言的兼容性。

#### #[repr(transparent)]
经常用于创建与 C 语言结构体或联合体（union）布局相同的 Rust 类型。意味着整个类型的布局和 ABI（应用程序二进制接口）与其中一个字段相同。
