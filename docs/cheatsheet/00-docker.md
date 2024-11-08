---
sidebar_position: 2
sidebar_label: Easy
sidebar_class_name: green
---

# Docker

# docker container

```bash
docker container list # 列出运行中的容器
docker container list -a # 列出所有容器

docker container stop container_id # 停止容器
docker container start container_id # 启动容器
docker container rm container_id # 删除容器
docker container exec -it container_id /bin/bash # 进入容器
docker container logs container_id # 查看容器日志
```

# docker run 

## --add-host
`--add-host` 是 Docker 命令行的一个选项，它允许你在 Docker 容器内部的 `/etc/hosts` 文件中添加一个自定义的 host 条目。这通常用于在容器内部解析特定的 hostname 到一个特定的 IP 地址，这在容器需要访问特定的服务或网络时非常有用。

```bash
docker run --add-host "host1:192.168.1.100" -it ubuntu bash
docker run --add-host "host1:192.168.1.100" --add-host "host2:192.168.1.101" -it ubuntu bash
```

在 Docker Compose 中，你可以在 `docker-compose.yml` 文件中使用 `extra_hosts` 配置项来添加 host 条目：

```yaml
version: '3'
services:
  web:
    image: ubuntu
    command: bash
    extra_hosts:
      - "host1:192.168.1.100"
      - "host2:192.168.1.101"
```

## --annotation
在 Docker 中，`--annotation` 标志被用于向容器添加额外的元数据。这些元数据可以是任意的键值对，它们会被传递给 OCI 运行时，并存储在容器的配置中。虽然这些注释不会直接影响容器的功能，但它们可以用于记录有关容器的有用信息，如作者、版本、构建日期等。

```bash
docker run --annotation author="John Doe" -it ubuntu bash
docker run --annotation author="John Doe" --annotation version="1.0" -it ubuntu bash
```

要查看容器的元数据，包括注释，可以使用 `docker inspect` 命令：
```bash
docker inspect -f '{{.Config.Annotations}}' container_name_or_id
```

## --attach(-a)
在 Docker 命令中，`-a` 或 `--attach` 选项用于指定在启动容器时需要连接或“附加”到哪些标准输入输出管道（STDIN、STDOUT、STDERR）。这允许你与容器内运行的进程进行交互，例如查看输出或向其发送输入。

```bash
docker run -a stdout -a stderr -it ubuntu bash
docker run -a stdin -it ubuntu bash
docker run -a stdin -a stdout -a stderr -it ubuntu bash
docker run -a 0 -a 1 -a 2 -it ubuntu bash
```

在 Docker 中，`0`、`1` 和 `2` 分别代表 STDIN、STDOUT 和 STDERR。这个命令的效果与示例 3 相同。

如果你已经有一个正在运行的容器，并且想要附加到它的 STDOUT 或 STDERR，可以使用 `docker exec` 命令：

```bash
docker exec -it your_container_name bash
```

这个命令会启动一个交互式的 bash 会话，并附加到容器的标准输入输出管道。

请注意，使用 `--attach` 选项时，容器的生命周期将与你的终端会话绑定。如果你关闭了终端或断开了连接，容器可能会停止运行。为了避免这种情况，通常建议使用 `-d`（分离模式）选项来启动容器，并在需要时使用 `docker attach` 或 `docker exec` 来附加到容器。

## --blkio-weight & --blkio-weight-device
`--blkio-weight` 是 Docker 命令行的一个选项，它用于设置容器的块 IO（磁盘 IO）权重。这个选项的值介于 10 到 1000 之间，用来表示容器的 IO 优先级。权重越高，容器在磁盘 IO 操作上的优先级就越高。默认情况下，所有容器的 `--blkio-weight` 被设置为 500 。

```bash
docker run -it --blkio-weight 300 ubuntu bash
docker run -it --name container_A --blkio-weight 600 ubuntu bash
docker run -it --name container_B --blkio-weight 300 ubuntu bash
```
在这个例子中，`container_A` 被赋予了更高的块 IO 权重（600），因此它在磁盘 IO 操作上的优先级会比 `container_B`（权重为 300）更高。

