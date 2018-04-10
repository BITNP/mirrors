// 调试模式开关
var ifDebug = false;
var fs = require('fs');
var protocol = null;
var PORT = null;

var appjson = JSON.parse(fs.readFileSync('./app.json'));
protocol = appjson.protocol?appjson.protocol:"http";
PORT = appjson.port?appjson.port:3000;




function render(page) {
	if (typeof page != 'string') {
		page = page.toString();
	}
	let reg = /{{(.*?)}}/g;
	let data = page.match(reg, 'page');
	var output = page;
	if(ifDebug) console.log(data);
	for(item in data) {
		if(data[item].indexOf('IPAddress') != -1) {
			output = output.replace(data[item], protocol + '://' + getIPAddress() + ':' + PORT);
		} else if(data[item].indexOf('template') != -1) {
			var htmlname = data[item].match(/{{\s*template\s+(\S+)\s*}}/, data[item]);
			output = output.replace(data[item], fs.readFileSync('./template/' + htmlname[1] + '.html') || '');
		} else if(data[item].indexOf('js') != -1) {
			var jsname = data[item].match(/{{\s*js\s+(\S+)\s*}}/, data[item]);
			output = output.replace(data[item], protocol + '://' + getIPAddress() + ':' + PORT + '/js/' + jsname[1] + '.js');
		} else if(data[item].indexOf('css') != -1) {
			var cssname = data[item].match(/{{\s*css\s+(\S+)\s*}}/, data[item]);
			output = output.replace(data[item], protocol + '://' + getIPAddress() + ':' + PORT + '/css/' + cssname[1] + '.css');
		}
	}
	return output;
}



function getIPAddress(){  
    var interfaces = require('os').networkInterfaces();  
    for(var devName in interfaces){  
          var iface = interfaces[devName];  
          for(var i=0;i<iface.length;i++){  
               var alias = iface[i];  
               if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){  
                     return alias.address;  
               }  
          }  
    }  
}


if(ifDebug) {
	// var page = '{{IPAddress}} &&&& {{ js jquery.min }} &&&& {{IPAddress}}</a>';
	var page = '<script src="{{ js jquery.min }}"></script>'
	var output = render(page);
	console.log(output);
	console.log(getIPAddress());
}

exports.render = render;