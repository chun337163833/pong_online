var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var list = {};

app.use(express.static('/root/pong_server'));
io.on('connection', function(socket) {
  //console.log('connected');
  var code;
  var oppId;
  socket.on('disconnect', function() {
    //console.log('disconnected');
    if (code) {
      if (list[code]) {
	if (list[code].length == 2) {
	  list[code][oppId].emit('oppoff', '');
	}
      }
      delete list[code];
    }
  });
  socket.on('login', function(msg) {
    //console.log('login: ' + msg);
    if (list[msg]) {
      if (list[msg].length === 1) {
	code = msg;
        oppId = 0;
	list[msg].push(socket);
	socket.emit('start', '2');
	list[msg][oppId].emit('start', '1');
      } else if (list[msg].length === 2) {
	socket.emit('dup', '');
      } 
    } else {
      code = msg;
      oppId = 1;
      list[msg] = [];
      list[msg].push(socket);
      socket.emit('wait', '');
    }
  });
  socket.on('ball', function(msg) {
    if (list[code]) {
      list[code][oppId].emit('ball', msg);
    }
  });
  socket.on('pos', function(msg) {
    if (list[code]) {
      list[code][oppId].emit('pos', msg);
    }
  });
  socket.on('end', function(msg) {
    if (list[code]) {
      if (msg == 'win') {
	list[code][oppId].emit('end', 'lose');
      } else {
	list[code][oppId].emit('end', 'win');
      }
    }
  });
});
http.listen(8080);
