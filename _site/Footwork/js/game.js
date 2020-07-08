/* Footwork game. David Johnston 2016 */

var Game = {
	_display: null,
	_currentScreen: null,
	_screenWidth: 80,
	_screenHeight: 30,

	init: function() {

		// Create display and append to page
		this._display = new ROT.Display({fontFamily:'DejaVu-larrow',
										 width:this._screenWidth,
										 height:this._screenHeight});
		document.body.appendChild(this._display.getContainer());

		var game = this;
		var bindEventToScreen = function (event) {
			window.addEventListener(event, function(e) {
				if (game._currentScreen !== null) {
					game._currentScreen.handleInput(event,e);
					game.refresh();
				}
			});
		};
		
		bindEventToScreen('keydown');
		bindEventToScreen('mousemove');
		bindEventToScreen('mousedown');
		//bindEventToScreen('keyup');
		//bindEventToScreen('keypress');

	},

	switchScreen: function(screen) {
		if (this._currentScreen !== null) {
			this._currentScreen.exit();
		}
		
		this._currentScreen = screen;

		if (this._currentScreen !== null) {
			this._currentScreen.enter();
			this.refresh();
		}
	},

	refresh: function() {
		this.getDisplay().clear();
		if (this._currentScreen !== null) {
			this._currentScreen.render(this.getDisplay());
		}
	},
	//Clear messages and unlock engine on "hard" player input
	flushInput: function() { 
		this._currentScreen.clearMessages();
		this._currentScreen._map.getEngine().unlock();
	},

	getDisplay: function() {
		return this._display;
	},

	sendMessage: function(recipient, message, args) {
		if (recipient.hasMixin("MessageRecipient")) {
			if (args) {
				message = vsprintf(message, args);
			}
			recipient.receiveMessage(message);
		}
	},
	
	setDefaultControls: function(controls) {
		this.Screen.footworkScreen._controls = controls;
	},
		   

};


window.onload = function() {
		// Check if rot.js can work on this browser
		if (!ROT.isSupported()) {
			alert("The rot.js library isn't supported by your browser.");
		} else {
			Game.init();
			Game.switchScreen(Game.Screen.startScreen);
		}
}
