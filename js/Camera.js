
function CameraController(){
    this.x = 0;
    this.y = 0;
    this.width = GameController.nbCol * GameController.cell;
    this.height = GameController.nbRow * GameController.cell;
    
    var self = this;
    MessageBus.getInstance().listen(MessageBus.MSG_TYPES.characterHasMoved, function(data){
        self.centerAt.call(self, data);
    });
}
CameraController.prototype = {
    centerAt: function(pos){
        this.x = pos.x - floor((GameController.nbCol-1)/2);
        this.y = pos.y - floor((GameController.nbRow-1)/2);
    }
};
