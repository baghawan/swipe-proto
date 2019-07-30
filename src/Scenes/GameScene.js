import "phaser";
import baseConfig from "../Config/baseConfig";
import gameConfig from "../Config/gameConfig";


let score = 0,
    scoreText,
    level = 1,
    levelText,
    slashes,
    gameOver,
    isSwiped = 0,
    gravity = 200,
    speed = 100,
    dropPerLevel = 6,
    dropRateMultiplier = 100,
    dropRateMin = 2000,
    dropRateMax = 3000;

let colliderActivated;

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
      graphics.setDepth(1);
   }

   setText(){
      levelText = this.add.text(30, 40, 'Level: ' + level, { fontSize: 14 * window.devicePixelRatio + 'px', fill: '#000' });
      scoreText = this.add.text(baseConfig.w - 230, 30, score + 'pts', { fontSize: 14 * window.devicePixelRatio + 'px', fill: '#000' });

      scoreText.setFixedSize(200, 45);
      scoreText.setAlign('right');
   }

   checkOrientation(){
      // check screen orientation
      window.addEventListener('orientationchange', function(){
         if (Math.abs(window.orientation) === 90 || Math.abs(window.orientation) === -90) {
            // resume game on landscape
            document.body.classList.add('game-paused');
            game.scene.pause(this);
         } else {
            // pause game on portrait
            document.body.classList.remove('game-paused');
            game.scene.resume(this);
            
         }
      }.bind(this));
   }
   
   checkSwipe(){
      this.input.on('gameobjectmove', function(pointer, gameObject, event){
         gameObject.disableBody(true, true);
         isSwiped++;
         console.log(gameObject)

         score += 100;
         speed += 100;
         scoreText.setText(score + 'pts');

         

         if (isSwiped === dropPerLevel){
            console.log('Level ' + level + ' completed !');
            

            isSwiped -= dropPerLevel;

            if(dropRateMin < 1200){
               dropRateMin === 1200;

            } else if(dropRateMax < 2200){
               dropRateMax === 2200;

            } else {
               dropRateMin -= dropRateMultiplier;
               dropRateMax -= dropRateMultiplier;
            }

            level += 1;
            levelText.setText('Level: ' + level);

            console.log(dropRateMin, dropRateMax);

            this.scene.tearLeft.remove()
            this.scene.tearRight.remove()
            this.scene.generateTears(this);
         }
		});
   }

   addStaticImages(){
      this.bg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background');
      this.character = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'character');
      this.ekspresi = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'ekspresi-idle');


      let scaleBgX = this.cameras.main.width / this.bg.width
      let scaleBgY = this.cameras.main.height / this.bg.height

      let scaleCharacterX = this.cameras.main.width / this.character.width * 1.2
      let scaleCharacterY = this.cameras.main.height / this.character.height

      this.bg.setScale(Math.max(scaleBgX, scaleBgY)).setScrollFactor(0);
      this.character.setScale(Math.max(scaleCharacterX, scaleCharacterY)).setScrollFactor(0);
      this.ekspresi.setScale(Math.max(scaleCharacterX, scaleCharacterY)).setScrollFactor(0);
   }

   addTears(){
      this.tears = this.physics.add.group();
      this.generateTears(this);
   }

   generateTears(){
      let tearLeftXPosition = (this.cameras.main.width - this.ekspresi.displayWidth) / 2
      let tearRightXPosition = this.ekspresi.displayWidth + (this.ekspresi.displayOriginX * 0.45)

      this.tearLeft = this.time.addEvent({
         delay: Phaser.Math.Between(dropRateMin, dropRateMax),
         callback: () => {
             // spawn left tear
            this.singleTearLeft = this.tears.create(tearLeftXPosition, baseConfig.h * 9/20, 'tear').setInteractive();
            this.singleTearLeft.setGravityY(gravity).setAccelerationY(speed).setVelocityX((Math.random() * (70 - (-70)) + (-70))).setMass(20)
            this.singleTearLeft.input.hitArea.setTo(this.singleTearLeft.width / 2, this.singleTearLeft.height / 2, this.singleTearLeft.width * 3, this.singleTearLeft.height * 3);
            
         },
         callbackScope: this,
         repeat: (dropPerLevel / 2) - 1
      })

      this.tearRight = this.time.addEvent({
         delay: Phaser.Math.Between(dropRateMin, dropRateMax),
         callback: () => {
             // spawn right tear
            this.singleTearRight = this.tears.create(tearRightXPosition, baseConfig.h * 9/20, 'tear').setInteractive();
            this.singleTearRight.setGravityY(gravity).setAccelerationY(speed).setVelocityX(-(Math.random() * (70 - (-70)) + (-70))).setMass(20)
            this.singleTearRight.input.hitArea.setTo(this.singleTearRight.width / 2, this.singleTearRight.height / 2, this.singleTearRight.width * 3, this.singleTearRight.height * 3);
         },
         callbackScope: this,
         repeat: (dropPerLevel / 2) - 1
      })

      // this.tearLeft.setDragY(200);
   }

   createBarrier(){
      // define bottom barrier for teardrop
      this.barrier = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.height, this.cameras.main.width, this.cameras.main.height * 1/20);
      this.barrier.setOrigin(0.5, 1)
      this.physics.add.existing(this.barrier);
      this.barrier.body.collideWorldBounds = true;
   }

   hitBottomBarrier(){

      colliderActivated = false;
      console.log('game over');
      
      gameConfig.gameOver = true;
      game.destroy();
    }

   create () {
      // var grid = this.add.graphics();
      // this.drawGrid(grid);

      this.createBarrier();
      this.addStaticImages();
      this.checkOrientation();
      this.setText();

      this.addTears();
      this.checkSwipe();
      
   }

   update(){
      this.tears.getChildren().forEach(function(tear){
         // if(tear.y > this.getBottomBarrier()){
         //    gameConfig.gameOver = true;
         //    game.destroy();

         //    console.log('game over');
         //    // alert('game over');

         //    // setTimeout(function(){
         //    //    window.location.reload();
         //    // }, 500)
         // }

         this.physics.world.collide(tear, [this.barrier], this.hitBottomBarrier, ()=>{
            return colliderActivated;
          }, this);
      }, this);

      
   }
};