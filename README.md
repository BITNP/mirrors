# mirrors

环境要求:
node.js
安装socket.IO模块

如何运行

启动服务器
node index.js

配置端口(server.js):默认为 3000





img 	主页的图片，大小为450x300，格式为png

js		客户端静态js文件

mirrors	内含镜像

mirrors.json 	所有镜像的信息

index.js 	服务器启动入口

server.js 	服务器主文件

router.js 	服务器路由配置 (带路由文件缓存，10分钟清理一次)

requestHandlers.js 	服务器路由 (带路由文件缓存, 30分钟清理一次)