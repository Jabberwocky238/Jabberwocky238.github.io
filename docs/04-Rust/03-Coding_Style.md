---
sidebar_position: 3
sidebar_label: 编码习惯 Coding Style
---

# 编码习惯 Coding Style

## (serde)trait 写在mod.rs里面，其他文件负责impl
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
## (tao)写 CHANGELOG.md
    ```md
    # Changelog

    ## \[0.1.3]

    - [`4cd53415`](https://github.com/tauri-apps/tao/commit/4cd534151a2d7a14ade906f960ec02655a91feae) ([#964](https://github.com/tauri-apps/tao/pull/964) by [@lucasfernog](https://github.com/tauri-apps/tao/../../lucasfernog)) Allow Android domain names to include `_1` as escaped `_` characters - required because `_` is the separator for domain parts.

    ## \[0.1.2]

    - [`b7758314`](https://github.com/tauri-apps/tao/commit/b7758314abf8c6916c865d9b31eea5bd17b2fe16)([#780](https://github.com/tauri-apps/tao/pull/780)) Added support to lifetime parameters on `android_fn`.

    ## \[0.1.1]

    - Fix passing empty array for args in `android_fn!` macro
    - [666235b0](https://github.com/tauri-apps/tao/commit/666235b0e1fce0ca286c194aa75422021a6f0c4b) fix(tao-macros): fix using android_fn! with 0 jni args ([#688](https://github.com/tauri-apps/tao/pull/688)) on 2023-02-07

    ## \[0.1.0]

    - Publish tao-macro v0.1.0
    - [3cd851d1](https://github.com/tauri-apps/tao/commit/3cd851d14126c305964b957eeb4f9ed0011d96cb) Revert "Publish New Versions" ([#663](https://github.com/tauri-apps/tao/pull/663)) on 2023-01-09

    ```