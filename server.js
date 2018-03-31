// 调试模式开关
var ifDebug = false;

var http = require('http');
var url = require('url');
var fs = require('fs');
var PORT = 3000;



var baseUrl = "mirrors\\";
var fileName="mirrors\\mirrors.json";
var mirData=JSON.parse(fs.readFileSync(fileName));

function start(route, handle) {


  function onRequest (req, res) {
    var pathname = url.parse(req.url).pathname;
    if (ifDebug) console.log("Request for " + pathname + " received.");

    route(handle, pathname);

    res.writeHead(200, {'Content-type':'text/html;charset=utf-8'});
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
        case "details":
        {
          var filePath = baseUrl + data.name + '\\' + data.name + '.json';
          if(ifDebug) console.log(filePath);
          fs.readFile(filePath, (err, fd) => {
            if (err) {
              if (err.code === 'ENOENT') {
                console.error('file does not exist:');
                return;
              }
              throw err;
            }
            socket.emit('data',{"type":"details","datas":JSON.parse(fd)});
          });
        }
        break;
      }
    });
  });
}


exports.start = start;











// function showPager(path, status) {
//   var content = fs.readFileSync(path);
//   res.writeHead(status, {'Content-type':'text/html;charset=utf-8'});
//   res.write(content);
//   res.end();
// }

// switch(pathname) {
//   case '/':
//   case '/index':
//   case '/index.html':
//     showPager('./index.html', 200);
//     break;
//   case '/downloads':
//   case '/downloads.html':
//     showPager('./downloads.html', 200);
//     break;
//   case 'help':
//   case 'help.html':
//     showPager('./help.html', 200);
//     break;
//   default:
//     showPager('./404.html', 200);
//     break;
// }