// 调试模式开关
var ifDebug = false;
var fs = require('fs');

var PORT = null;

var appjson = JSON.parse(fs.readFileSync('./app.json'));

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
		// if(ifDebug) console.log(data[item]);
		if(data[item].indexOf('IPAddress') != -1) {
			output = output.replace(data[item], getIPAddress());
		} else if(data[item].indexOf('js') != -1) {
			var jsname = data[item].match(/{{\s+js\s+(\S+)\s+}}/, data[item]);
			output = output.replace(data[item], 'http://' + getIPAddress() + ':' + PORT + '/js/' + jsname[1] + '.js');
		} else if(data[item].indexOf('css') != -1) {
			var jsname = data[item].match(/{{\s+css\s+(\S+)\s+}}/, data[item]);
			output = output.replace(data[item], 'http://' + getIPAddress() + ':' + PORT + '/css/' + jsname[1] + '.css');
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