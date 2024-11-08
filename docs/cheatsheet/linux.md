# linux

## 用户篇

以下是根据您提供的命令和选项，整理和补充的Markdown格式的用户和组管理命令参考：

```bash
sudo useradd [options] username # 创建新用户

- `-c comment` ：添加用户注释
- `-d home_dir` ：设置用户主目录
- `-g group` ：设置用户的主要组
- `-G groups` ：将用户添加到附加组
- `-s shell` ：设置用户的默认shell
- `-u uid` ：指定用户的用户号
- `-o` ：允许重复使用其他用户的标识号
- `-p encrypted_password` ：为账户添加加密密码

sudo usermod [options] username # 修改用户属性

- `-c new_comment` ：更改用户注释
- `-d new_home` ：更改用户主目录
- `-g new_group` ：更改用户的主要组
- `-G new_groups` ：更改用户附加组
- `-l new_username` ：更改用户登录名
- `-s new_shell` ：更改用户默认shell
- `-u new_uid` ：更改用户ID
- `-m` ：移动用户主目录到新位置

sudo passwd username # 创建用户并设置密码
sudo useradd -D # 查看默认用户设置
sudo useradd -D -b /home/new -s /bin/sh # 修改默认用户设置：
sudo userdel username # 删除用户
sudo userdel -r username # 删除用户及其主目录
sudo find / -user username

sudo groupadd groupname # 创建新组
sudo groupdel groupname # 删除组
sudo groupmod [options] groupname # 修改组属性

- `-g new_gid` ：更改组ID
- `-n new_groupname` ：更改组名

who # 列出当前登录用户
cut -d: -f1 /etc/passwd # 列出所有用户
awk -F':' '{ print $1}' /etc/passwd # 列出所有用户
id username # 查看用户信息
su - username # 切换用户
groups username 或 id -nG username # 列出用户所在的所有组

将用户添加到组： sudo usermod -aG groupname username
从组中移除用户： sudo gpasswd -d username groupname
```


## Systemd
以下是Systemd的常用命令和配置概览：
基本命令
 systemctl start <unit> ：启动服务或单元 
 systemctl stop <unit> ：停止服务或单元
 systemctl restart <unit> ：重启服务或单元
 systemctl reload <unit> ：重载服务配置而不断开连接
 systemctl enable <unit> ：设置服务开机启动
 systemctl disable <unit> ：取消服务开机启动
 systemctl status <unit> ：查看服务状态
 systemctl list-units ：列出所有单元状态
 systemctl list-units --all ：列出所有单元状态，包括未启动的
 systemctl list-units --type=service ：仅列出服务类型的单元状态
系统管理
 systemctl reboot ：重启系统
 systemctl poweroff ：关闭系统
 systemctl halt ：停止系统
 systemctl suspend ：暂停系统
 systemctl hibernate ：休眠系统
 systemctl hybrid-sleep ：混合睡眠模式
 systemctl rescue ：启动救援模式
日志管理
 journalctl ：查看系统日志
 journalctl -u <unit> ：查看特定单元的日志
 journalctl --since "2022-01-01" ：根据时间过滤日志
配置文件管理
配置文件通常位于  /etc/systemd/system/  或  /usr/lib/systemd/system/ 
使用  systemctl daemon-reload  重新加载配置文件变更
使用  systemctl enable <unit>  创建符号链接，设置开机启动
使用  systemctl disable <unit>  删除符号链接，取消开机启动
服务配置文件示例
服务启动类型
 Type=simple ：默认值，启动主进程
 Type=forking ：以fork方式启动子进程
 Type=oneshot ：一次性进程，执行完毕后结束
 Type=dbus ：等待D-Bus信号后启动
 Type=notify ：启动结束后发出通知信号
 Type=idle ：其他任务执行完毕后再启动
重启行为配置
 Restart=always ：总是重启服务
 Restart=on-success ：成功执行后重启
 Restart=on-failure ：失败时重启
 Restart=on-abnormal ：非正常退出时重启
 Restart=on-watchdog ：监视器超时时重启
