// 调试模式开关
var ifDebug = false;

var server = require("./node_server/server");
var router = require("./node_server/router");

server.start(router.route);
