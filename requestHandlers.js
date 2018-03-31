// 调试模式开关
var ifDebug = false;

var fs = require('fs');

// 路由文件缓存，缓存不经常修改的文件资源，如 HTML 文件
var buffer = {};
buffer.js = {};
buffer.css = {};


// 设置文件缓存过期时间
setInterval(clearBuffer,30*60*1000);

function clearBuffer(){
	buffer = {};
	buffer.js = {};
	buffer.css = {};
}

// Pages
exports.help	=	() => {return buffer.help || (buffer.help = fs.readFileSync('./help.html'))};
exports.index	=	() => {return buffer.index || (buffer.index = fs.readFileSync('./index.html'))};
exports.downloads=	() => {return buffer.downloads || (buffer.downloads = fs.readFileSync('./downloads.html'))};
exports.details =	() => {return buffer.details || (buffer.details = fs.readFileSync('./mirrors/details.html'))};


// Assets
exports.js = {};
exports.js.socketIO=	() => {return buffer.js.socketIO || (buffer.js.socketIO = fs.readFileSync('./js/socket.io-2.0.3.js'))};
exports.js.functions =	() => {return buffer.js.functions || (buffer.js.functions = fs.readFileSync('./js/functions.js'))};
exports.js.jquery=		() => {return buffer.js.jquery	|| (buffer.js.jquery = fs.readFileSync('./js/jquery-3.2.1.min.js'))};

