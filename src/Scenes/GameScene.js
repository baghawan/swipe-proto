import "phaser";
import baseConfig from "../Config/baseConfig";
import gameConfig from "../Config/gameConfig";


var scoreText,
    levelText;

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
      var grid = this.add.graphics();
      // this.drawGrid(grid);

      levelText = this.add.text(30, 40, 'Level: ' + gameConfig.level, { fontSize: 14 * window.devicePixelRatio + 'px', fill: '#000' });
      scoreText = this.add.text(baseConfig.w - 230, 30, gameConfig.score + 'pts', { fontSize: 14 * window.devicePixelRatio + 'px', fill: '#000' });

      scoreText.setFixedSize(200, 45);
      scoreText.setAlign('right');

      // check screen orientation
      window.addEventListener('orientationchange', function(){
         if (screen.orientation.type === "landscape-primary" || screen.orientation.type === "landscape-secondary") {
            // resume game on landscape
            document.body.classList.add('game-paused');
            game.scene.pause(this);
         } else {
            // pause game on portrait
            document.body.classList.remove('game-paused');
            game.scene.resume(this);
            
         }
      }.bind(this));

      this.addTears();
      this.checkSwipe();
   }
   
   checkSwipe(){
      this.input.on('gameobjectmove', function(pointer, tear, event){
         tear.disableBody(true, true);

         if (this.scene.tearsGroup.countActive() === 0){
            console.log('Level ' + gameConfig.level + ' completed !');

            gameConfig.level += 1;
            gameConfig.score += 50;
            gameConfig.speed += (100 * gameConfig.multiplier);
            if(gameConfig.gap < 275){
               gameConfig.gap === 275;

            } else {
               gameConfig.gap -= (50 * gameConfig.multiplier);
            }

            levelText.setText('Level: ' + gameConfig.level);
            scoreText.setText(gameConfig.score + 'pts');

            this.scene.addTears();
         }
		});
   }

   addTears(){
      console.log('Entering Level: ' + gameConfig.level);

      this.tearsGroup = this.physics.add.group();

      for(let i = 0; i < 5; i++){
          this.tearsPool = [this.tearsGroup.create(0, 0, "tear").setInteractive()];
          this.dropTears();
      }
      
      this.tearsGroup.setVelocityY(gameConfig.speed);
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
      this.tearsPool[0].y = topmost - gameConfig.gap;
      this.tearsPool[0].setOrigin(0.5, 0.5);

      this.tearsPool = [];
   }

   update(){
      this.tearsGroup.getChildren().forEach(function(tear){
         if(tear.y > game.config.height){
            gameConfig.gameOver = true;
            game.destroy();

            console.log('game over');

            // setTimeout(function(){
            //    window.location.reload();
            // }, 500)
         }
      }, this);

      
   }
};