其他工具
 hostnamectl ：管理系统主机名
 timedatectl ：管理系统时间和时区
 localectl ：管理系统本地化设置
 loginctl ：管理已登录用户信息
 systemd-analyze ：分析启动耗时
这些命令和配置选项涵盖了Systemd的大部分功能，用于管理系统服务、处理系统日志、管理系统启动流程等。

## nano

打开文件
 nano filename ：打开或创建一个名为  filename  的文件。
基本操作
 Ctrl + O ：保存当前文件。
 Ctrl + X ：退出 nano。
 Ctrl + R ：读取文件，将文件内容加载到当前编辑器中。
 Ctrl + C ：在连续按两次  Ctrl + C  后退出 nano。
编辑操作
 ↑  和  ↓ ：光标上下移动。
 ←  和  → ：光标左右移动。
 Page Up  和  Page Down ：翻页。
 Ctrl + _  或  Ctrl + K ：剪切当前行。
 Ctrl + U ：粘贴剪切或复制的内容。
 Ctrl + W ：搜索文本。
 Alt + _  或  Ctrl + T ：拼写检查。
 Alt + C  或  Ctrl + ^ ：注释或取消注释当前行（多行编辑模式）。
 Alt + O ：切换到或从“正交模式”中退出。
文件操作
 G ：跳转到文件的最后一行。
 M ：跳转到文件的中间行。
 1 ：跳转到文件的第一行。
帮助
 Ctrl + H  或  F1 ：显示帮助信息。
状态栏
在 nano 的底部状态栏，你可以看到当前的行号、总行数、光标位置、当前模式（如“INS”表示插入模式，“REP”表示替换模式）等信息。
退出 nano
首先按  Ctrl + X  退出。
如果有未保存的更改，nano 会询问你是否保存更改。
按  Y  保存更改。
按  N  不保存更改。
按  Ctrl + C  取消退出。
nano 编辑器是初学者的理想选择，因为它提供了一个用户友好的界面，并且可以通过底部的状态栏轻松访问快捷键提示。

## vim
 vim  是一个功能强大的文本编辑器，广泛用于命令行界面。以下是一些基本的  vim  编辑器命令和快捷键：
模式切换
普通模式（Normal Mode）：默认模式，用于导航和执行命令。
插入模式（Insert Mode）：用于插入文本。
命令模式（Command Mode）：用于执行命令，如保存或退出。
可视模式（Visual Mode）：用于选择文本块。
切换模式
 i ：进入插入模式（在光标前插入）。
 I ：进入插入模式，光标移动到行首。
 a ：进入插入模式（在光标后插入）。
 A ：进入插入模式，光标移动到行尾。
 v ：进入可视模式。
 V ：进入可视行模式。
 Ctrl + v ：进入可视块模式。
 Esc ：从插入模式或可视模式返回到普通模式。
基本操作
 h ：光标左移。
 j ：光标下移。
 k ：光标上移。
 l ：光标右移。
 w ：移动到下一个单词的开头。
 b ：移动到当前单词的开头。
 e ：移动到下一个单词的末尾。
 0 ：移动到行首。
 $ ：移动到行尾。
 gg ：移动到文件的第一行。
 G ：移动到文件的最后一行。
 :n ：移动到第 n 行。
 dd ：删除当前行。
 yy ：复制当前行。
 p ：粘贴复制的文本。
 u ：撤销。
 Ctrl + r ：重做。
搜索和替换
 /word ：向下搜索 "word"。
 ?word ：向上搜索 "word"。
 n ：查找下一个匹配项。
 N ：查找上一个匹配项。
 :%s/old/new/g ：替换文件中所有的 "old" 为 "new"。
 :%s/old/new/gc ：替换文件中所有的 "old" 为 "new"，并在每次替换前确认。
文件操作
 :w ：保存文件。
 :wq  或  :x ：保存并退出。
 :q ：退出（如果文件未被修改）。
 :q! ：不保存退出。
 :e filename ：打开另一个文件。
窗口分割
 :split  或  :sp ：垂直分割窗口。
 :vsplit  或  :vsp ：水平分割窗口。
 Ctrl + w  后跟方向键：在分割的窗口间移动。
