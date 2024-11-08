"use strict";(self.webpackChunkjabberwocky238_github_io=self.webpackChunkjabberwocky238_github_io||[]).push([[2056],{1448:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>u,frontMatter:()=>s,metadata:()=>a,toc:()=>d});var t=r(4848),i=r(8453);const s={sidebar_position:3,sidebar_label:"\u7f16\u7801\u4e60\u60ef Coding Style"},o="\u7f16\u7801\u4e60\u60ef Coding Style",a={id:"Coding_Style",title:"\u7f16\u7801\u4e60\u60ef Coding Style",description:"(serde)trait \u5199\u5728mod.rs\u91cc\u9762\uff0c\u5176\u4ed6\u6587\u4ef6\u8d1f\u8d23impl",source:"@site/docs/rust/03-Coding_Style.md",sourceDirName:".",slug:"/Coding_Style",permalink:"/rust/Coding_Style",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3,sidebar_label:"\u7f16\u7801\u4e60\u60ef Coding Style"},sidebar:"tutorialSidebar",previous:{title:"Cargo.toml",permalink:"/rust/Cargo.toml"},next:{title:"\u5185\u7f6e\u5b8f",permalink:"/rust/builtin_macros"}},l={},d=[{value:"(serde)trait \u5199\u5728mod.rs\u91cc\u9762\uff0c\u5176\u4ed6\u6587\u4ef6\u8d1f\u8d23impl",id:"serdetrait-\u5199\u5728modrs\u91cc\u9762\u5176\u4ed6\u6587\u4ef6\u8d1f\u8d23impl",level:2},{value:"(tao)\u5199 CHANGELOG.md",id:"tao\u5199-changelogmd",level:2}];function c(e){const n={code:"code",h1:"h1",h2:"h2",header:"header",pre:"pre",...(0,i.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"\u7f16\u7801\u4e60\u60ef-coding-style",children:"\u7f16\u7801\u4e60\u60ef Coding Style"})}),"\n",(0,t.jsx)(n.h2,{id:"serdetrait-\u5199\u5728modrs\u91cc\u9762\u5176\u4ed6\u6587\u4ef6\u8d1f\u8d23impl",children:"(serde)trait \u5199\u5728mod.rs\u91cc\u9762\uff0c\u5176\u4ed6\u6587\u4ef6\u8d1f\u8d23impl"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-rust",children:"pub trait SeqAccess<'de> {\r\n    /// The error type that can be returned if some error occurs during\r\n    /// deserialization.\r\n    type Error: Error;\r\n\r\n    /// This returns `Ok(Some(value))` for the next value in the sequence, or\r\n    /// `Ok(None)` if there are no more remaining items.\r\n    ///\r\n    /// `Deserialize` implementations should typically use\r\n    /// `SeqAccess::next_element` instead.\r\n    fn next_element_seed<T>(&mut self, seed: T) -> Result<Option<T::Value>, Self::Error>\r\n    where\r\n        T: DeserializeSeed<'de>;\r\n\r\n    /// This returns `Ok(Some(value))` for the next value in the sequence, or\r\n    /// `Ok(None)` if there are no more remaining items.\r\n    ///\r\n    /// This method exists as a convenience for `Deserialize` implementations.\r\n    /// `SeqAccess` implementations should not override the default behavior.\r\n    #[inline]\r\n    fn next_element<T>(&mut self) -> Result<Option<T>, Self::Error>\r\n    where\r\n        T: Deserialize<'de>,\r\n    {\r\n        self.next_element_seed(PhantomData)\r\n    }\r\n\r\n    /// Returns the number of elements remaining in the sequence, if known.\r\n    #[inline]\r\n    fn size_hint(&self) -> Option<usize> {\r\n        None\r\n    }\r\n}\r\n\r\nimpl<'de, 'a, A> SeqAccess<'de> for &'a mut A\r\nwhere\r\n    A: ?Sized + SeqAccess<'de>,\r\n{\r\n    type Error = A::Error;\r\n\r\n    #[inline]\r\n    fn next_element_seed<T>(&mut self, seed: T) -> Result<Option<T::Value>, Self::Error>\r\n    where\r\n        T: DeserializeSeed<'de>,\r\n    {\r\n        (**self).next_element_seed(seed)\r\n    }\r\n\r\n    #[inline]\r\n    fn next_element<T>(&mut self) -> Result<Option<T>, Self::Error>\r\n    where\r\n        T: Deserialize<'de>,\r\n    {\r\n        (**self).next_element()\r\n    }\r\n\r\n    #[inline]\r\n    fn size_hint(&self) -> Option<usize> {\r\n        (**self).size_hint()\r\n    }\r\n}\n"})}),"\n",(0,t.jsx)(n.h2,{id:"tao\u5199-changelogmd",children:"(tao)\u5199 CHANGELOG.md"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-md",children:'# Changelog\r\n\r\n## \\[0.1.3]\r\n\r\n- [`4cd53415`](https://github.com/tauri-apps/tao/commit/4cd534151a2d7a14ade906f960ec02655a91feae) ([#964](https://github.com/tauri-apps/tao/pull/964) by [@lucasfernog](https://github.com/tauri-apps/tao/../../lucasfernog)) Allow Android domain names to include `_1` as escaped `_` characters - required because `_` is the separator for domain parts.\r\n\r\n## \\[0.1.2]\r\n\r\n- [`b7758314`](https://github.com/tauri-apps/tao/commit/b7758314abf8c6916c865d9b31eea5bd17b2fe16)([#780](https://github.com/tauri-apps/tao/pull/780)) Added support to lifetime parameters on `android_fn`.\r\n\r\n## \\[0.1.1]\r\n\r\n- Fix passing empty array for args in `android_fn!` macro\r\n- [666235b0](https://github.com/tauri-apps/tao/commit/666235b0e1fce0ca286c194aa75422021a6f0c4b) fix(tao-macros): fix using android_fn! with 0 jni args ([#688](https://github.com/tauri-apps/tao/pull/688)) on 2023-02-07\r\n\r\n## \\[0.1.0]\r\n\r\n- Publish tao-macro v0.1.0\r\n- [3cd851d1](https://github.com/tauri-apps/tao/commit/3cd851d14126c305964b957eeb4f9ed0011d96cb) Revert "Publish New Versions" ([#663](https://github.com/tauri-apps/tao/pull/663)) on 2023-01-09\r\n\n'})})]})}function u(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},8453:(e,n,r)=>{r.d(n,{R:()=>o,x:()=>a});var t=r(6540);const i={},s=t.createContext(i);function o(e){const n=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),t.createElement(s.Provider,{value:n},e.children)}}}]);