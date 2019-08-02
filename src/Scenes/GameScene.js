import "phaser";
import baseConfig from "../Config/baseConfig";
import gameConfig from "../Config/gameConfig";


let score = 0,
    scoreText,
    level = 1,
    levelText,
    slashes,
    obstacle,
    gameOver,
    isSwiped = 0,
    gravity = 250,
    speed = 80,
    dropPerLevel = 4,
    dropRateMultiplier = 100,
    dropRateMin = 3000,
    dropRateMax = 4000,
    expression,
    points = [];

let colliderActivated;

var animsIntro = [
   "idle",
   "trans_idle-1",
   "stage-1",
   "trans_1-2",
   "stage-2",
   "trans_2-3",
   "stage-3",
   "trans_3-4"
];

export default class GameScene extends Phaser.Scene {
   constructor () {
     super('Game');
   }

   init(data){
      console.log(data)

      this.usernameData = data.username;
      this.usertokenData = data.usertoken;
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

   setNuLogo(){
      this.logo = this.add.image(150 * baseConfig.scaleRatio, 100 * baseConfig.scaleRatio, 'nuLogo')
      this.logo.setScale(1 * baseConfig.scaleRatio);
      // this.logo.setOrigin(0, 0);
   }

   setUserThumbnail(){
      this.userThumb = this.add.image(this.cameras.main.width - (100 * baseConfig.scaleRatio), (100 * baseConfig.scaleRatio), 'userthumb')
      this.userThumb.setScale(1 * baseConfig.scaleRatio, 1 * baseConfig.scaleRatio);
      // this.userThumb.setOrigin(1, 0);

      this.shape = this.make.graphics().fillCircle(this.userThumb.x, this.userThumb.y, (this.userThumb.width / 2) * baseConfig.scaleRatio);
      var mask = this.shape.createGeometryMask();
      this.userThumb.setMask(mask);
   }

   setUserName(){
      console.log(this.userThumb)
      this.userName = this.add.text(this.userThumb.x - (this.userThumb.displayWidth / 2), this.userThumb.y - 35, this.usernameData, {
         fontFamily: 'kidsrock',
         fontSize: 14 * window.devicePixelRatio + 'px',
         color: '#fff',
         stroke: '#000',
         strokeThickness: 4,
         padding: {
            right: 20
         }
      });
      this.userName.setOrigin(1, 0)
   }

   setToken(){
      this.userToken = this.add.text(this.userThumb.x - (this.userThumb.displayWidth / 2), this.userThumb.y + 5, this.usertokenData + ' token', {
         fontFamily: 'kidsrock',
         fontSize: 14 * window.devicePixelRatio + 'px',
         color: '#f7ed6b',
         stroke: '#000',
         strokeThickness: 4,
         padding: {
            right: 20
         }
      });
      this.userToken.setOrigin(1, 0)
   }

   addHeader(){
      this.setNuLogo();
      this.setUserThumbnail();
      this.setUserName();
      this.setToken();
   }

   setText(){
      this.scoreStaticText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY * 1/4, 'score', {
         fontFamily: 'kidsrock',
         fontSize: 28 * window.devicePixelRatio + 'px',
         color: '#f7ed6b',
         stroke: '#000',
         strokeThickness: 4,
      });

      scoreText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY * 1/4 + this.scoreStaticText.height + 20, '0', {
         fontFamily: 'kidsrock',
         fontSize: 42 * window.devicePixelRatio + 'px',
         color: '#f7ed6b',
         stroke: '#000',
         strokeThickness: 4,
      });
      this.scoreStaticText.setOrigin(0.5, 0.5);
      scoreText.setOrigin(0.5, 0.5);


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

   createSlashEffect(coordX, coordY, angle){
      var slashes = this.add.graphics();

      slashes.clear();
      slashes.setDepth(3);
      slashes.fillStyle(0x00ff00, 1);
      
      slashes.beginPath();

      slashes.arc(coordX, coordY, 70, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(270), false);
      
      slashes.fillPath();
      slashes.closePath();
      console.log(slashes)
   }

   addStaticImages(){
      this.bg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background');
      this.character = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'character');
      this.leaves = this.add.image(this.cameras.main.width, 0, 'leaves');

      let scaleBgX = this.cameras.main.width / this.bg.width
      let scaleBgY = this.cameras.main.height / this.bg.height

