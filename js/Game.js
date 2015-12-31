
function GameController(media){
    this.map = new MapManager(media.links);
    
    var canvas = prepareCanvas("c", GameController.nbCol*GameController.cell, GameController.nbRow*GameController.cell);
    this.player = new Player(canvas.entities.ctx, media.player);
    this.entities = new EntityManager(canvas.entities.ctx, media.entities);
    this.view = new ViewManager(canvas, media.tiles, this.map.getMap());
    
    this.camera = new CameraController();
    this.camera.centerAt(this.player.pos);
    this.key = new KeyboardManager();
    
    
    this.music = new SoundManager();
    
    var o = this.view.overlay;
    this.fps = new FPS(function(fps){
        o.ctx.clear();
        o.ctx.fillText(fps, 5, 15);
    }, 200);
    
    this.loop();
}
GameController.cell = 32;
GameController.nbRow = 21;
GameController.nbCol = 39;

GameController.tickLength = 1000/60;
GameController.lastTick = 0;

GameController.prototype = {
    loop: function(time){
        var self = this;
        raf(function(time){
            self.loop.call(self, time);
        });

        if(this.view.ready){
            this.update(floor((time-GameController.lastTick)/GameController.tickLength));
            this.render();

            this.fps.update();
        }
        else{
            this.view.checkReady();
        }
    },
    update: function(nbTick){
        for(var i=0;i<nbTick;++i){
            this.entities.moveAll(this.player, this.view);
            this.player.move(this.key.keys);
        }
        GameController.lastTick += GameController.tickLength*nbTick;
    },
    render: function(){
        this.player.render(this.camera);
        this.entities.renderAll(this.camera);
        this.view.renderAll(this.camera);
    },
    teleport: function(dir){
        this.map.changeMap(dir);

        this.view.setMap(this.map.getMap());
    }
};
