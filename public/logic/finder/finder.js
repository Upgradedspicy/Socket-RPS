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
}
finder_scene.prototype = Object.create(Scene.prototype);
finder_scene.prototype.constructor = finder_scene;
finder_scene.prototype.enter = function(){
  var that = this;
  this.listen(function(data){
    if(data.cmd == "looking")
      return this.elem.find(".status").text("Looking for Opponent");
    if(data.cmd == "found")
      return this.game.setScene(("ingame_hand" in this.game.scenes)?"ingame_hand":"ingame_gui");
    if(data.cmd == "ping"){
      data.recieved = Date.now();
      return this.game.socket.emit("finder", data);
    }
  });
  this.elem.find(".status").text("Setting up your User");
  this.game.socket.emit("finder", {cmd:"enter"});
};
finder_scene.innerHTML = "logic/finder/finder.fragment.html";
