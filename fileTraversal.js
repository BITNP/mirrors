// debug
var ifDebug = false;

var fs = require('fs');

// 缓存池
var buffer = {};

// 设置文件缓存过期时间
setInterval(clearBuffer,10*60*1000); // 10 mins

function clearBuffer(){
  buffer = {};
}


function fileTraversal(path){
  if(buffer[path]) {
    return buffer[path];
  }
  var dirList = fs.readdirSync(path);
  var list = [];

  dirList.forEach(function(item){
    var handler = fs.statSync(path + '/' + item);
    if(handler.isDirectory()) {
      var obj = {};
      obj.path = item;
      obj.type = "directory";
      list.push(obj);
    }
    else {
      var obj = {};
      obj.path = item;
      obj.type = "file";
      obj.size = handler.size;
      obj.mtime = handler.mtime;
      list.push(obj);
    }
  });
  buffer[path] = list;
  return list;
}



if (ifDebug) {
  var fileList = [];
  fileList = fileTraversal('./mirrors/');
  console.log(buffer);
}

exports.fileTraversal = fileTraversal;