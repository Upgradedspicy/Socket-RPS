function ingame_gui(game){
	Scene.apply(this, [game, ingame_gui.innerHTML]);
	this.status = 0;
	this.setTimer(30*1000);
	var that = this;
	this.timeChecker =  setInterval(this.updateClock.bind(this), 10);
	this.on("close", function(){
		clearInterval(that.timeChecker);
	})
	this.def = void(0);
	this._csname = "ingame";
	this.elem.find(".winloss button").click(function(e){
		that.elem.find(".winloss").css("display", "none");
		that.elem.find(".please_wait").css("display", "block");
		that.status = 1;
		that.ready();
	});
	this.elem.find(".rps button").click(function(e){
		that.status = 2;
		that.game.socket.emit("ingame", {cmd:"move",value:$(this).attr("data-move")});
	});
	this.elem.children(".new_opp").click(function(e){
		that.game.setScene("finder_scene");
	});
	this.elem.children(".exit").click(function(e){
		that.game.exit("Players Choice MidGame");
	});
}
ingame_gui.prototype = Object.create(Scene.prototype);
ingame_gui.prototype.constructor = ingame_gui;
ingame_gui.prototype.setTimer = function(time){
		this.time= time+Date.now();
}
ingame_gui.prototype.updateClock = function(){
	var now = Date.now()
	var time = this.time - now;
	if(time <= 0){
		switch(this.status){
		case 0:return this.game.exit("Timed Out");
		case 1:return this.game.setScene("finder_scene");
		}
		this.elem.find(".count_down").text("Please wait");
	}else{
		this.elem.find(".count_down").text(time);
	}
};
ingame_gui.prototype.ready = function(){
	var that = this;
	this.game.socket.emit("ingame", {cmd:"ready"});
	this.listen(function(data){
		if(data.cmd == "countdown"){
			that.time = data.timeout;
			return;
		}
		if(data.cmd == "start"){
			that.time = data.timeout;
			return this.play();
		}
		if(data.cmd == "results")
			return that.winloss(data);
	});
};
ingame_gui.prototype.play = function(){
	this.status = 0;
//	this.setTimer(3000);
	this.elem.find(".please_wait").css("display","none");
	this.elem.find(".rps").css("display","block");
};
ingame_gui.prototype.winloss = function(data){
	this.status = 0;
	this.setTimer(30*1000);
	if(data.cmd != "results")
		return;
	this.elem.find(".rps").css("display","none");
	this.parseResults(data);
	this.elem.find(".winloss").css("display","block");
};
ingame_gui.prototype.parseResults = function(data){
	if(!data.opp){
		this.elem.find(".wl").text("You won!");
		this.elem.find(".reason").text("because they left.....");
		this.elem.find(".winloss button").css("display","none");
	}else{
		var you = this.elem.find(".rps button[data-move="+data.you+"]>h2").text();
		var opp = this.elem.find(".rps button[data-move="+data.opp+"]>h2").text();
		if(data.you == data.opp){
			this.elem.find(".wl").text("You tied. :|");
			this.elem.find(".reason").text(you+" equals "+opp);
		}else if(data.you-data.opp%3 == 1){
			this.elem.find(".wl").text("You won! :D");
			this.elem.find(".reason").text("because "+you+" beats "+opp);
		}else{
			this.elem.find(".wl").text("You lost :C");
			this.elem.find(".reason").text("because "+opp+" beats "+you);
		}
	}
}

ingame_gui.innerHTML = "logic/ingame_gui/ingame_gui.fragment.html";
