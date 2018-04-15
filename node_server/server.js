/* 调试模式开关 */
var mode = 'release';
var fs = require('fs');
var appjson = JSON.parse(fs.readFileSync('./app.json'));
mode = appjson.mode;

var http = require('http');
var url = require('url');
var ft = require('./fileTraversal');
var PORT = null;


if(appjson.port) {
  PORT = appjson.port;
} else {
  console.log('端口配置缺失，端口号设为默认值3000');
  PORT = 3000;
}


var baseUrl = "datas/";
var fileName= baseUrl + "mirrors.json";
var mirData=JSON.parse(fs.readFileSync(fileName));

function start(route) {


  function onRequest (req, res) {
    var pathname = url.parse(req.url).pathname;
    if (mode == 'debug') console.log("Request for " + pathname + " received.");

    /* 镜像资源下载服务器 (download server) */
    if(pathname.indexOf('/mirror') == 0 && pathname.indexOf('.') != -1) {
      var stream = fs.createReadStream('.' + pathname, {flags : "r", encoding : null});
      stream.on("error", function() {
        res.writeHead(404);
        res.end();
      });
      stream.pipe(res);
      return stream;
    }
    /* 镜像资源下载服务器 (download server) */
    /*  */
    /* 反向缓存权限设置 */
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    /* 反向缓存权限设置 */
    res.writeHead(200);
    var content = route(pathname);

    /* res.setHeader('Content-Type', 'text/plain'); */
    res.write(content);

    res.end();
  }
  
  var app = http.createServer(onRequest);
  var io = require('socket.io')(app);
  app.listen(PORT);
  console.log("--------------------------------");
  console.log("Server has started.");
  console.log("--------------------------------");

  /* socket.io listeners */
  io.on('connection', function (socket) {
    /* 记录日志 */
    if (mode == 'debug'){
      console.log("--------------------------------");
      console.log('New connection.');
      console.log("--------------------------------");
    } 


    socket.on('data', function(data){
      switch(data.type){
        case "mirrorDir": /* 获取镜像列表，基于文件目录 */
        {
          var datas = [];
          if(data.path == undefined)
            datas = ft.fileTraversal('./mirror');
          else {
            datas = ft.fileTraversal('.' + data.path);
          }
          socket.emit('data',{"type":"mirrorDir", "datas":datas});
          if (mode == 'debug'){
            console.log("--------------------------------");
            console.log('mirrorDir data sent.');
            console.log("--------------------------------");
          } 
        }
        break;

        case "mdlist": /* 获取帮助文件列表，基于文件目录 */
        {
          var datas = [];
          datas = ft.fileTraversal('./_help');
          socket.emit('data',{"type":"mdlist", "datas":datas});
          if (mode == 'debug'){
            console.log("--------------------------------");
            console.log('mdlist data sent.');
            console.log("--------------------------------");
          } 
        }
        break;
      }
    });
  });
}

exports.start = start;