var express = require('express');
var http = require('http');
var app = express();
var port = process.env.PORT || 3000;
var server = http.Server(app);
server.listen(port);

app.use(express.static(__dirname + '/public'));

console.log('listening on ' + port);