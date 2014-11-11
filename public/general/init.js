$(document).ready(function () {
  var chat = new ChatClient()
  chat.status("Trying");
  var socket = io();
  chat.message("socket-io ready");
  chat.onSend = function(msg){
    socket.emit('chat message', msg);
  };
  socket.on('chat message', function(msg){
    chat.message(msg);
  });
  chat.message("listening and sending");
  var gui_scenes = [
    "title_scene",
    "finder_scene",
    "ingame_gui"
  ];
  var game = new Game($("#game"), socket, gui_scenes); //start the game
  chat.message("started game");
  chat.status("Ready");

});
