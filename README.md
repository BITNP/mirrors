# 本网站是北京理工大学开源软件镜像站apache版本

## 运行demo

> 安装apache服务器，并开启目录检索服务
>
> 修改 properties中的 apache_sesrver 字段，将其改为相应的apache服务器地址
>
> 不要对目录检索界面做自定义操作
```
# httpd.conf 设置参考（apache服务器）

# 将node服务器文件下的mirror文件夹作为目录检索的根目录
DocumentRoot "D:\myproducts\ProgramLanguages\github\mirrors_front_end/mirror"
<Directory "D:\myproducts\ProgramLanguages\github\mirrors_front_end/mirror">
    
    Options Indexes FollowSymLinks MultiViews

    MultiviewsMatch Any

    IndexOrderDefault Descending Date

    IndexOptions NameWidth=100 Charset=UTF-8 FancyIndexing FoldersFirst

    AllowOverride None
    
    Require all granted
</Directory>
```

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
node app.js
```
> 镜像的根目录为 mirror 文件夹，请将镜像放置于此，如无 mirror 文件夹，自行创建即可

> 当前版本为基础版本，由于apache的限制，检索功能暂时不可用，将于下一次魔改后提交