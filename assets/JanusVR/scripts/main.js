room.onLoad = function()
{
	if (!isJanusWeb) {
		room.run_speed = 5.4;
	}
}
var loaded = false;
room.update = function(dt)
{
	if (!isJanusWeb) {
		updateTimers(); // brrr
	}
	if(!loaded) { //boolchat variable doesn't seem to be loaded on room.onLoad so...
		cry() // Weep openly
		loaded = true;

		if(!isJanusWeb){
			boolchat.fetch()
			setInterval(function() {
				boolchat.fetch()
			}, 3000);
		} else {
			boolchat.connect();
		}
	}

}
var doublepress; //why does this fire twice on native client?
room.onKeyDown = function(event) {
	if(doublepress == Math.round(getTimestamp()/100)) return;
	doublepress = Math.round(getTimestamp()/100);
	
	if(event.keyCode.charCodeAt(0)==77) { // M key
		boolchat.useTheme = !boolchat.useTheme;
		room.addCookie("useTheme",boolchat.useTheme.toString());
		boolchat.updateTheme();
	}
}


function updateRoomUI() {
	if(!boolchat.useTheme) boolchat.updateTheme();
	if(boolchat.state) {
		room.getObjectById("button").col = Vector(1); //White
		room.getObjectById("button_outline").col = Vector(0); //Black
		return;
	}
	room.getObjectById("button").col = Vector(0);
	room.getObjectById("button_outline").col = Vector(1);
}

/* Native client compatibility functions */
var isJanusWeb = (typeof elation != 'undefined');

if (typeof setTimeout != 'function') {
	var globalTimers = {},
			globalTimerID = 1;
 
	setTimeout = function(fn, delay) {
		var now = getTimestamp(),
				id = globalTimerID++;
		globalTimers[id] = {fn: fn, delay: delay, time: now, args: Array.prototype.splice.call(arguments, 2), repeat: false};
		return id;
	}
	setInterval = function(fn, delay) {
		var now = getTimestamp(),
				id = globalTimerID++;
		globalTimers[id] = {fn: fn, delay: delay, time: now, args: Array.prototype.splice.call(arguments, 2), repeat: true};
		return id;
	}
	clearTimeout = function(id) {
		delete globalTimers[id];
	}
	updateTimers = function() {
		var now = getTimestamp();
		var keys = Object.keys(globalTimers);
		for (var i = 0; i < keys.length; i++) {
			var id = keys[i],
					timer = globalTimers[id];
			if (timer.time + timer.delay <= now) {
				timer.fn.apply(null, timer.args);
				if (timer.repeat) {
					timer.time = now;
				} else {
					clearTimeout(id);
				}
			}
		}
	}// timeout support for native client
}

function getTimestamp() {
	if (isJanusWeb) {
		return performance.now();
	}
	return new Date().getTime();
}


function cry() {
	//Demonstrates a simple XMLHttpRequest
	if(!isJanusWeb){
		boolchat.toggleBoolChat = function() {
			boolchat.state = !boolchat.state;
			boolchat.stateString = boolchat.state.toString()
			boolchat.updateUI();
			var xhr = new XMLHttpRequest();
			xhr.addEventListener('load', boolchat.parseXHR);
			xhr.open('POST', 'https://logix.newweb.page/boolchat');
			xhr.send("boolchat="+boolchat.state.toString());
		}
		boolchat.fetch = function() {
			var xhr = new XMLHttpRequest();
			xhr.addEventListener('load', boolchat.parseXHR);
			xhr.open('GET', 'https://logix.newweb.page/boolchat');
			xhr.send();
		}

		boolchat.parseXHR = function (ev) {
			var xhr = ev.target;
			boolchat.stateString = xhr.responseText;
			boolchat.state = boolchat.stateString.toLowerCase()=="true";
			boolchat.updateUI();
		} // Original client did not have websockets ;-;
	}
	boolchat.updateTheme = function(){
		if ((boolchat.useTheme)?boolchat.darkMode:boolchat.state) {
			room.getObjectById("room").col = Vector(1);
		} else {
			room.getObjectById("room").col = Vector(0);
		}
	}
	boolchat.toggleTheme = function() { 
		if(!boolchat.useTheme) return;
		boolchat.darkMode = !boolchat.darkMode
		room.addCookie("dark",boolchat.darkMode.toString());
		boolchat.updateTheme();
	}
	boolchat.updateUI = updateRoomUI;
	boolchat.useTheme = room.cookies['useTheme']=="true";
	boolchat.darkMode = room.cookies['dark']=="true";
	boolchat.updateTheme();
}
