"use strict";(self.webpackChunkjabberwocky238_github_io=self.webpackChunkjabberwocky238_github_io||[]).push([[7002],{6568:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>p,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var r=n(4848),o=n(8453);const a={authors:["jabberwocky238"],tags:["zh","tech","golden"],keywords:["VPN","DNS","WireGuard","OpenVPN","bind9","named","frp","\u5185\u7f51\u7a7f\u900f","\u5185\u7f51\u4e92\u8054","\u57df\u540d","\u7aef\u53e3\u8f6c\u53d1","\u7ec4\u7f51"],last_update:{date:new Date("2024-11-04T02:40:00.000Z")}},i="\u81ea\u5efaVPN+DNS\u5b9e\u73b0\u5185\u7f51\u7a7f\u900f\u548c\u7ec4\u7f51",s={permalink:"/blog/2024/10/27/setting-your-own-vpn",source:"@site/blog/2024-10-27-setting-your-own-vpn/index.md",title:"\u81ea\u5efaVPN+DNS\u5b9e\u73b0\u5185\u7f51\u7a7f\u900f\u548c\u7ec4\u7f51",description:"MDX\u7248\u672c\u6587\u7ae0\u66f4\u597d\u770b\uff0c\u8f6c\u8f7d\u4e8e\u77e5\u4e4e",date:"2024-10-27T00:00:00.000Z",tags:[{inline:!1,label:"zh",permalink:"/blog/tags/zh",description:"Blogs Written In Chinese"},{inline:!1,label:"tech",permalink:"/blog/tags/tech",description:"All technical blogs"},{inline:!1,label:"golden",permalink:"/blog/tags/golden",description:"Very good blogs, worth reading again and again"}],hasTruncateMarker:!0,authors:[{name:"jabberwocky238",title:"WTF",url:"https://github.com/jabberwocky238",page:null,socials:{github:"https://github.com/jabberwocky238"},imageURL:"/jw238_avatar.png",key:"jabberwocky238"}],frontMatter:{authors:["jabberwocky238"],tags:["zh","tech","golden"],keywords:["VPN","DNS","WireGuard","OpenVPN","bind9","named","frp","\u5185\u7f51\u7a7f\u900f","\u5185\u7f51\u4e92\u8054","\u57df\u540d","\u7aef\u53e3\u8f6c\u53d1","\u7ec4\u7f51"],last_update:{date:"2024-11-04T02:40:00.000Z"}},unlisted:!1,lastUpdatedAt:1730688e6,lastUpdatedBy:"jabberwocky238",prevItem:{title:"trojan\u4f7f\u7528\u8bb0\u5f55",permalink:"/blog/2024/11/01/trojan-gfw"},nextItem:{title:"rust\u4e2d\u53d8\u6362\u9012\u5f52\u4e3a\u5faa\u73af\u7684\u5fc5\u8981\u6027",permalink:"/blog/2024/10/07/Recursive-and-Loop-rust"}},l={authorsImageUrls:[void 0]},c=[];function d(e){const t={a:"a",admonition:"admonition",p:"p",strong:"strong",...(0,o.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.a,{href:"https://jw238.site/blog/2024/10/27/setting-your-own-vpn",children:"MDX\u7248\u672c\u6587\u7ae0"}),"\u66f4\u597d\u770b\uff0c\u8f6c\u8f7d\u4e8e",(0,r.jsx)(t.a,{href:"https://zhuanlan.zhihu.com/p/3446441267",children:"\u77e5\u4e4e"})]}),"\n",(0,r.jsx)(t.admonition,{type:"tip",children:(0,r.jsxs)(t.p,{children:["\u5982\u679c\u4f60\u53ea\u60f3\u8981\u5185\u7f51\u7a7f\u900f\uff0c\u76f4\u63a5\u770b ",(0,r.jsx)(t.strong,{children:(0,r.jsx)(t.a,{href:"/blog/2024/10/27/setting-your-own-vpn#%E4%B8%80%E5%89%8D%E6%83%85%E6%8F%90%E8%A6%81",children:"\u524d\u60c5\u63d0\u8981"})})," \u91cc\u7684 ",(0,r.jsxs)(t.strong,{children:[(0,r.jsx)(t.a,{href:"https://github.com/fatedier/frp",children:"Frp"}),"\u5185\u7f51\u7a7f\u900f"]})," \u90e8\u5206\u5373\u53ef\uff0c\u5982\u679c\u4f60\u60f3\u8981\u7ec4\u7f51\uff0c\u53ef\u4ee5\u53ea\u770b ",(0,r.jsx)(t.strong,{children:(0,r.jsx)(t.a,{href:"/blog/2024/10/27/setting-your-own-vpn#%E4%B8%89wireguard",children:"WireGuard"})})," \u90e8\u5206\u3002"]})}),"\n",(0,r.jsx)(t.p,{children:"\u672c\u7bc7\u6587\u7ae0\u6d89\u53ca\u4e86\u81ea\u7ec4\u7f51\uff0cVPN\uff0c\u5185\u7f51\u7a7f\u900f\uff0c\u5185\u7f51\u8bbe\u5907\u4e92\u8054\uff0c\u81ea\u5b9a\u4e49\u57df\u540d\u89e3\u6790\uff0c\u7aef\u53e3\u8f6c\u53d1\u7b49\u5185\u5bb9\u3002"})]})}function p(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>i,x:()=>s});var r=n(6540);const o={},a=r.createContext(o);function i(e){const t=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),r.createElement(a.Provider,{value:t},e.children)}}}]);