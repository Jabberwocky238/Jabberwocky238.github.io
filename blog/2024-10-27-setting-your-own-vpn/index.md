---
authors: [jabberwocky238]
tags: 
  - zh
  - tech
  - golden
keywords:
  - VPN
  - DNS
  - WireGuard
  - OpenVPN
  - bind9
  - named
  - frp
  - 内网穿透
  - 内网互联
  - 域名
  - 端口转发
  - 组网
last_update: 
  date: 2024-11-04T02:40:00
---

# 自建VPN+DNS实现内网穿透和组网

[MDX版本文章](https://jw238.site/blog/2024/10/27/setting-your-own-vpn)更好看，转载于[知乎](https://zhuanlan.zhihu.com/p/3446441267)

:::tip
如果你只想要内网穿透，直接看 **[前情提要](/blog/2024/10/27/setting-your-own-vpn#一前情提要)** 里的 **[Frp](https://github.com/fatedier/frp)内网穿透** 部分即可，如果你想要组网，可以只看 **[WireGuard](/blog/2024/10/27/setting-your-own-vpn#三wireguard)** 部分。
:::

本篇文章涉及了自组网，VPN，内网穿透，内网设备互联，自定义域名解析，端口转发等内容。

<!-- truncate -->

## 一，前情提要

上次我听说VPN还是在做违法的事情的时候, 实际上VPN全称为“Virtual Private Network”, 是一种通过公共网络建立私密网络的技术。虽然这个词被大家乱用为翻过GFW的工具, 但细数现在流行的工具, 比如clash, v2ray, trojan, 他们的侧重点都在伪装。而纯血VPN只需要考虑加密, 这也是我这篇文章主要讨论的内容。

我自建VPN的初衷并不是翻GFW, 而是我自己搞了一个迷你主机, 类似nas, 但是侧重计算。我有两台云服务器, 以前玩MC剩下的, 但是很显然, 这两台云服务器垂垂老矣, 满足不了我的需求, 而且太贵了。**腾讯云, 你在吃人肉**(二改：腾讯云真便宜，阿里你在吃人肉)。

所以我借助两台云服务器自带的公网IP, 就想先做个frp内网穿透。当然, [frp](https://github.com/fatedier/frp)是非常简单的, 小学生水平, 你看两眼就能自己配出来。


```conf title="frps.toml" showLineNumbers
bindPort = 7000
```

```conf title="frpc.toml" showLineNumbers
serverAddr = "x.x.x.x"
serverPort = 7000

[[proxies]]
name = "mcs"
type = "tcp"
localIP = "127.0.0.1"
localPort = 23333
remotePort = 23333
```

这样两个文件直接就能把内网的mcsmanager管理平台透出来, 公网开个23333端口就行了。类似的操作, 暴露游戏25565端口也是易如反掌的, 透udp也只是改几个字的事。

但显然, 这样做会导致**很严重的安全问题**, 你管理平台是暴露在公网的, 别人随便点进来就能用, 很容易被搞。另外, 这是游戏服务器, 自己玩也就还好, 如果是企业级的需求呢？家庭需求呢？私密度更高的数据呢？于是我想到了我的校园网。

天津大学的校园网可以用easy connect连进VPN, 然后访问内网设施。我想的就是类似操作, 自己建一个VPN, 连进来才能访问mcs管理界面和其他东西。于是我开始沿着这一条路走到黑了。

## 二，OpenVPN

首先想到的是IPsec和PPTP, 因为这是AI告诉我的技术, 但是经过一番查找, 我发现那玩意已经过时了, 似乎也找不到一键启动的脚本, 于是我继续找, 找到了大名鼎鼎的[OpenVPN](https://github.com/OpenVPN/openvpn)。

这个玩意是典型的C/S架构, 理解起来不难, 就是配置比较有旧时代风格, 可以看到这玩意是C语言写的, 配置也是足够的GNU style（**纯脚本咔咔干啊...**）

:::tip
接下来所有操作系统都基于ubuntu20.04
:::

### 1. init

```bash
sudo apt update
sudo apt install openvpn easy-rsa
```

我的习惯是把配置文件全都软连接搞出来用vscode看, 接下来就是实现这一步. 

把easy-rsa全透出来:

```bash
sudo ln -s /usr/share/easy-rsa ~/easy-rsa
sudo chmod -R 0777 ~/easy-rsa

ubuntu@VM-4-2-ubuntu:~/easy-rsa$ ll
total 28
easyrsa -> /usr/share/easy-rsa/easyrsa
vars.example -> /usr/share/easy-rsa/vars.example
```

这里只有vars和easyrsa需要用到, 别的完全忽略即可. 

然后复制一份var, 现在跟着我填表即可, 内容照抄即可: 

```bash
sudo cp ~/easy-rsa/vars.example ~/easy-rsa/vars
sudo vim ~/easy-rsa/vars

set_var EASYRSA_CA_EXPIRE	3650
set_var EASYRSA_CERT_EXPIRE	1080

# Choices are:
#   cn_only  - use just a CN value
#   org      - use the "traditional" Country/Province/City/Org/OU/email/CN format
set_var EASYRSA_DN	"cn_only"

set_var EASYRSA_REQ_COUNTRY "CN"
set_var EASYRSA_REQ_PROVINCE "Beijing"
set_var EASYRSA_REQ_CITY "Shanghai"
set_var EASYRSA_REQ_ORG "fuck" # 组织名
set_var EASYRSA_REQ_EMAIL "fuck@fuck.com" # 邮箱
```

其他配置我也没动,基本上不重要. 接下来按流程敲命令即可,里面会有交互,注意注释详解.

```bash
# 初始化pki (Public Key Infrastructure，即公钥基础设施，它是一个用于管理和分发加密密钥的系统)
sudo ./easyrsa init-pki 

# 生成ca证书，类似https的s，用于验证服务端身份
# 一直回车，生成ca.crt和ca.key
sudo ./easyrsa build-ca nopass 

# 生成dh证书，我不知道用来干嘛的
 # 一直回车，生成dh.pem
sudo ./easyrsa gen-dh

# 生成服务端密钥对
# 生成 pki/issued/vpn-server.crt 和 pki/private/vpn-server.key
sudo ./easyrsa build-server-full vpn-server nopass 

# 生成客户端密钥对，每次派发一个新的客户端都需要制造证书，也可以直接复用原来的证书
# 生成 pki/issued/vpn-client.crt 和 pki/private/vpn-client.key
sudo ./easyrsa build-client-full vpn-client nopass
```

查看 pki/issued/ 和 pki/private/ ,会发现多了证书和私钥出来：

![alt text](image.png)

然后该生成的都生成完了基本上，开始openvpn上场：

```bash
# 生成 OpenVPN 的静态密钥文件 ta.key
# 不生成也可以用，但是某些GUI会显示”不安全“，为了用户感觉”安全“，咱还是加上。
openvpn --genkey --secret pki/ta.key

# 将所有的配置文件都转移到etc/openvpn目录下面
sudo cp pki/ca.crt /etc/openvpn/server/ca.crt 
sudo cp pki/dh.pem /etc/openvpn/server/dh.pem 
sudo cp pki/issued/vpn-server.crt /etc/openvpn/server/vpn-server.key
sudo cp pki/private/vpn-server.key /etc/openvpn/server/vpn-server.key 
sudo cp pki/ta.key /etc/openvpn/server/ta.key 
```

:::warning
重中之重，必须要`cp`而不能软连接！！！

openvpn不认软连接！你可以mv进去`/etc/openvpn`原始文件，之后再把它们软连接出来，但不能直接把文件软连接进去。

一定要确保`/etc/openvpn`下的文件是原始文件，而不是软连接。
:::

然后创建一个`/etc/openvpn/server/check.sh`1`文件，作为用户密码验证的脚本：


```bash title="check.sh"  
#!/bin/bash

# 密码文件 用户名 密码明文
PASSFILE="/etc/openvpn/openvpnfile" 
# 用户登录情况的日志
LOG_FILE="/var/log/openvpn-password.log"  

TIME_STAMP=`date "+%Y-%m-%d %T"`
if [ ! -r "${PASSFILE}" ]; then
    echo "${TIME_STAMP}: Could not open password file \"${PASSFILE}\" for reading." >> ${LOG_FILE}
    exit 1
fi
CORRECT_PASSWORD=`awk '!/^;/&&!/^#/&&$1=="'${username}'"{print $2;exit}'    ${PASSFILE}`
if [ "${CORRECT_PASSWORD}" = "" ]; then
    echo "${TIME_STAMP}: User does not exist: username=\"${username}\",password=\"${password}\"." >> ${LOG_FILE}
    exit 1
fi
if [ "${password}" = "${CORRECT_PASSWORD}" ]; then
    echo "${TIME_STAMP}: Successful authentication: username=\"${username}\"." >> ${LOG_FILE}
    exit 0
fi
echo "${TIME_STAMP}: Incorrect password: username=\"${username}\", password=\"${password}\"." >> ${LOG_FILE}
exit 1
```

创建`/etc/openvpn/openvpnfile`文件，里面记录所有用户的密码和用户名，明文存储，示例如下：

```txt title="openvpnfile"
jw238 123123
jwserver ee##rr$$tt%%
jwphone ppp22ppp
```

### 2. server.conf

接下来设置服务端配置文件，创建一个配置文件如下，尽量在server文件夹里面创建，后面systemd方便操作。

```bash
cd /etc/openvpn/server
sudo nano server.conf
```

这个conf很有讲究，内容直接决定配置复杂度和效果，仔细看。由于文件太长，我这里放个连接，保证各位能拿到文件样本即可。

国内点这个
[server.conf](https://jw238.site/assets/server.conf.sample)

国外点这个
[server.conf](https://jabberwocky238.github.io/assets/server.conf.sample)

### 3. client.conf(.ovpn)

client.conf是linux文件，client.ovpn是windows文件，安卓系统皆可。

为了方便派发，我们把所有东西，证书啊密钥啊什么的，全部放进一个文件。接下来是一个实例，你按照我的要求进行复制即可：

<details>
  <summary>点击查看 client.conf/client.ovpn</summary>

```conf  
# client指明这是个客户端文件
client
# 验证远程服务器有没有开启tls，如果你没开，就把这个注释掉
remote-cert-tls server
# 失败无限重连
resolv-retry infinite

# tun模式
dev tun

# 公网IP, 端口，UDP/TCP
# remote x.x.x.x <port>
remote 154.20.78.20 9999 # 已脱敏，放心
proto udp

# 不主动拉取服务端路径，防止全部流量都走VPN
route-nopull
# 限定10.8.66.0/24的流量经过VPN
route 10.8.66.0  255.255.255.0 vpn_gateway

# 看好你的加密方法和压缩方法
cipher AES-256-GCM
auth SHA1
;comp-lzo

# 使用密码验证
auth-user-pass
# 不绑定固定端口，客户端都这样
nobind
# 允许循环路由，要不然找不到家
allow-recursive-routing

<ca>
-----BEGIN CERTIFICATE-----
MIIDSzCCAjOgAwIBAgIUcRw0kjFHdfnkTB+HgIMAnkt61S0wDQYJKoZIhvcNAQEL
一大坨
MDIzMDIzOTQ1WjAWMRQwEgYDVQQDDAtFYXN5LVJTQSBDQTCCASIwDQYJKoZIhvcN
-----END CERTIFICATE-----
</ca>

<key>
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCN2YkgCmIZB2Gu
一大坨
DyZJHquhNczvbk81E3Gd0tgpevGx3qwQO67VIAG6veRAX4nRgAJMPJ3Sw/Jv8Hhe
-----END PRIVATE KEY-----
</key>

<cert>
-----BEGIN CERTIFICATE-----
MIIDoDCCAoigAwIBAgIRAIGOQYVP1w+kSGx66gpyH4owDQYJKoZIhvcNAQELBQAw
一大坨
DwAwggEKAoIBAQCN2YkgCmIZB2GuDyZJHquhNczvbk81E3Gd0tgpevGx3qwQO67V
-----END CERTIFICATE-----
</cert>

key-direction 1
<tls-auth>
#
# 2048 bit OpenVPN static key
#
-----BEGIN OpenVPN Static key V1-----
b28b01af792acedbd8faaf80ab4716e3
一小坨
f5e36f61f95697b3f800d712996259db
-----END OpenVPN Static key V1-----
</tls-auth>
```
</details>

### 4. 启动

直接命令行启动，不建议

```bash
sudo openvpn --daemon --config server.conf
sudo openvpn --config server.conf
```

systemd启动，更好

```bash
sudo systemctl start openvpn-server@server
sudo systemctl status openvpn-server@server
```

systemd情况要注意，你的server.conf文件的名字，其实就是@后的名字，换言之，如果你的server.conf叫abcd.conf，那么在systemd启动时，命令行应该如下：

```bash
sudo systemctl start openvpn-server@abcd
```

linux客户端同理，windows客户端和android客户端直接用GUI更好。

### 5. 测试

我的妈呀，好费劲啊，好复杂啊，卧槽...而且这玩意很丑你知道吗，你跟clash和v2ray的界面一比，简直丑爆了。但是架不住他设置全面，覆盖面广，重武器有重武器的好。

接下来咱们准备两台设备，一个电脑一个手机，都连到VPN上，电脑打开一个python flask web，手机访问其公网IP和端口。

```
10.8.66.1 公网服务器
10.8.66.2 电脑
10.8.66.3 手机
```

电脑的flask开在0.0.0.0的5000端口上，手机浏览器访问10.8.66.2:5000应该是可以打开的flask页面的，同理即可穿透其他内网服务，比如其他设备的docker容器，mysql甚至是ssh，mcsmanager就更不在话下了。

*哪怕MC本身都是可以穿透的*

## 三，WireGuard

有没有更方便的方法，直接“开VPN”即访问内网，关VPN即无法访问。于是我找到了[WireGuard](https://www.wireguard.com/)。

配置极度简单，但是坏处是没法密码验证，必须每个客户端独立密钥对，管理起来会麻烦，但是GUI好看，官方定制GUI，而且Wireguard速度比OpenVPN快。

### 1. 单机配置
```bash
sudo apt install wireguard
# 构建密钥对，记得管理好，容易乱
# PUBLIC_KEY和PRIVATE_KEY替换成你喜欢的名字
wg genkey | tee keys/$PRIVATE_KEY | wg pubkey > keys/$PUBLIC_KEY
```

![alt text](image-1.png)

然后创建一个配置文件，内容如下：

```bash
sudo vim /etc/wireguard/wg0.conf
```


```conf title="wg0.conf"  showLineNumbers
[Interface]
PrivateKey = 服务器密钥
Address = 192.168.238.1/24
# Wireguard监听端口，默认是51820
ListenPort = 51820 
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; 
PostUp = iptables -A FORWARD -o wg0 -j ACCEPT;
PostUp = iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE;
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; 
PostDown = iptables -D FORWARD -o wg0 -j ACCEPT;
PostDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE;
# 你的DNS服务器，可以自建，不自建的话就注释掉
DNS = 192.168.238.1

[Peer]
PublicKey = 客户端公钥
# 此机器内网IP，/32意思是子网掩码是255.255.255.255
# 换言之这玩意只有自己的IP作为子网
AllowedIPs = 192.168.238.2/32
# 握手速度，不是必须的，一般写个30秒上下足够，如果要实时性高可以写更短
PersistentKeepalive = 25
```
PostUp和PostDown里面的“wg0”是当前文件的名字，你可以随便取，但是要保持一致。

PostUp和PostDown是WireGuard的钩子，用于iptable，kimi一下iptable是什么吧，这是一个很牛的东西。

如果你不想费心思考虑iptable的原理，我可以简单解释这三句话啥意思：

```bash
# 允许wg0接口的数据包进来，inbound
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT;
# 允许wg0接口的数据包出去，outbound
PostUp = iptables -A FORWARD -o wg0 -j ACCEPT;
# 允许wg0接口的数据包出去，但是要做NAT，转换到eth0（实际网卡）的IP
PostUp = iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE;
```

然后你的电脑或者手机开一个wireguard，写如下文件：


```conf title="client.conf"  showLineNumbers
[Interface]
PrivateKey = 客户端密钥
Address = 192.168.238.2/32
# 你的DNS服务器，可以自建，不自建的话就注释掉
DNS = 192.168.238.1

[Peer]
PublicKey = 服务器公钥
AllowedIPs = 192.168.238.0/24
PersistentKeepalive = 25
```


然后192.168.238.0/24网段的所有主机你都可以访问了。测试方法同openvpn，开一个flask，手机访问，成功即可。

### 2. 内网设备互联

如果你想要内网机器互联，不需要增加Peer，只需要在每台机器上配置好client.conf。

**举例：**

设备A公网，设备B内网，设备C内网，B与C互相不通，现在要使用A作为VPN网关，使得B与C互通。

假设A内网IP是10.99.0.1，B是10.99.0.2，C是10.99.0.3。

```conf title="A.conf"  showLineNumbers
[Interface]
PrivateKey = A密钥
Address = 10.99.0.1/24
ListenPort = 51820 
PostUp = 略
PostDown = 略

[Peer]
PublicKey = B公钥
AllowedIPs = 10.99.0.2/32

[Peer]
PublicKey = C公钥
AllowedIPs = 10.99.0.3/32
```


```conf title="B.conf"  showLineNumbers
[Interface]
PrivateKey = B密钥
Address = 10.99.0.2/32

[Peer]
PublicKey = A公钥
AllowedIPs = 10.99.0.0/24
```


```conf title="C.conf"  showLineNumbers
[Interface]
PrivateKey = C密钥
Address = 10.99.0.3/32

[Peer]
PublicKey = A公钥
AllowedIPs = 10.99.0.0/24
```

此三设备互相可以ping通，使用内网IP即可。

:::tip
如果三者其一开启网络服务，记得暴露在0.0.0.0网段或者指定在10.99.0.0/24网段，否则，一般的127.0.0.1，由于你没设置iptable，是访问不到的。

或者使用nginx进行反向代理，把localhost代理到内网网段，下文有所涉猎。
:::

A的Peer设置里，10.99.0.0/24的意思是，只有10.99.0.0/24网段的流量会被此VPN接管，其他流量都是直连状态，不会接管。

换言之，如果你写`AllowedIPs = 0.0.0.0`，那么A就类似 **“梯”** 了。

:::warning

wireguard可以做 **“梯”** ，但是诸多事件告诉我们，应该选择更安全的协议，wireguard并不能很好的隐藏自己，有兴趣可点我个人站，有你想看的。

:::

### 3. Web GUI管理器

wireguard的好处，比OpenVPN好的地方，就是他有一个开源的，非常好的webGUI，弥补了它没密码表不好管理的缺陷，github连接在这，[wireguard-ui](https://github.com/ngoduykhanh/wireguard-ui)，占用空间也很小，2核2G的服务器绰绰有余可以跑这个，还能加上nginx，都吃不到20%。

使用方法，官方给出了直接使用版本，我的建议还是用docker，毕竟这玩意，在不久的未来可能需要多开，毕竟需要留一个只有你能打开的面板（防止管理人员不懂技术，搞坏了，你又不好debug）。

:::tip
对于已经在宿主机里装好wireguard的同学，恭喜你，你跟我完全一样，只需要顺着走完此教程即可。
:::

docker-compose文件sample官方已经给了，我在这里给你一个我的副本，解释一下每个参数的意义，方便你使用。

<details>
  <summary>点击查看 docker-compose.yml</summary>

```yaml  
version: "3"

services:
  wireguard-ui:
    image: ngoduykhanh/wireguard-ui:latest
    container_name: wireguard-ui
    cap_add:
      - NET_ADMIN
    # required to show active clients. with this set, you don't need to expose the ui port (5000) anymore
    network_mode: host
    environment:
      - BASE_PATH # web GUI基点，默认是"/"
        # ！！！绑定GUI监听端口，也就是nginx转发的位置(proxy_pass http://127.0.0.1:23992;)
        // highlight-next-line
      - BIND_ADDRESS=127.0.0.1:23992
      - SESSION_SECRET # 额外加密
      - SESSION_SECRET_FILE # 额外加密
      - SESSION_MAX_DURATION=90 # 额外加密
        # ！！！子网范围，仔细看文档，他直接决定此GUI的全局选项，且容器生命周期内不可修改，你可以删容器来重启
        // highlight-next-line
      - SUBNET_RANGES=ALL:192.168.238.0/24;
      - WGUI_USERNAME=admin # 默认用户名
      - WGUI_PASSWORD=admin # 默认用户密码
      - WGUI_PASSWORD_FILE # 密码很长的话可以放文件里
      - WGUI_PASSWORD_HASH # 没懂
      - WGUI_PASSWORD_HASH_FILE # 没懂
      - WGUI_ENDPOINT_ADDRESS=xxx.xxx.xxx.xxx:51280 # wireguard公网IP和端口，内部可调
      - WGUI_FAVICON_FILE_PATH # 网站图标
      - WGUI_DNS=192.168.238.1 # 自定义DNS
      - WGUI_MTU=1450 # 默认设置1
      - WGUI_PERSISTENT_KEEPALIVE=15 # 默认设置2
      - WGUI_FIREWALL_MARK=51280 # wireguard公网端口，内部可调
      - WGUI_TABLE=auto
        # ！！！此GUI监管的wg示例，如果你填了wg1，那么那就会对wg1.conf完全控制，包括开启和关闭，甚至文件修改
        // highlight-next-line
      - WGUI_CONFIG_FILE_PATH=/etc/wireguard/wg1.conf
      - WGUI_LOG_LEVEL=INFO
      - WG_CONF_TEMPLATE
      - EMAIL_FROM_ADDRESS=
      - EMAIL_FROM_NAME=WireGuard UI
      - SENDGRID_API_KEY=
      - SENDGRID_API_KEY_FILE=
        # SMTP和TELEGRAM通知，你不设置就不用填，没用。
      - SMTP_HOSTNAME=127.0.0.1
      - SMTP_PORT=25
      - SMTP_USERNAME=
      - SMTP_PASSWORD=
      - SMTP_PASSWORD_FILE=
      - SMTP_AUTH_TYPE=
      - SMTP_ENCRYPTION=
      - SMTP_HELO=
      - TELEGRAM_TOKEN=
      - TELEGRAM_ALLOW_CONF_REQUEST=false
      - TELEGRAM_FLOOD_WAIT=60
        # 默认配置一大堆，注意POST_UP和POST_DOWN对应的wg1，名字别错了
      - WGUI_SERVER_INTERFACE_ADDRESSES=192.168.238.1/24
      - WGUI_SERVER_LISTEN_PORT=51280
      - WGUI_SERVER_POST_UP_SCRIPT=iptables -A FORWARD -i wg1 -j ACCEPT; iptables -A FORWARD -o wg1 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE;
      - WGUI_SERVER_POST_DOWN_SCRIPT=iptables -D FORWARD -i wg1 -j ACCEPT; iptables -D FORWARD -o wg1 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE;
      - WGUI_DEFAULT_CLIENT_ALLOWED_IPS=192.168.238.0/24
      - WGUI_DEFAULT_CLIENT_EXTRA_ALLOWED_IPS=
      - WGUI_DEFAULT_CLIENT_USE_SERVER_DNS=true
      - WGUI_DEFAULT_CLIENT_ENABLE_AFTER_CREATION=true
        # ！！！一定要true，让容器直接控制宿主机wg1启停
        // highlight-next-line
      - WGUI_MANAGE_START=true
        // highlight-next-line
      - WGUI_MANAGE_RESTART=true
    logging:
      driver: json-file
      options:
        max-size: 50m
    volumes:
      - ./db:/app/db
      - /etc/wireguard:/etc/wireguard
```
</details>

## 四，DNS(bind9, named)

DNS服务器，用于解析域名。你连上自定义的VPN之后，内网的兄弟姐妹连你的服务还得手敲IP，多没面子！所以我们来搞一个DNS服务器，给他一个漂亮的域名，看起来就爽多了。

    
```bash
sudo apt install bind9
sudo ln -s /etc/bind /home/ubuntu/bind
```

然后你会看到如下场景：

![alt text](image-3.png)

首先复制一下db.local，然后改一个你喜欢的名字，像我一样，然后改文件。


```bash title="db.jw238server"  
;
; BIND data file for jw.boom
;
$TTL    86400
; 这里写基础域名，据我所知你可以写的很骚，我这里非常保守，你可以写好长一串
@   IN  SOA jw.boom. root.jw.boom. (
                              1         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
; 默认nameserver，必写，我这里写的是station
; 你可以直接解析到IP，或者像我一样隔一层
@           IN      NS      station 
; A是解析到IPV4地址，AAAA是解析到IPV6地址
station     IN      A       192.168.238.1 
; CNAME是别名
dns         IN      CNAME   station
mcs         IN      CNAME   station
mcworld     IN      A       192.168.238.2
mc          IN      CNAME   mcworld
gigachad    IN      A       192.168.238.5
; 下面两句必写，否则会报错
@	        IN	    A     	127.0.0.1 
@	        IN	    AAAA	  ::1
```

然后找到`named.conf.local`，加一行这个。


```txt title="named.conf.local"
// 定义域名的核心在这里
zone "jw.boom" {
	type master;
	file "/etc/bind/db.jw238server";
};
```

然后找到`named.conf.options`，改写转发规则。


```txt title="named.conf.options"
options {
	directory "/var/cache/bind";

    // 不forward，因为你都解析不出来，那肯定就不是自定义的域名了 
	// forwarders { 8.8.8.8; };
	dnssec-validation no; // 关了不报错

	listen-on port 53 { 
		192.168.238.1; // 本机内网IP，也是你的DNS服务器
	};
  listen-on-v6 { any; }; // 解析IPV6

	recursion yes; // 循环查询dns
	allow-query { any; }; 
};
```

然后记得重启named(bind9)

```bash
sudo systemctl restart named
```

如果你的服务暴露在内网段，你已经可以通过域名+端口直接访问了，但是如果你想去掉恶心的端口，或者转发127.0.0.1的服务，就需要nginx。

## 五，Nginx

咋装咋开：

```bash
sudo apt install nginx
sudo ln -s /etc/nginx /home/ubuntu/nginx
sudo ln -s /var/www/html /home/ubuntu/nginx/html
sudo ln -s /var/log/nginx /home/ubuntu/nginx/log
sudo systemctl start nginx
```

分conf文件我就不教了，可以搜nginx教学，这里只教快速映射端口和域名。

找到nginx的http块。


```conf title="nginx.conf"
http {
    # ...

    map $http_host $backend_port {
        mcsmanager.jw.boom 23333;
        mc.jw.boom 25565;
        gigachad.jw.boom 6666;
    }

    server {
        listen 80;
        location / {
            proxy_pass http://127.0.0.1:$backend_port;
        }
    }
}
```

map格式，左边域名，右边端口，域名支持正则匹配。

下面server块，我还不知道怎么魔改，建议照抄。

:::warning
这个server块和map块必须直接放在http块下，不能放入单独的conf文件引入，因为map块有作用域。
:::

记得重启：

```bash
# 重启之间测试一下配置文件
sudo nginx -t
# 如果报错了，看看配置哪不对
# 重启
sudo systemctl reload nginx
```

至此，你在VPN服务器直接开一个mcsmanager，你的小伙伴应该可以通过mcsmanager.jw.boom来访问控制面板了。

然后同一个VPN下的同学可以直接通过内网IP加端口号访问对方的世界。

例如公网机器A(192.169.0.1)，同学B(192.169.0.2)，同学C(192.169.0.3)，其中B开了一个世界，局域网端口为48888，那么C可以通过192.168.0.2:48888连入世界。

或者如果你做了DNS，把192.169.0.2解析到了gigachad.jw.boom，那么C同学就可以通过gigachad.jw.boom:48888连入世界。

:::tip
如果B访问C的mcsmanager控制面板，需要在A里面做DNS解析，在C里面做nginx代理。
:::


## CHANGELOG  
> created at: 2024-10-27T18:00  
> modified at: 2024-11-01T23:09 
> - 补齐了dns和nginx部分
> - 加入了wireguard web GUI   
> 
> modified at: 2024-11-02T12:03  
> - 加上了导读  
> - 制作知乎版单文件，github仓库可见
>  
> modified at: 2024-11-04T02:03
> - codeblock 美化
> 
> modified at: 2024-11-04T17:12
> - details-summary 美化大块代码

