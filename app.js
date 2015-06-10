var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var Myo = require('myo');

var myMyo = Myo.create();

app.use(express.static(__dirname + '/bower_components'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client) {  
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
    });

    myMyo.on('orientation', function(data){
      if(data.y < -0.4) {
        // console.log(data.y);        // for logging data
        client.emit('scroll', 'down');
      } else if(data.y > 0.1) {
        // console.log(data.y);       // for logging data
        client.emit('scroll', 'up');
      }
    });

    myMyo.on('fist', function(edge){
      client.emit('select', 'fist!');
    })

});

server.listen(4200);