
var ChatClient = function(){
  this.s = $("#chat>.status");
  this.m = $("#chat>form input");
  this.ms = $("#chat>ul");
  this.g = $("#chat>.gesture");
  var that = this;
  $('#chat>form').submit(function(e){
    e.preventDefault();
    that.onSend(that.m.val());
    that.m.val('');
    return false;
  });
}

ChatClient.prototype.message = function(msg, type){
  msg = $('<li>').html(msg);
  if(type)
    msg.addClass(type)
  this.ms.prepend(msg)
}

ChatClient.prototype.onSend = function(msg){
  console.log(msg);
  this.message("The Message \""+msg+"\" was sent no where", "error");
}

ChatClient.prototype.status = function(status){
  if(status) this.s.text(status);
  else return this.s.text();
}
ChatClient.prototype.gesture = function(motion){
  if(status) this.s.text(status);
  else return this.s.text();
}
