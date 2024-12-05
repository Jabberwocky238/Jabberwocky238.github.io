---
title: trojan使用记录
authors: [jabberwocky238]
tags: 
    - zh
    - tech
---


<!-- truncate -->

## 服务端(linux)

[trojan download](https://github.com/trojan-gfw/trojan/releases)

首先下载trojan。

解压。

申请域名，要crt和key，这一步很重要。

config.json
```json
{
    "run_type": "server",
    "local_addr": "0.0.0.0",
    "local_port": 443,
    "remote_addr": "127.0.0.1",
    "remote_port": 80,
    "password": [
        "passwordpasswordpassword"
    ],
    "log_level": 1,
    "ssl": {
        "cert": "/home/ubuntu/nginx/xxx.site_nginx/xxx.site_bundle.crt",
        "key": "/home/ubuntu/nginx/xxx.site_nginx/xxx.site.key",
        "key_password": "",
        "cipher": "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384",
        "cipher_tls13": "TLS_AES_128_GCM_SHA256:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_256_GCM_SHA384",
        "prefer_server_cipher": true,
        "alpn": [
            "http/1.1"
        ],
        "alpn_port_override": {
            "h2": 81
        },
        "reuse_session": true,
        "session_ticket": false,
        "session_timeout": 600,
        "plain_http_response": "",
        "curves": "",
        "dhparam": ""
    },
    "tcp": {
        "prefer_ipv4": false,
        "no_delay": true,
        "keep_alive": true,
        "reuse_port": false,
        "fast_open": false,
        "fast_open_qlen": 20
    },
    "mysql": {
        "enabled": false,
        "server_addr": "127.0.0.1",
        "server_port": 3306,
        "database": "trojan",
        "username": "trojan",
        "password": "",
        "key": "",
        "cert": "",
        "ca": ""
    }
}
```

:::tip
tcp的reuse_port和fast_open，能开就开（需要内核支持，请看trojan文档），会极大增加体验感，否则tcp连接经常断，网站打开一半404了，谁都受不了。
:::

除了需要改crt文件和key文件的位置以外。

改密码，密码可以有很多，**一定要改，否则就是裸奔**。

其他别动，什么都不动。

## 客户端(clash)

教程：
- [codein.icu](https://www.codein.icu/clashtutorial/#proxy-group)

config.yaml
```yaml

mixed-port: 7890
allow-lan: true
bind-address: "*"
mode: rule
log-level: info
external-controller: "127.0.0.1:9090"
dns:
    enable: false
    ipv6: false
    default-nameserver: [223.5.5.5, 119.29.29.29]
    enhanced-mode: fake-ip
    fake-ip-range: 198.18.0.1/16
    use-hosts: true
    nameserver:
        ["https://doh.pub/dns-query", "https://dns.alidns.com/dns-query"]
    fallback:
        [
            "https://doh.dns.sb/dns-query",
            "https://dns.cloudflare.com/dns-query",
            "https://dns.twnic.tw/dns-query",
            "tls://8.8.4.4:853",
        ]
    fallback-filter: { geoip: true, ipcidr: [240.0.0.0/4, 0.0.0.0/32] }
proxies:
    - { name: 小卡拉米, type: trojan, server: 域名, port: 443, password: 密码, udp: true, skip-cert-verify: true }
proxy-groups:
    - { name: 小卡拉米机场, type: select, proxies: [小卡拉米] }
rules:
    - "DOMAIN-KEYWORD,google,小卡拉米"
    - "DOMAIN-KEYWORD,youtube,小卡拉米"
    - "DOMAIN-KEYWORD,github,小卡拉米"
    - "DOMAIN-KEYWORD,docker,小卡拉米"
    - "DOMAIN-SUFFIX,poe.com,小卡拉米"
    
    - "DOMAIN-SUFFIX,local,DIRECT"
    - "IP-CIDR,127.0.0.0/8,DIRECT"
    - "IP-CIDR,172.16.0.0/12,DIRECT"
    - "IP-CIDR,192.168.0.0/16,DIRECT"
    - "IP-CIDR,10.0.0.0/8,DIRECT"
    - "IP-CIDR,17.0.0.0/8,DIRECT"
    - "IP-CIDR,100.64.0.0/10,DIRECT"
    - "IP-CIDR,224.0.0.0/4,DIRECT"
    - "IP-CIDR6,fe80::/10,DIRECT"
    - "GEOIP,CN,DIRECT"
    - "MATCH,DIRECT"
```
