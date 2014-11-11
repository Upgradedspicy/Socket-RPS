var db = require(__dirname+"/db.js")

module.exports = function(socket,data){
  if(!(socket.id in db.users))
    return;
  if(db.users[socket.id].match === false)
    return;
  var matchid = db.users[socket.id].match;
  var match = db.matches[matchid];
  var user = (socket.id == matchid)?"u2":"u1";
  var not_user = (socket.id == matchid)?"u1":"u2";
  var uob = db.users[match[user]];
  var nob = db.users[match[not_user]];

  console.log("ingame: "+data.cmd);
  if(data.cmd == "ready"){
    if(match.state != "ready")
      return;
    match.ready[user] = true;
    console.log(JSON.stringify(db.matches[matchid]));
    if(match.ready[not_user]){
      console.log("Ready to rock");
      var now = Date.now()+match.lag+2000+100;
      match.ready = {};
      match.move = {};
      uob.socket.emit("ingame",{
        cmd:"countdown",
        timeout:now+uob.offset
      });
      nob.socket.emit("ingame",{
        cmd:"countdown",
        timeout:now+nob.offset
      });
      match.state = "inbetween";
      setTimeout(function(){
        uob.socket.emit("ingame",{
          cmd:"start",
          timeout:now+uob.offset+3000
        });
        nob.socket.emit("ingame",{
          cmd:"start",
          timeout:now+nob.offset+3000
        });
      },2000+100)
      setTimeout(function(){
        match.state = "action";
      },match.lag+2000+100);

      setTimeout(function(){
        match.state = "ready";
        if(typeof match.move[user] == "undefined")
          require(__dirname+"exit")(uob.socket);
        else{
          var ret = {cmd:"results",you:match.move[user],opp:match.move[not_user]}
          uob.socket.emit("ingame", ret);
        }
        if(typeof match.move[not_user] == "undefined"){
          require(__dirname+"/exit")(nob.socket);
        }else{
          ret = {cmd:"results",you:match.move[not_user],opp:match.move[user]}
          nob.socket.emit("ingame", ret);
        }
      },match.lag+5000+100)
    }
    return;
  }
  if(data.cmd == "move"){
    if(match.state != "action")
      return;
    match.move[user] = data.value;
  }
  if(data.cmd == "results"){
    if(match.state != "ready")
      return;
    var ret = {cmd:"results",you:match.move[user],opp:match.move[not_user]}
    socket.emit("ingame", ret);
  }
}