请注意，`--blkio-weight` 设置只对直接 IO（direct IO）有效，对缓冲 IO（buffered IO）不生效。直接 IO 指的是绕过文件系统缓存直接从磁盘读写数据的操作，这通常用于数据库和某些特定的应用程序 。

此外，如果你想对特定设备的 IO 权重进行设置，可以使用 `--blkio-weight-device` 选项，格式为 `DEVICE_NAME:WEIGHT`。例如：
```bash
docker run -it --blkio-weight-device "/dev/sda:100" ubuntu bash
```
这会为 `/dev/sda` 这个设备设置权重为 100 的块 IO 权重 。

在实际使用中，合理配置 `--blkio-weight` 可以帮助你控制容器对磁盘 IO 资源的使用，从而优化整个系统的性能表现。

## -c 
Docker 提供了几个选项来控制和限制容器使用的 CPU 资源，这些选项可以帮助你优化容器的性能并管理多容器环境中的资源分配。以下是这些选项的详细说明和使用示例：

`--cpu-shares` 选项设置容器的 CPU 使用权重。这个权重是相对于其他容器的相对值。默认情况下，每个容器的 CPU 份额是 1024。
```bash
docker run -c 512 --cpu-shares 512 -it ubuntu bash
```
`--cpus` 选项限制容器可以使用的总 CPU 时间的比例。这个值是一个浮点数，表示 CPU 的总核心数的一部分。
```bash
docker run --cpus 0.5 -it ubuntu bash
```
`--cpuset-cpus` 选项允许你指定容器可以使用哪些 CPU 核心。这在多核心系统上非常有用，特别是当你想要将容器绑定到特定的 CPU 核心时。
```bash
docker run --cpuset-cpus="0,1" -it ubuntu bash
```
`--cpuset-mems` 选项允许你指定容器可以使用哪些内存节点。这在 NUMA（非均匀内存访问）系统中非常有用，可以帮助你优化内存访问延迟。
```bash
docker run --cpuset-mems="0,1" -it ubuntu bash
```
```bash
docker run --cpus 1.5 --cpuset-cpus="0,1" --cpuset-mems="0,1" -it ubuntu bash
```
这个命令启动一个 Ubuntu 容器，限制其可以使用 1.5 个 CPU 核心，并且只能使用编号为 0 和 1 的 CPU 核心和内存节点。

# detach(-d)
--detach-keys 选项允许你为 Docker 容器定义一个自定义的按键序列，用于从容器会话中分离（断开连接）。默认情况下，Docker 使用 CTRL-p CTRL-q 作为分离键序列。如果你需要使用不同的按键组合来分离容器，可以通过 --detach-keys 选项来指定。

## --entrypoint
在 Docker 中，`--entrypoint` 选项允许你为容器指定一个自定义的入口点，这意味着你可以覆盖 Docker 镜像中设置的默认入口点（通常是容器启动时执行的命令）。这在你需要改变容器启动行为，或者在运行时传递动态命令时非常有用。

```bash
docker run --entrypoint /bin/bash myimage
docker run --entrypoint mycustomcommand myimage arg1 arg2
docker run --entrypoint sh myimage -c "echo Hello, world!"
docker run --entrypoint /bin/bash myimage
```

