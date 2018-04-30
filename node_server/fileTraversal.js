/* 运行模式 */
var mode = 'release';
var fs = require('fs');
var appjson = JSON.parse(fs.readFileSync('./app.json'));
mode = appjson.mode;


/* 缓存池 */
var buffer = {};

/* 设置文件缓存过期时间 */
setInterval(clearBuffer,10*60*1000); /* 10 mins */

function clearBuffer(){
  buffer = {};
}

function fsExistsSync(path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}

function fileTraversal(path){
  if(!fsExistsSync(path)) {
    return -1;
  }
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
      obj.help = hasHelp(obj.path);
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


var helpList = [];
helpList = fileTraversal('./_help');

function hasHelp(path) {
  for(item in helpList) {
    if(path + '.md' == helpList[item].path) return true;
  }
  return false;
}

if (mode == 'debug') {
  var fileList = [];
  fileList = fileTraversal('../mirror/deepin');
  console.log(fileList);
}

exports.fileTraversal = fileTraversal;