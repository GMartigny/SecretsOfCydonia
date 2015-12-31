
function MessageBus(){
    this.listener = {};
    this.watcher = {};
}
MessageBus.prototype = {
    listen: function(type, callback){
        if(!this.listener[type])
            this.listener[type] = [];
        this.listener[type].push(callback);
        return this;
    },
    watch: function(type, callback){
        if(!this.watcher[type])
            this.watcher[type] = callback;
        return this;
    },
    notifyAll: function(type, data){
        if(this.listener[type]){
            this.listener[type].forEach(function(f){
                f(data);
            });
        }
    },
    notifyAllImmediatly: function(type, data){
        if(this.watcher[type]){
            return this.watcher[type](data);
        }
    }
};
MessageBus.instance = false;
MessageBus.getInstance = function(){
    if(!MessageBus.instance)
        MessageBus.instance = new MessageBus();
    return MessageBus.instance;
};
MessageBus.MSG_TYPES = {
    keydown: 1, keyup: 2,
    isBlocked: 3,
    characterHasMoved: 4
};