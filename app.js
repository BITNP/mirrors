var path = require('path');
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var routes = require('./node_server/routes');

const handlebars = require('express3-handlebars').create({defaultLayout: 'main'});
app.use(express.static('public'));
app.engine('handlebars',handlebars.engine);
app.set('view engine', 'handlebars');


app.use('/', routes);


app.listen(port, function () {
  console.log("== Server is listening on port", port);
})
