// 调试模式开关
var ifDebug = true;

var fs = require('fs');
var render = require('./render');
// 缓存区
var buffer = {};

// 设置文件缓存过期时间
setInterval(clearBuffer,10*60*1000);

function clearBuffer(){
	buffer = {};
}

String.prototype.in_array = function(arr) { for(item in arr) if(this == arr[item]) return true; return false; };

function route(pathname) {
	if (ifDebug) console.log("About to route a request for " + pathname);

	try{
		// 访问缓存
		if(buffer[pathname]) return buffer[pathname];

		if(pathname.in_array(['/', '/index', '/index/'])) 	return (buffer[pathname] = render.render(fs.readFileSync("./index.html")));
		// if(pathname.match(/^\/download/) != null) 			return (buffer[pathname] = render.render(fs.readFileSync("./download.html")));
		if(pathname.match(/^\/help/) != null) 				return (buffer[pathname] = render.render(fs.readFileSync("./help.html")));
		if(pathname.match(/^\/mirror/) != null) 			return (buffer[pathname] = render.render(fs.readFileSync("./mirror.html")));

		buffer[pathname] = fs.readFileSync('.'+pathname);
		return buffer[pathname];
	}
	catch(err) {
		// 加载默认图片
		if (pathname.match(/(\.jpg)|(\.png)/) != null) return buffer.defaultImg || (buffer.defaultImg = fs.readFileSync('./Assets/img/default.png'));
		// 加载默认帮助文件
		if (pathname.match(/\.md/) != null) return buffer.defaultMD || (buffer.defaultMD = fs.readFileSync('./_help/error.md'));

		if (ifDebug) console.log("No request handler found for " + pathname);
		return buffer.notFound || (buffer.notFound = render.render(fs.readFileSync('./404.html')));
	}
}

exports.route = route;