帮助
 :help ：打开帮助文档。
 :help command ：获取特定命令的帮助。
 vim  编辑器非常灵活，可以通过插件和配置文件进行高度定制。这些基本命令是开始使用  vim  的起点，但  vim  的能力远不止于此。随着时间的推移，用户可以学习更多高级功能和技巧。

## netstat
 netstat  是一个非常有用的网络工具，用于显示网络连接、路由表、接口统计等网络信息。以下是一些常用的  netstat  命令及其选项：
基本使用
列出所有端口（包括监听和非监听端口）：netstat -a
列出监听端口：netstat -l
显示数字形式的地址和端口号（不解析为名称）：netstat -n
显示所有选项（包括 TCP、UDP 和 UNIX 套接字）：netstat -an
过滤和排序
仅显示 TCP 端口：netstat -t
仅显示 UDP 端口：netstat -u
按监听端口排序：netstat -lt
显示程序名称和端口号：netstat -ltnp这将显示监听的端口和对应的程序名称和进程 ID。
路由表和接口统计
显示路由表：netstat -r
显示网络接口统计：netstat -i
持续监控
持续显示网络连接状态（类似于  top  命令）：netstat -ct
特定选项
显示每个协议的统计信息：netstat -s
显示 TCP 重传次数：netstat -g
示例：查找特定服务的监听状态
如果你想查看特定服务（例如，HTTP）的监听状态，可以使用  grep  来过滤输出：
这将列出所有与  httpd （一个常见的 HTTP 服务器程序）相关的网络连接。
请注意， netstat  命令在不同的操作系统（如 Linux、Windows）中可能略有不同。上述命令主要适用于类 Unix 系统。在 Windows 系统中， netstat  的用法可能略有差异，例如，你可能需要使用  -a  选项来显示所有连接和监听端口。

## npm
npm 是一个强大的包管理器，它提供了许多命令来帮助开发者管理 Node.js 项目。以下是一些常用的 npm 命令：
1. npm init：创建一个新的  package.json  文件，它会引导你完成一些基本配置。
2. npm install：安装项目依赖项。如果没有指定包名，npm 会安装  package.json  文件中列出的所有依赖项。
3. npm install [package]@[version]：安装特定版本的包。
4. npm install --save [package]：安装包并将其添加到  package.json  的  dependencies  中。
5. npm install --save-dev [package]：安装包并将其添加到  package.json  的  devDependencies  中。
6. npm uninstall [package]：卸载项目中的包。
7. npm update：更新所有已安装的包到最新版本。
8. npm outdated：列出所有过时的包。
9. npm list：列出项目中安装的包及其版本。
10. npm run [script]：运行  package.json  中  scripts  部分定义的脚本。
11. npm start：运行  package.json  中定义的  start  脚本。
12. npm test：运行  package.json  中定义的  test  脚本。
13. npm publish：发布包到 npm 仓库。
14. npm login：登录到 npm 仓库。
15. npm logout：注销 npm 仓库。
16. npm whoami：显示当前登录的 npm 用户名。
17. npm config：查看和修改 npm 配置。
18. npm cache clean：清理 npm 缓存。
19. npm link：创建一个全局链接到你的包，以便在其他项目中测试。
20. npm prune：移除  node_modules  目录中没有在  package.json  中列出的包。
21. npm outdated：检查项目中哪些包是过时的。
22. npm audit：检查项目中是否有已知的安全漏洞。
23. npm audit fix：自动修复安全漏洞。
24. npm ci：如前所述，用于自动化环境中的依赖项安装。
25. npm pack：打包项目，生成一个  .tgz  文件。
26. npm adduser：添加一个新的 npm 用户（已弃用，使用  npm login ）。
27. npm deprecate：弃用一个包的特定版本。
28. npm view [package] [field]：查看包的特定字段信息。
29. npm access：设置包的访问权限。
30. npm version [version]/patch/minor/major：更新项目的版本号。
这些命令覆盖了项目管理、依赖管理、脚本运行、包发布和版本控制等多个方面。npm 的功能非常丰富，你可以通过  npm help [command]  来获取特定命令的详细帮助信息。

