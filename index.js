global.__root = __dirname;
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require("fs");
var os = require("os");

app.use(express.static(__root + '/public'));
app.get(/^\/?bc\/.*/,require(__root+"/framework/bower_static.js"));

app.get('/', function(req, res){
  res.sendFile(__root+'/framework/index.html');
});
app.use(function(err, req, res, next){
  if(err)
    return res
      .status(500)
      .set('Content-Type', 'text/plain')
      .send(err.stack);
  res
    .status(400)
    .set('Content-Type', 'text/plain')
    .send(req.originalUrl+" not found");
});
var files = fs.readdirSync(__root +"/logic/");

function setupSocketRoute(socket,name){
  var smaller = name.substring(0,name.length-3);
  socket.on(smaller,function(msg){
    console.log("hit: "+smaller)
    require(__root+"/logic/"+name)(socket,msg);
  });
}

io.on('connection', function(socket){
  console.log('a user connected');
  for(var i=0;i<files.length;i++)
    setupSocketRoute(socket,files[i]);
  socket.on('chat message', function(msg){
    console.log("message");
    io.emit('chat message', msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
    require(__root+"/logic/exit.js")(socket);
  });
});
server.listen(3000);

console.log('Server running at http://'+os.hostname()+':'+3000);
