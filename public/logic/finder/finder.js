function finder_scene(game){
  Scene.apply(this, [game, finder_scene.innerHTML]);
  this._csname = "finder";
  this.attempt = 0;
  var that = this;
  this.elem.find("button.cancel").click(function(){
    that.game.exit("Canceled");
  });
  this.state = 0;
  this.enter();
  this.on("close",function(){
    if(that.timeout)
      clearTimeout(that.timeout);
  });
}
finder_scene.prototype = Object.create(Scene.prototype);
finder_scene.prototype.constructor = finder_scene;
finder_scene.prototype.enter = function(){
  var that = this;
  this.elem.find(".status").text("Setting up your User");
  this.game.socket.emit("finder", {cmd:"enter"});
  this.offset = 0;
  this.lagtime = 0;
  this.attempt = 0;
  var that = this;
  var offsets = []
  var done = 0;
  this.listen(function(data){
    console.log("data: "+JSON.stringify(data));
    var requesttime = (Date.now() - offsets[data.i].start)/2;
    that.lagtime += requesttime;
    that.offset += offsets[data.i].start+requesttime - parseInt(data.recieved);
    offsets[data.i].end = data.recieved
    if(done != data.i) console.log("out of order");
    done++;
    if(done == 20){
      that.lagtime = Math.round(that.lagtime/done);
      that.offset = Math.round(that.offset/done);
      that.elem.find(".status").text("Looking for Opponent");
      that.game.socket.emit(
        "finder",
        {cmd:"info", offset: that.offset, lagtime: that.lagtime }
      );
      that.playerLookLoop(0);
    }
  });
  for(var i=0;i<20;i++){
    var n = Date.now();
    offsets.push({start:n});
    this.elem.find(".status").text("Pinging: ["+offsets.length+", "+done+"]");
    this.game.socket.emit("finder", {cmd:"ping",i:i});
  }
};
finder_scene.prototype.playerLookLoop = function(data){
  this.listen(function(data){
    if(data.cmd == "found")
      this.game.setScene(("ingame_hand" in this.game.scenes)?"ingame_hand":"ingame_gui");
  });
  that = this;
  this.timeout = setTimeout(function(){
    that.game.exit("Timed Out From Finder");
  }, 10000);
  this.game.socket.emit("finder", {cmd:"looking"});
};
finder_scene.innerHTML = "logic/finder/finder.fragment.html";
