var server = require("./node_server/server");
var router = require("./node_server/router");

server.start(router.route);