var db = require(__dirname+"/db")
var exit = require(__dirname+"/exit");


function Match(u1, u2){
  this.u1 = u1;
  this.u2 = u2;
  this.state = "ready";
  this.lag = Math.max(db.users[u1].lagtime, db.users[u2].lagtime);
  this.id = u2;
  db.users[u1].match = u2;
  db.users[u2].match = u2;
  this.broadcast("finder",{cmd:"found"})
  this.timeouts = {};
  this.reset();
}

Match.prototype.reset = function(){
  this.ready = {u1:false,u2:false};
  this.moves = {u1:0,u2:0};
  var match = this;
  this.timeouts.waited = setTimeout(function(){
    delete match.timeouts.waited;
    for(var i in match.ready){
      if(match.ready[i] === false){
        console.log("not ready: "+this[i]);
        return exit(db.users[this[i]].socket, "You weren't ready");
      }
    }
  },30000);
}

Match.prototype.userReady = function(user){
  if(this.state != "ready")
    return;
  this.ready[this.u(user)] = true;
  if(this.ready[this.nu(user)])
    this.allReady();
}
Match.prototype.allReady = function(){
  clearTimeout(this.timeouts.waited)
  delete this.timeouts.waited;
  var st = Date.now()+this.lag+2000+100;
  this.reset();
  this.broadcast("ingame",{cmd:"countdown",timeout:st})
  this.state = "inbetween";
  var match = this;
  console.log("this.lag: "+this.lag);
  this.timeouts.start = setTimeout(function(){
    delete match.timeouts.start;
    match.broadcast("ingame",{cmd:"start",timeout:st+3000});
  },2000+100)
  this.timeouts.action = setTimeout(function(){
    delete match.timeouts.action
    match.state = "action";
    console.log("state attempting to be action")
  },this.lag+2000+100);
  this.timeouts.finish = setTimeout(function(){
    delete match.timeouts.finish
    match.finish();
  },this.lag+5000+100)
}

Match.prototype.move = function(user,data){
  if(this.state != "action")
    return;
  console.log("state was action")
  this.moves[this.u(user)] = data.value;
}

Match.prototype.finish = function(){
  this.state = "ready";
  this.broadcast("ingame",{cmd:"results",u1:this.moves.u1,u2:this.moves.u2});
  for(var i in this.moves){
    if(this.moves[i] === 0)
      return exit(db.users[this[i]].socket, "No Move");
  }
  this.reset();

}

Match.prototype.u = function(user){
  return (user == this.id)?"u2":"u1";
}
Match.prototype.nu = function(user){
  return (user == this.id)?"u1":"u2";
}

Match.prototype.broadcast = function(ns,data){
  if("timeout" in data){
    data.timeout += db.users[this.u1].offset;
    db.users[this.u1].socket.emit(ns,data);
    data.timeout += db.users[this.u2].offset-db.users[this.u1].offset;
    db.users[this.u2].socket.emit(ns,data);
  }else if("u1" in data){
    data.you = data.u1;
    data.opp = data.u2;
    delete data.u1;
    delete data.u2;
    db.users[this.u1].socket.emit(ns,data);
    var temp = data.you;
    data.you = data.opp;
    data.opp = temp;
    db.users[this.u2].socket.emit(ns,data);
  }else{
    db.users[this.u2].socket.emit(ns,data);
    db.users[this.u1].socket.emit(ns,data);
  }
}

Match.prototype.delete = function(){
  for(var i in this.timeouts){
    clearTimeout(this.timeouts[i]);
  }
}


module.exports = Match;
