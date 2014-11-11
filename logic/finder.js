var db = require(__dirname+"/db.js");

module.exports = function(socket, data){
    console.log("finder: "+data.cmd)
    console.log(JSON.stringify(data));
    if(data.cmd == "enter"){
      db.users[socket.id] = {id:socket.id,socket:socket,match:false}
      return;
    }
    if(!(socket.id in db.users))
      socket.emit("finder", {cmd:"cancel"});

    if(data.cmd == "ping"){
      data.recieved = Date.now();
      return socket.emit("finder", data);
    }
    if(data.cmd == "info"){
      if(data.lagtime > 500){
        require(__dirname+"/exit")(socket);
        return socket.emit("exit")
      }
      db.users[socket.id].offset = data.offset;
      db.users[socket.id].lagtime = data.lagtime;
    }
    if(data.cmd == "looking"){
      if(db.unmatched.length == 0){
        db.unmatched.push(socket.id);
      }else{
        var u2 = db.unmatched.shift();
        db.matches[u2] = {u1:socket.id, u2:u2,state:"ready",ready:{},move:{}};
        db.matches[u2].lag = Math.max(db.users[socket.id].lagtime, db.users[u2].lagtime);
        db.users[socket.id].match = u2;
        db.users[u2].match = u2;
        db.users[u2].socket.emit("finder",{cmd:"found"});
        socket.emit("finder",{cmd:"found"});
      }
    }
  }
