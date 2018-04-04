// debug
var ifDebug = false;

var fs = require('fs');


function fileTraversal(path){
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

  return list;
}



if (ifDebug) {
  var fileList = [];
  fileList = fileTraversal('./mirrors/deepin/testFolder');
  // console.log(fileList);
}

exports.fileTraversal = fileTraversal;