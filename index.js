var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var users = [];
var connections = [];

server.listen(process.env.PORT || 3000)

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

io.sockets.on('connection', function (socket) {
  connections.push(socket)

  socket.on('disconnect', function (data) {
    users.splice(users.indexOf(socket.username));
    disconnectedUser()
    connections.splice(connections.indexOf(socket), 1)
  })


  socket.on('msg', function (data, from) {
    io.sockets.emit('msg', { msg: data, user: socket.username });
  })

  socket.on('getUsername123', function (data) {
    // console.log(data)
    io.sockets.emit('getUsername123', socket.username);
  })

  socket.on('user', function (data, callBack) {
    callBack(true);
    socket.username = data;
    users.push(socket.username)
    io.sockets.emit('users', users);
    updateUsers()
  })


  function updateUsers() {
    io.sockets.emit('userName', socket.username)
  }

  function disconnectedUser() {
    io.sockets.emit('disconnectedUser', socket.username)
  }


})