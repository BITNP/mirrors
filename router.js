// 调试模式开关
var ifDebug = false;

var fs = require('fs');

// 路由文件缓存，缓冲经常修改的动态资源，如，图片
var buffer = {};


// 设置文件缓存过期时间
setInterval(clearBuffer,10*60*1000);

function clearBuffer(){
	buffer = {};
}


function route(handle, pathname) {
	if (ifDebug) console.log("About to route a request for " + pathname);
	if(typeof handle[pathname] === 'function') {
		return handle[pathname]();
	}else{
		try{
			if (ifDebug) console.log(pathname);
			if (buffer[pathname]) {
				return buffer[pathname];
			} else if((pathname.indexOf('/mirrors/') == 0 || pathname == '/mirrors') && pathname.indexOf('.') == -1) { // 访问 /mirrors 文件夹下的静态资源
				return buffer.mirrors || (buffer.mirrors = fs.readFileSync('./listMirrors.html'));
			} else if(pathname.indexOf('socket.io') != -1) { // 动态地址访问静态资源临时补丁
				if (ifDebug) console.log('aaa');
				return buffer.socketio || (buffer.socketio = fs.readFileSync('./js/socket.io-2.0.3.js'));
			} else if(pathname.indexOf('functions') != -1) { // 动态地址访问静态资源临时补丁
				if (ifDebug) console.log('bbb');
				return buffer.functions || (buffer.functions = fs.readFileSync('./js/functions.js'));
			} else if(pathname.indexOf('jquery') != -1) { // 动态地址访问静态资源临时补丁
				if (ifDebug) console.log('ccc');
				return buffer.jquery || (buffer.jquery = fs.readFileSync('./js/jquery-3.2.1.min.js'));
			}
			else {
				buffer[pathname] = fs.readFileSync('.'+pathname);
				return buffer[pathname];
			}
		}
		catch(err) {
			if (ifDebug) console.log("No request hadler found for " + pathname);
			return buffer.notFound || (buffer.notFound = fs.readFileSync('./404.html'));
		}
	}

}

exports.route = route;