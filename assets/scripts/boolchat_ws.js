class BoolchatWS {
	state = false;
	constructor(button) {
		this.button = button
		// Register button click event
		this.button.addEventListener('click', ()=> this.toggle(), false);
		this.connect()
	}
	connect(){
		this.ws = new WebSocket('wss://api.newweb.page/boolchat');
		this.ws.onmessage = (msg) => this.onmessage(msg)
		this.ws.onclose = (event) => {
			console.log('Socket has closed. Reconnecting in 16 seconds', event.reason);
			setTimeout(() => this.connect(), 16000);
		}
		this.ws.onerror = (event) => console.error("WebSocket error:", event);
	}
	onmessage(message) {
		this.state = (message.data.toLowerCase()=="true")
		this.updateButton()
	}
	updateButton() {
		this.button.checked = this.state;
		this.button.setAttribute("title", this.state);
	}
	toggle() {
		this.state = !this.state;
		this.updateButton();
		this.ws.send(this.state);
	}
}