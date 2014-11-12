var db = require(__dirname+"/db.js");


module.exports = function(socket,reason){
  if(!(socket.id in db.users))
    return;
  if(db.users[socket.id].match !== false){
    match = db.users[socket.id].match;
    if(match in db.matches){
      db.matches[match].delete();
      var not_user = (socket.id == match)?"u1":"u2";
      not_user = db.users[db.matches[match][not_user]];
      not_user.socket.emit("exit", "opp");
      delete db.matches[match];
    }
    db.users[socket.id].match = false;
  }else if(db.unmatched[0] == socket.id){
    db.unmatched.shift();
  }
  delete db.users[socket.id];
  if(reason)
    return socket.emit("exit",reason)
}
