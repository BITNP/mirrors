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
			}
			else {
				buffer[pathname] = fs.readFileSync('.'+pathname);
				return buffer[pathname];
			}
		}
		catch(err) {
			if (ifDebug) console.log("No request hadler found for " + pathname);
			return "404 NOT Found";
		}
	}

}

exports.route = route;