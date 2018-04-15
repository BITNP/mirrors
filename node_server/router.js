/* 运行模式 */
var mode = 'release';
var fs = require('fs');
var appjson = JSON.parse(fs.readFileSync('./app.json'));
mode = appjson.mode;

var render = require('./render');

var baseURL = './public/';
baseURL += (mode == 'debug')?"debug/":"release/";
if(mode == 'debug')console.log(baseURL);/* 缓存区 */
var buffer = {};

/* 设置文件缓存过期时间 */
setInterval(clearBuffer,10*60*1000);

function clearBuffer(){
	buffer = {};
}

function route(pathname) {
	if (mode == 'debug') console.log("About to route a request for " + pathname);

	try{
		/* 访问缓存 */
		if(buffer[pathname]) return buffer[pathname];

		if(pathname.in_array(['/', '/index', '/index/'])) 	return (buffer[pathname] = render.render(fs.readFileSync(baseURL + "index.html")));
		if(pathname.match(/^\/help/) != null) 				return (buffer[pathname] = render.render(fs.readFileSync(baseURL + "help.html")));
		if(pathname.match(/^\/mirror/) != null) 			return (buffer[pathname] = render.render(fs.readFileSync(baseURL + "mirror.html")));

		buffer[pathname] = fs.readFileSync('.'+pathname);
		return buffer[pathname];
	}
	catch(err) {
		/* 加载默认图片 */
		if (pathname.match(/(\.jpg)|(\.png)/) != null) return buffer.defaultImg || (buffer.defaultImg = fs.readFileSync('./Assets/img/default.png'));
		/* 加载默认帮助文件 */
		if (pathname.match(/\.md/) != null) return buffer.defaultMD || (buffer.defaultMD = fs.readFileSync('./_help/error.md'));

		if (mode == 'debug') console.log("No request handler found for " + pathname);
		return buffer.notFound || (buffer.notFound = render.render(fs.readFileSync(baseURL + '404.html')));
	}
}
String.prototype.in_array = function(arr) { for(item in arr) if(this == arr[item]) return true; return false; };
exports.route = route;