## micellaneous
```bash
  -e, --env list                         Set environment variables
      --env-file list                    Read in a file of environment variables
      --expose list                      Expose a port or a range of ports
      --gpus gpu-request                 GPU devices to add to the container ('all' to pass all GPUs)
      --group-add list                   Add additional groups to join
      --health-cmd string                Command to run to check health
      --health-interval duration         Time between running the check (ms|s|m|h) (default 0s)
      --health-retries int               Consecutive failures needed to report unhealthy
      --health-start-interval duration   Time between running the check during the start period (ms|s|m|h) (default 0s)
      --health-start-period duration     Start period for the container to initialize before starting health-retries countdown (ms|s|m|h) (default 0s)
      --health-timeout duration          Maximum time to allow one check to run (ms|s|m|h) (default 0s)
      --help                             Print usage
  -i, --interactive                      Keep STDIN open even if not attached
      --ip string                        IPv4 address (e.g., 172.30.100.104)
      --ip6 string                       IPv6 address (e.g., 2001:db8::33)
      --ipc string                       IPC mode to use
      --isolation string                 Container isolation technology
      --kernel-memory bytes              Kernel memory limit
  -l, --label list                       Set meta data on a container
      --label-file list                  Read in a line delimited file of labels
      --link list                        Add link to another container
      --link-local-ip list               Container IPv4/IPv6 link-local addresses
      --log-driver string                Logging driver for the container
      --log-opt list                     Log driver options
      --mac-address string               Container MAC address (e.g., 92:d0:c6:0a:29:33)
  -m, --memory bytes                     Memory limit
      --memory-reservation bytes         Memory soft limit
      --memory-swap bytes                Swap limit equal to memory plus swap: '-1' to enable unlimited swap
      --memory-swappiness int            Tune container memory swappiness (0 to 100) (default -1)
      --mount mount                      Attach a filesystem mount to the container
      --name string                      Assign a name to the container
      --network network                  Connect a container to a network
      --network-alias list               Add network-scoped alias for the container
      --no-healthcheck                   Disable any container-specified HEALTHCHECK
      --oom-kill-disable                 Disable OOM Killer
      --oom-score-adj int                Tune host's OOM preferences (-1000 to 1000)
      --pid string                       PID namespace to use
      --pids-limit int                   Tune container pids limit (set -1 for unlimited)
      --platform string                  Set platform if server is multi-platform capable
      --privileged                       Give extended privileges to this container
  -p, --publish list                     Publish a container's port(s) to the host
  -P, --publish-all                      Publish all exposed ports to random ports
      --pull string                      Pull image before running ("always", "missing", "never") (default "missing")
  -q, --quiet                            Suppress the pull output
      --read-only                        Mount the container's root filesystem as read only
      --restart string                   Restart policy to apply when a container exits (default "no")
      --rm                               Automatically remove the container and its associated anonymous volumes when it exits
      --runtime string                   Runtime to use for this container
      --security-opt list                Security Options
      --shm-size bytes                   Size of /dev/shm
      --sig-proxy                        Proxy received signals to the process (default true)
      --stop-signal string               Signal to stop the container
      --stop-timeout int                 Timeout (in seconds) to stop a container
      --storage-opt list                 Storage driver options for the container
      --sysctl map                       Sysctl options (default map[])
      --tmpfs list                       Mount a tmpfs directory
  -t, --tty                              Allocate a pseudo-TTY
      --ulimit ulimit                    Ulimit options (default [])
  -u, --user string                      Username or UID (format: <name|uid>[:<group|gid>])
      --userns string                    User namespace to use
      --uts string                       UTS namespace to use
  -v, --volume list                      Bind mount a volume
      --volume-driver string             Optional volume driver for the container
      --volumes-from list                Mount volumes from the specified container(s)
  -w, --workdir string                   Working directory inside the container
```

# micellaneous
镜像操作
查找镜像： docker search [OPTIONS] TERM 
拉取镜像： docker pull [OPTIONS] NAME[:TAG|@DIGEST] 
列出镜像： docker images [OPTIONS] 
删除镜像： docker rmi [OPTIONS] IMAGE [IMAGE...] 
构建镜像： docker build [OPTIONS] PATH | URL | - 

容器操作
运行容器： docker run [OPTIONS] IMAGE [COMMAND] [ARG...] 
列出容器： docker ps [OPTIONS] 
停止容器： docker stop [OPTIONS] CONTAINER [CONTAINER...] 
启动容器： docker start [OPTIONS] CONTAINER [CONTAINER...] 
重启容器： docker restart [OPTIONS] CONTAINER [CONTAINER...] 
删除容器： docker rm [OPTIONS] CONTAINER [CONTAINER...] 
进入容器： docker exec -it CONTAINER COMMAND [ARG...] 
查看容器日志： docker logs [OPTIONS] CONTAINER 

网络操作
列出网络： docker network ls 
创建网络： docker network create [OPTIONS] NETWORK 
删除网络： docker network rm NETWORK [NETWORK...] 

卷操作
列出卷： docker volume ls 
创建卷： docker volume create [OPTIONS] VOLUME 
删除卷： docker volume rm [OPTIONS] VOLUME [VOLUME...] 
