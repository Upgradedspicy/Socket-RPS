function Scene(game, innerHTML){
	EventEmitter.apply(this, []);
	this.elem = $("<div class='scene hidden'></div>");
	game.container.append(this.elem);
	this.sharedData = game.sharedData
	this.elem.html(innerHTML);

	this.game = game;
	this.show();
}
Scene.prototype = Object.create(EventEmitter.prototype);
Scene.prototype.constructor = Scene;

Scene.prototype.hide = function(){
	this.emitEvent("hide", this);
	this.elem.removeClass("shown");
	this.elem.addClass("hidden");
	return this;
}

Scene.prototype.show = function(){
	this.emitEvent("show", this);
	this.elem.removeClass("hidden");
	this.elem.addClass("shown");
	return this;
}
Scene.prototype.listen = function(fn,name){
	if(this._cs)
		this.game.socket.removeListener(this._csname, this._cs);
	this._cs = fn.bind(this);
	this._csname = (name)?name:((this._csname)?this._csname:"game");
	this.game.socket.on(this._csname, this._cs);
}

Scene.prototype.close = function(){
	this.emitEvent("close", this);
	if(this.game._cs)
		this.socket.removeListener(this._csname, this._cs);
	delete this._cs;
	delete this._csname;
	this.elem.remove();
}
