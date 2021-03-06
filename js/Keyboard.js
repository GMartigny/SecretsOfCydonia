
function KeyboardManager(){
	this.listening = true;
    this.keys = [];

    var self = this;
	window.addEvent("keydown", function(e){
        self.keydown.call(self, e);
    });
	window.addEvent("keyup", function(e){
        self.keyup.call(self, e);
    });
}
KeyboardManager.UP = 90;
KeyboardManager.RIGHT = 68;
KeyboardManager.DOWN = 83;
KeyboardManager.LEFT = 81;
KeyboardManager.ENTER = 13;
KeyboardManager.SPACE = 32;
KeyboardManager.ESCAPE = 27;

KeyboardManager.prototype = {
    keydown: function(e){
        if(this.listening){
            if(this.keys.indexOf(e.keyCode) < 0)
                this.keys.push(e.keyCode);
            MessageBus.getInstance().notifyAll(MessageBus.MSG_TYPES.keydown, this.keys);
        }
    },
    keyup: function(e){
        if(this.listening){
            this.keys.out(e.keyCode);
            MessageBus.getInstance().notifyAll(MessageBus.MSG_TYPES.keyup, this.keys);
        }
    },
    isPressed: function(key){
        return (this.keys.indexOf(key) < 0)? false : true;
    },
    toggleListen: function(){
		this.listening = !this.listening;
	}
};
