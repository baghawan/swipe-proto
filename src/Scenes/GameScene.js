import "phaser";
import baseConfig from "../Config/baseConfig";
import gameConfig from "../Config/gameConfig";




export default class GameScene extends Phaser.Scene {
   constructor () {
     super('Game');
   }
  
   preload () {
      console.log('Enter scene ' + this.scene.key);
   }

   drawGrid(graphics) {
      graphics.lineStyle(1, 0x0000ff, 0.8);

      for(var j = 0; j < (baseConfig.gridY); j++) {
         graphics.moveTo(j * (baseConfig.w / baseConfig.gridY), 0);
         graphics.lineTo(j * (baseConfig.w / baseConfig.gridY), baseConfig.h);
      }
      
      graphics.strokePath();
   }
  
   create () {
      var path;
      // var teardropLeft;
      var setX = (baseConfig.w / baseConfig.gridY) * 0.5;
      var step = baseConfig.w / (baseConfig.gridY - 1) + setX;
   
      var grid = this.add.graphics();
      this.drawGrid(grid);

      this.addTears();

      // teardropLeft = this.physics.add.group({
      //    key: 'tear',
      //    repeat: baseConfig.gridY - 2,
      //    setXY: { x: setX, y: 10, stepX: step }
      // });
   }

   addTears(){
      this.tearsGroup = this.physics.add.group()
      for(let i = 0; i < 10; i++){
          this.tearsPool = [this.tearsGroup.create(0, 0, "tear")];
          this.dropTears();
      }
      this.tearsGroup.setVelocityY(gameConfig.tearSpeed);
   }

   getTopmostTear(){
      let topmostTear = game.config.height;
      this.tearsGroup.getChildren().forEach(function(tear){
          topmostTear = Math.min(topmostTear, tear.y)
      });
      return topmostTear;
   }

   dropTears(){
      let topmost = this.getTopmostTear();
      let holePosition = Phaser.Math.Between(1, gameConfig.safeZones - 1);
      this.tearsPool[0].x = holePosition * game.config.width / gameConfig.safeZones;
      this.tearsPool[0].y = topmost - gameConfig.tearGap;
      this.tearsPool[0].setOrigin(0.5, 0.5);
      this.tearsPool = [];
   }

   update(){
      this.tearsGroup.getChildren().forEach(function(tear){
         if(tear.y > game.config.height){
               this.tearsPool.push(tear);
               if(this.tearsPool.length == 2){
                  this.dropTears();
               }
         }
      }, this);
   }
};