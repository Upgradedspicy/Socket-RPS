function title_scene(game){
  Scene.apply(this, [game, title_scene.innerHTML]);
  this.elem.find("button").click(function(e){
    game.setScene("finder_scene");
  });
  if(!(this.game.sharedData.init)){
    game.socket.on("disconnect",function(){
      game.setScene("title_scene");
      game.currentScene.elem.find(".reason").text("Server Disconnected");
      game.currentScene.elem.find("button").prop("disabled","disabled");
    })
    game.socket.on("connect",function(){
      game.setScene("title_scene");
      game.currentScene.elem.find(".reason").text("Ready to Roll");
    });
    game.socket.on("exit",function(data){
      if(data == "opp"){
        return game.setScene("finder_scene");
      }
      game.setScene("title_scene");
      game.currentScene.elem.find(".reason").text(JSON.stringify(data));
    });
    game.exit = function(reason){
      game.socket.emit("exit");
      game.setScene("title_scene");
      game.currentScene.elem.find(".reason").text(reason);
    }
    this.game.sharedData.init = true;
  }
}
title_scene.prototype = Object.create(Scene.prototype);
title_scene.prototype.constructor = title_scene;
title_scene.innerHTML = "logic/title/title.fragment.html"; //where is our HTML file?