      this.scaleCharacterX = this.cameras.main.width / this.character.width * 1.2
      this.scaleCharacterY = this.cameras.main.height / this.character.height

      this.bg.setScale(Math.max(scaleBgX, scaleBgY)).setScrollFactor(0);
      this.character.setScale(Math.max(this.scaleCharacterX, this.scaleCharacterY)).setScrollFactor(0);
      this.leaves.setScale(Math.max(scaleBgX, scaleBgY)).setScrollFactor(0);
      this.leaves.setOrigin(1, 0.25);
      
   }

   getFrame(prefix){
      this.frameName = this.anims.generateFrameNames('expression', {
         start: 0, end: 14, zeroPad: 5,
         prefix: `${prefix}/${prefix}_`, suffix: '.png'
      });

      return this.frameName
   }

   createAnims(){
      var fps = 15,
          transCount = 1;

      this.anims.create({
         key: 'idle',
         frames: this.anims.generateFrameNames('expression', {
            start: 0, end: 29, zeroPad: 5,
            prefix: 'Idle/Idle_', suffix: '.png'
         }),
         frameRate: fps,
         repeat: 1
      });

      this.anims.create({
         key: 'trans_idle-1', frames: this.getFrame('Between Idle - 1'), frameRate: fps,
      });

      this.anims.create({
         key: 'stage-1', frames: this.getFrame('Stage 1'), frameRate: fps
      });

      this.anims.create({
         key: 'trans_1-2', frames: this.getFrame('Between 1 - 2'), frameRate: fps,
      });

      this.anims.create({
         key: 'stage-2', frames: this.getFrame('Stage 2'), frameRate: 30
      });

      this.anims.create({
         key: 'trans_2-3', frames: this.getFrame('Between 2 - 3'), frameRate: fps,
      });

      this.anims.create({
         key: 'stage-3', frames: this.getFrame('Stage 3'), frameRate: 30
      });

      this.anims.create({
         key: 'trans_3-4', frames: this.getFrame('Between 3 - 4'), frameRate: fps,
      });

      this.anims.create({
         key: 'stage-4', frames: this.getFrame('Stage 4'), frameRate: fps, repeat: -1
      });

      this.anims.create({
         key: 'trans_4-5', frames: this.getFrame('Between 4 - 5'), frameRate: fps
      });

      this.anims.create({
         key: 'stage-5', frames: this.getFrame('Stage 5'), frameRate: fps, repeat: -1
      });

      this.anims.create({
         key: 'trans_5-shock', frames: this.getFrame('Between 5 - Shock'), frameRate: fps,
      });

      this.anims.create({
         key: 'shock', frames: this.getFrame('Shock'), frameRate: fps, repeat: -1
      });
   }

   addEkspresi(){
      var scaleNum = (Math.max(this.scaleCharacterX, this.scaleCharacterY));
      this.createAnims.call(this);

      expression = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'expression', 'Idle/Idle_00000.png');
      expression.setScale(scaleNum);

      expression.play(animsIntro.shift())
      expression.on("animationcomplete", function(anim){
         var intro = animsIntro.shift();

         if (intro) {
            this.play(intro);
            
         } else {
            this.off('animationcomplete', this.scene.addTears(this));
         }
      })
   }

   addTears(){
      expression.play('stage-4');

      
      this.generateTears(this);
   }

   generateTears(){
      let tearLeftXPosition = (this.cameras.main.width - expression.displayWidth) / 2
      let tearRightXPosition = expression.displayWidth + (expression.displayOriginX * 0.5)

      this.tearLeft = this.time.addEvent({
         delay: Phaser.Math.Between(dropRateMin, dropRateMax),
         callback: () => {
             // spawn left tear
            this.singleTearLeft = this.tears.create(tearLeftXPosition, baseConfig.h * 9/19, 'tear').setFlipX(true).setInteractive();
            this.singleTearLeft.input.hitArea.setTo(this.singleTearLeft.width / 2, this.singleTearLeft.height / 2, this.singleTearLeft.width * 3, this.singleTearLeft.height * 3);

            this.singleTearLeft.setGravityY(gravity)
                               .setAngle(40)
                               .setAccelerationY(speed)
                               .setVelocityX(-(Math.random() * (70 - 20) + 20))
                               .setAngularVelocity(-15)
                               .setMass(20)
            
            
         },
         callbackScope: this,
         repeat: (dropPerLevel / 2) - 1
      })

      this.tearRight = this.time.addEvent({
         delay: Phaser.Math.Between(dropRateMin, dropRateMax),
         callback: () => {
             // spawn right tear
            this.singleTearRight = this.tears.create(tearRightXPosition, baseConfig.h * 9/19, 'tear').setInteractive();
            this.singleTearRight.input.hitArea.setTo(this.singleTearRight.width / 2, this.singleTearRight.height / 2, this.singleTearRight.width * 3, this.singleTearRight.height * 3);

            this.singleTearRight.setGravityY(gravity)
                                .setAngle(-40)
                                .setAccelerationY(speed)
                                .setVelocityX((Math.random() * (70 - 20) + 20))
                                .setAngularVelocity(15)
                                .setMass(20)
            
         },
         callbackScope: this,
         repeat: (dropPerLevel / 2) - 1
      })
   }

   addObstacle(){
      this.obstacleSpawn = this.time.addEvent({
         delay: Phaser.Math.Between(5000, 10000),
         callback: () => {
            var randomX = Phaser.Math.Between(this.cameras.main.width * 1/3, this.cameras.main.width * 2/3);
            var randomY = Phaser.Math.Between(0, this.cameras.main.height * 1/3);

            // spawn obstacle
            obstacle = this.physics.add.sprite(randomX, randomY, 'obstacle', 0);

            obstacle.setInteractive();
            obstacle.setScale(1 * baseConfig.scaleRatio, 1 * baseConfig.scaleRatio);

            obstacle.setVelocity(Phaser.Math.Between(-100, 100), 100);
            obstacle.setGravityY(50);
            obstacle.setAngularVelocity(Phaser.Math.Between(-20, 20));
            
         },
         callbackScope: this,
         repeat: -1
      })
   }

   checkSwipe(){
      
      this.input.on('gameobjectmove', function(pointer, gameObject, event){
         if(gameObject.texture.key !== 'obstacle'){
            gameObject.disableBody(true, true);

            isSwiped++;
         
            score += 100;
            speed += 20;
            scoreText.setText(score); 

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

               if(level === 5){
                  this.scene.addObstacle(this);
                  expression.play('trans_4-5')
                  expression.anims.chain('stage-5')
               }

               console.log(dropRateMin, dropRateMax);

               this.scene.tearLeft.remove()
               this.scene.tearRight.remove()
               this.scene.generateTears(this);
            }

         } else {
            console.log(gameObject)
            gameObject.disableInteractive();

            score -= 50;

            if(score < 0){
               scoreText.setText('0'); 

            } else {
               scoreText.setText(score); 
            }

            gameObject.setFrame(1)

            gameObject.setVelocity(0,0);
            gameObject.setGravityY(0);
            gameObject.setAngularVelocity(0);

            this.scene.tweens.add({
               delay: 1000,
               targets: gameObject,
               alpha: 0,
               duration: 400,
               ease: 'Power1'
            }, this);
         }
		});
   }

   createBarrier(){
      // define bottom barrier for teardrop
      this.barrier = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.height, this.cameras.main.width, this.cameras.main.height * 1/20);
      this.barrier.setOrigin(0.5, 1)
      this.physics.add.existing(this.barrier);
      this.barrier.body.collideWorldBounds = true;
   }

   hitBottomBarrier(){
      expression.play('trans_5-shock')
      expression.anims.chain('shock')

      colliderActivated = false;
      gameConfig.gameOver = true;

      this.input.off('gameobjectmove');

      console.log('game over');

      setTimeout(function(){
         alert('game over');
         game.destroy();
      }, 3000)
   }

   create () {

      // var grid = this.add.graphics();
      // this.drawGrid(grid);
      this.cameras.main.setBackgroundColor(0xfff1c4)
      
      this.tears = this.physics.add.group();

      this.createBarrier();
      this.addStaticImages();
      this.addEkspresi();

      this.checkOrientation();
      this.setText();
      this.checkSwipe();
      
      this.addHeader();
   }

   update(){
      this.tears.getChildren().forEach(function(tear){
         this.physics.world.collide(tear, [this.barrier], this.hitBottomBarrier, ()=>{
            return colliderActivated;
          }, this);
      }, this);
   }
};