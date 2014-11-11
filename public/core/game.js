var scenes = []; //The scenes that will exist


function Game(container, socket, scenes){
  if(!socket) throw  new Error("you require a socket");
	if(!container) throw  new Error("We need a container");
	if(!scenes) throw  new Error("We need to know what scenes we have");
  this.socket = socket;
  this.container = $(container); //This will hold the HTML of our scenes
  this.sharedData = {}; //This is data that will be shared by all scenes
  this.sceneBackLog = [] //This contains scenes that are minimized (to retain info)
  this.currentScene = void(0); //this is our current scene
	this.scenes = {};
	var that = this;
	var done = 0;
	for(var i=0;i<scenes.length;i++){ //for each scene initialize
		this.addScene(scenes[i],function(){
			done++;
			if(done == scenes.length){ //whene we’ve loaded all of them
        var first = scenes.shift();
        console.log(first);
        that.currentScene = new that.scenes[first](that);
			}
		})
	}
}

Game.prototype.addScene = function(scene, next){
	if(typeof scene == "string")
		scene = window[scene];
  var that = this;
	jQuery.ajax({url:scene.innerHTML, dataType:"text"}).done(function(data){
		scene.innerHTML = data;
		that.scenes[scene.prototype.constructor.name] = scene;
		next();
	});
}

Game.prototype.setScene = function(new_scene, type){
    if(typeof type == "undefined" || type == 0)
   	 this.currentScene.close();
    else if(type == -1){
   	 this.currentScene.close();
   	 for(var i=0;i<this.sceneBackLog.length;i++){
   		 this.sceneBackLog[i].close();
   	 }
   	 this.sceneBackLog = [];
    }else if(type == 1)
   	 this.sceneBackLog.push(this.currentScene.hide());
    if(typeof new_scene == "undefined")
   	 this.currentScene = this.sceneBackLog.pop().show();
    else
       this.currentScene = new this.scenes[new_scene](this);
};
