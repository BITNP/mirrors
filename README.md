# 本网站是北京理工大学开源软件镜像站go版本

## 线上demo地址
前端
http://m.zhanzhinet.com:9000
go服务器地址
http://m.zhanzhinet.com:9090

## 本地运行demo

> 安装 go

```
// 先前往 server.go 文件第47行修改扫描的目录
go run server.go
```

切换到另一个窗口

> 安装 nodejs

```
yum install nodejs
```

> 安装依赖
```nodejs
npm install
```
> 启动
```
// 请先前往 public/js/mirror.js 第13行修改服务器地址，即go服务的地址
node app.js
```
> 镜像的根目录为 mirror 文件夹，请将镜像放置于此，如无 mirror 文件夹，自行创建即可