// This was a lot cleaner before prep for JanusXR
var boolchat = {
	state: false,
	stateString: "False",
	darkMode: false,
	connect: function() {
		boolchat.ws = new WebSocket('wss://logix.newweb.page/boolchat');
		boolchat.ws.onmessage = function (e) {
			boolchat.state = (e.data.toLowerCase()=="true")
			boolchat.stateString = e.data
			boolchat.updateUI()
		}
		boolchat.ws.onclose = function(e) {
			console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
			setTimeout(function() {
				boolchat.connect();
			}, 1000);
		}
		boolchat.ws.onerror = function(evt) {
			console.error("WebSocket error:", event);
		}
	},
	updateUI: function(){
		boolchat.button.checked = boolchat.state;
		boolchat.button.setAttribute("title", boolchat.stateString);
	},
	updateTheme: function(){
		if (boolchat.darkMode) {
			boolchat.bodyBG.setAttribute("dark",true);
		} else {
			boolchat.bodyBG.removeAttribute("dark");
		}
	},
	toggleTheme: function() { 
		boolchat.darkMode = !boolchat.darkMode
		localStorage.setItem("dark",boolchat.darkMode);
		boolchat.updateTheme();
	},
	toggleBoolChat: function() {
		boolchat.state = !boolchat.state;
		boolchat.stateString = boolchat.state.toString()
		boolchat.updateUI();
		boolchat.ws.send(boolchat.state);
	},
	pageLoaded: function() {
		darkMode = localStorage.getItem("dark")=="true";
		boolchat.bodyBG = document.getElementById("bg");
		boolchat.button = document.getElementById("boolchat");
		boolchat.updateTheme();
		boolchat.connect();
	}
}