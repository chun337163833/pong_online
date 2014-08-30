//set main namespace
goog.provide('pong');


//get requirements
goog.require('lime.Director');
goog.require('lime.GlossyButton');
goog.require('lime.Layer');
goog.require('lime.Scene');
goog.require('pong.Game');
goog.require('lime.Label');

// entrypoint
pong.start = function() {

	lime.scheduleManager.setDisplayRate(1000 / 60);

	pong.director = new lime.Director(document.body, 320, 460);
	
	var scene = new lime.Scene(),
	    layer = new lime.Layer();

	var input = document.createElement('input');
	input.setAttribute('id', 'code');
	input.setAttribute('placeholder', 'input code');
	input.setAttribute('style', 'width: 100%;');
	scene.appendChild(input);

		var btn = new lime.GlossyButton('START').setSize(100, 40).setPosition(150, 100);
		goog.events.listen(btn, 'click', function() {
		  socket.on('wait', function(msg) {
		    var newLayer = new lime.Layer();
		    var newScene = new lime.Scene();
		    var wait = new lime.Label('wait opponent').setPosition(150, 100);
		    newLayer.appendChild(wait);
		    newScene.appendChild(newLayer);
		    pong.director.replaceScene(newScene);
		  });
		  socket.on('dup', function(msg) {
		    alert('code is already in use');
		  });
		  socket.on('start', function(msg) {
		    pong.newgame(msg);
		  });
		  socket.on('oppoff', function(msg) {
		    var newLayer = new lime.Layer();
		    var newScene = new lime.Scene();
		    var wait = new lime.Label('opponent offline').setPosition(150, 100);
		    newLayer.appendChild(wait);
		    newScene.appendChild(newLayer);
		    pong.director.replaceScene(newScene);
		  });
		  socket.emit('login', input.value);
		});
		layer.appendChild(btn);

		/*
		btn = new lime.GlossyButton('VS').setSize(100, 40).setPosition(150, 200);
		goog.events.listen(btn, 'click', function() {
			pong.newgame(2);
		});
		layer.appendChild(btn);
		*/

	scene.appendChild(layer);

	// set current scene active
	pong.director.replaceScene(scene);
	pong.director.makeMobileWebAppCapable();
	
	socket.on('disconnect', function() {
	  console.log('disconnect');
	  var newLayer = new lime.Layer();
	  var newScene = new lime.Scene();
	  var disc = new lime.Label('disconnected...').setPosition(150, 100);
	  newLayer.appendChild(disc);
	  newScene.appendChild(newLayer);
	  pong.director.replaceScene(newScene);
	});


};

pong.newgame = function(mode) {
	var scene = new lime.Scene(),
	layer = new lime.Layer();

	scene.appendChild(layer);

	var game = new pong.Game(mode);
	layer.appendChild(game);
	

	pong.director.replaceScene(scene);
};



//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('pong.start', pong.start);