## git
Git 是一个开源的分布式版本控制系统，以下是 Git 的一些常用命令：
初始化和配置
初始化仓库：git init
克隆远程仓库：git clone [url]
设置用户信息：git config --global user.name "[name]"
git config --global user.email "[email]"
文件操作
添加文件到暂存区：git add [file]
删除工作目录中文件并跟踪：git rm [file]
删除暂存区的文件但保留在工作目录：git rm --cached [file]
提交和历史
提交更改：git commit -m "commit message"
查看提交历史：git log
查看更详细的提交历史：git log -p
分支和标签
列出所有分支：git branch -a
创建新分支：git branch [branch-name]
切换分支：git checkout [branch-name]
创建并切换新分支：git checkout -b [branch-name]
合并分支：git merge [branch-name]
删除分支：git branch -d [branch-name]
创建标签：git tag [tag-name]
查看所有标签：git tag
远程操作
列出远程仓库：git remote -v
添加远程仓库：git remote add [remote-name] [url]
拉取远程仓库的更新：git pull [remote-name] [branch-name]
推送到远程仓库：git push [remote-name] [branch-name]
解决冲突
解决合并冲突后：git add [resolved-files]
git commit
查看状态
查看当前状态：git status
撤销操作
撤销工作目录中的更改：git checkout -- [file]
重置暂存区的更改：git reset HEAD [file]
重置到上一次提交：git reset --hard
这些命令覆盖了 Git 的基本操作，包括初始化仓库、提交更改、分支管理、远程仓库操作等。通过这些命令，你可以有效地管理代码版本。
在 Git 中， rebase  是一个强大的工具，用于将一系列的提交从一个分支上摘下来，然后再应用到另一个分支上。这通常用于保持历史线的整洁，避免不必要的合并提交。以下是一些常用的  rebase  命令和它们的使用场景：
基本的变基操作
交互式变基：
git rebase -i [base-branch]
这个命令会打开一个编辑器，列出了当前分支上相对于  base-branch  的所有提交。你可以在这里选择哪些提交要变基。
非交互式变基：
git rebase [base-branch]
这个命令会将当前分支上的所有提交变基到  base-branch  上。
变基选项
 --onto <newbase> ：指定新的基底分支。

git rebase --onto newbase branchA branchB
将  branchB  上的提交变基到  branchA  上，以  newbase  为新的基底。
 --continue ：在变基过程中解决完冲突后，使用此命令继续变基。

git rebase --continue
 --abort ：在变基过程中遇到问题时，使用此命令放弃变基。

git rebase --abort
 --preserve-merges ：保留历史中的合并提交。

git rebase --preserve-merges [base-branch]
 --exec <command> ：在每次提交后执行指定的命令。

git rebase -i --exec "git push origin HEAD" main
变基策略
 --rebase-merges ：在交互式变基中，将合并提交转换为单独的提交。
 --no-ff ：禁止快进式变基，即使可以快进也生成新的提交。
示例：交互式变基
假设你有一个名为  feature  的分支，你想将它的提交变基到  main  分支上的最新提交：
1. 首先，确保你的工作目录是干净的（没有未提交的更改）。
2. 切换到  feature  分支：git checkout feature
3. 执行交互式变基：git rebase -i main这将打开一个编辑器，列出了所有相对于  main  分支的提交。
4. 在编辑器中，你可以对提交进行重新排序、合并、删除等操作。
5. 保存并关闭编辑器，Git 将开始变基过程。
6. 如果出现冲突，解决冲突并使用  git add  标记为已解决，然后使用  git rebase --continue  继续变基。
注意事项
变基是修改历史的操作，因此对于已经推送到远程仓库的分支，应谨慎使用变基。
如果需要在远程分支上应用变基，可能需要使用  --force  或  --force-with-lease  选项来推送更改。
通过使用  rebase ，你可以保持分支历史的清晰和线性，使得代码审查和维护变得更加容易。

## miscellaneous
x 1 x 2 w 3 wx 4 r 5 rx 6 rw 7 rwx
## # 依赖管理
Centos：yum install -y git
Ubuntu：apt install -y git