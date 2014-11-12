var db = require(__dirname+"/db.js")

module.exports = function(socket,data){
  if(!(socket.id in db.users))
    return;
  if(db.users[socket.id].match === false)
    return;
  var matchid = db.users[socket.id].match;
  var match = db.matches[matchid];

  if(data.cmd == "ready"){
    if(match.state != "ready") return;
    return match.userReady(socket.id);
  }
  if(data.cmd == "move"){
    console.log("move: "+JSON.stringify(data));
    return match.move(socket.id,data);
  }
  if(data.cmd == "results"){
    if(match.state != "ready") return;
    var ret = {
      cmd:"results",
      you:match.move[match.u(socket.id)],
      opp:match.move[match.nu(socket.id)]
    };
    socket.emit("ingame", ret);
  }
}
