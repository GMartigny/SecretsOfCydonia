
function Player(ctx, img){
    this.layer = ctx;
    this.img = img;
    
    var save = [];
    (localStorage.SoC_P && hashCode(localStorage.SoC_P) == localStorage.SoC_HP)?
        save = localStorage.SoC_P.split(";") : save = [37, 44, Player.DIR_DOWN];
	
    this.pos = {
        x: +save[0],
        y: +save[1]
    };
    this.dir = +save[2];
    this.anim = 0;
	
	this.moving = false;
}
Player.DIR_DOWN = 0;
Player.DIR_LEFT = 1;
Player.DIR_RIGHT = 2;
Player.DIR_UP = 3;
Player.SPEED = 0.1;

Player.prototype = {
    render: function(camera){
        this.layer.clear();
        var step = round(2/PI*asin(sin(this.anim))+1),
            cell = GameController.cell;
        this.layer.drawImage(this.img,
            cell*step, cell*this.dir, cell, cell,
            (this.pos.x-camera.x)*cell, (this.pos.y-camera.y)*cell, cell, cell);
    },
    move: function(keys){
        this.moving = false;
        if(keys.length){
            var dx = 0,
                dy = 0,
                max;
            if(keys.indexOf(KeyboardManager.DOWN) != -1){
                this.dir = Player.DIR_DOWN;
                max = MessageBus.getInstance().notifyAllImmediatly(MessageBus.MSG_TYPES.isBlocked, {
                    x: this.pos.x, y: this.pos.y+Player.SPEED, dir: this.dir
                });
                if(!max){
                    dy = Player.SPEED;
                    this.moving = true;
                }
                else{
                    this.pos.y = max;
                }
            }
            else if(keys.indexOf(KeyboardManager.UP) != -1){
                this.dir = Player.DIR_UP;
                max = MessageBus.getInstance().notifyAllImmediatly(MessageBus.MSG_TYPES.isBlocked, {
                    x: this.pos.x, y: this.pos.y-Player.SPEED, dir: this.dir
                });
                if(!max){
                    dy = -Player.SPEED;
                    this.moving = true;
                }
                else{
                    this.pos.y = max;
                }
            }
            if(keys.indexOf(KeyboardManager.RIGHT) != -1){
                this.dir = Player.DIR_RIGHT;
                max = MessageBus.getInstance().notifyAllImmediatly(MessageBus.MSG_TYPES.isBlocked, {
                    x: this.pos.x+Player.SPEED, y: this.pos.y, dir: this.dir
                });
                if(!max){
                    if(this.moving){
                        dy *= SQRT2;
                        dx = Player.SPEED*SQRT2;
                    }
                    else{
                        dx = Player.SPEED;
                        this.moving = true;
                    }
                }
                else{
                    this.pos.x = max;
                }
            }
            else if(keys.indexOf(KeyboardManager.LEFT) != -1){
                this.dir = Player.DIR_LEFT;
                max = MessageBus.getInstance().notifyAllImmediatly(MessageBus.MSG_TYPES.isBlocked, {
                    x: this.pos.x-Player.SPEED, y: this.pos.y, dir: this.dir
                });
                if(!max){
                    if(this.moving){
                        dy *= SQRT2;
                        dx = -Player.SPEED*SQRT2;
                    }
                    else{
                        dx = -Player.SPEED;
                        this.moving = true;
                    }
                }
                else{
                    this.pos.x = max;
                }
            }

            if(this.moving){
                this.pos.x += dx;
                this.pos.y += dy;
                this.anim += Player.SPEED*1.5;
                MessageBus.getInstance().notifyAll(MessageBus.MSG_TYPES.characterHasMoved, this.pos);
            }
            else
                this.anim = 0;
            
            var s = this.pos.x+";"+this.pos.y+";"+this.dir;
            localStorage.SoC_P = s;
            localStorage.SoC_HP = hashCode(s);
        }
        else
            this.anim = 0;
    }
};
