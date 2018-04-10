// 调试模式开关
var ifDebug = false;

var http = require('http');
var url = require('url');
var fs = require('fs');
var ft = require('./fileTraversal');
var PORT = null;

var appjson = JSON.parse(fs.readFileSync('./app.json'));

if(appjson.port) {
  PORT = appjson.port;
} else {
  console.log('配置文件 app.json 中 port 属性缺失，端口号设为默认值3000');
  PORT = 3000;
}


var baseUrl = "datas/";
var fileName= baseUrl + "mirrors.json";
var mirData=JSON.parse(fs.readFileSync(fileName));

function start(route, handle) {


  function onRequest (req, res) {
    var pathname = url.parse(req.url).pathname;
    if (ifDebug) console.log("Request for " + pathname + " received.");

    // console.log(pathname);

    // 静态资源服务器 (Assets server)
    if(pathname.indexOf('/mirrors') == 0 && pathname.indexOf('.') != -1) {
      var stream = fs.createReadStream('.' + pathname, {flags : "r", encoding : null});
      stream.on("error", function() {
        res.writeHead(404);
        res.end();
      });
      stream.pipe(res);
      return stream;
    }
    // 静态资源服务器 (Assets server)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    // res.writeHead(200, {'Content-type':'text/html;charset=utf-8'});
    res.writeHead(200);
    var content = route(handle, pathname);

    res.write(content);

    res.end();
  }


  var app = http.createServer(onRequest);
  var io = require('socket.io')(app);
  app.listen(PORT);
  if (ifDebug) console.log("Server has started.");





  // socket.io listeners
  io.on('connection', function (socket) {
    // 记录日志
    if (ifDebug) console.log('New connection.');


    socket.on('data', function(data){
      switch(data.type){
        case "mirrors":
        {
          socket.emit('data',{"type":"mirrors","datas":mirData});
        }
        break;

        case "mirrorsDir":
        {
          var datas = [];
          if(data.path == undefined)
            datas = ft.fileTraversal('./mirrors');
          else {
            datas = ft.fileTraversal('.' + data.path);
          }
          socket.emit('data',{"type":"mirrorsDir", "datas":datas});
        }
        break;
      }
    });
  });
}


exports.start = start;