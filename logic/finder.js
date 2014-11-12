var db = require(__dirname+"/db.js");
var Match = require(__dirname+"/match");
var exit = require(__dirname+"/exit");

var LIMIT = 20;

function ping(user){
  user.ping.offsets = [];
  user.ping.done = 0;
  user.offset = 0;
  user.lagtime = 0;

  for(var i=0;i<LIMIT;i++){
    var n = Date.now();
    user.ping.offsets.push({start:n});
    user.socket.emit("finder", {cmd:"ping",i:i});
  }
}

function pong(user, data){
  var offsets = user.ping.offsets;
  var requesttime = (Date.now() - offsets[data.i].start)/2;
  user.lagtime += requesttime;
  user.offset += offsets[data.i].start+requesttime - parseInt(data.recieved);
  offsets[data.i].end = Date.now();
  if(user.ping.done != data.i) console.log("out of order");

  user.ping.done++;

  if(user.ping.done >= LIMIT) pingFin(user);
}

function pingFin(user){
  user.lagtime = Math.round(user.lagtime/LIMIT);
  user.offset = Math.round(user.offset/LIMIT);
  if(user.lagtime > 500){
    exit(socket, "Your Connection is too Slow");
  }
  return look(user);
}


function look(user){
  if(db.unmatched.length == 0){
    db.unmatched.push(user.id);
    user.socket.emit(
      "finder",
      {cmd:"looking", offset: user.offset, lagtime: user.lagtime }
    );
    user.timeout = setTimeout(function(){
      exit(user.socket,"Timed Out From Finder");
    }, 10000);
  }else{
    var u2 = db.unmatched.shift();
    clearTimeout(db.users[u2].timeout);
    db.matches[u2] = new Match(user.id,u2);
  }
}

module.exports = function(socket, data){
  if(data.cmd == "enter"){
    if(socket.id in db.users){
      exit(socket);
    }
    db.users[socket.id] = {id:socket.id,socket:socket,match:false,ping:{}}
    return process.nextTick(function(){
      ping(db.users[socket.id])
    })
  }
  if(!(socket.id in db.users)){
    return
  }
  if(data.cmd == "ping"){
    pong(db.users[socket.id],data);
  }
}
