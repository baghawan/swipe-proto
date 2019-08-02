import "phaser";
import baseConfig from "../Config/baseConfig";

let username,
    userthumb,
    usertoken;

export default class PreloaderScene extends Phaser.Scene {
   constructor () {
     super('Preloader');
   }

   init (data) {
      this.readyCount = 0;
      this.cameras.main.setBackgroundColor(0xfff1c4)
      
      username = data.userData.name.first;
      userthumb = data.userData.picture.large; //128px
      usertoken = data.userData.registered.age;
   }
  
   preload () {
      console.log('Enter scene ' + this.scene.key)

      var assets_image_url = baseConfig.assets_url + 'images/';
      var assets_sprites_url = baseConfig.assets_url + 'sprites/';
      var assets_sounds_url = baseConfig.assets_url + 'sounds/';

      var width = this.cameras.main.centerX;
      var height = this.cameras.main.centerY;

      // display progress bar
      var progressBar = this.add.graphics();
      var progressBox = this.add.graphics();

      progressBox.fillStyle(0x767184, 0.8);
      progressBox.fillRect((width) - 170, (height * 0.95) + 30, 340, 5); 

      // display loading percentage text
      var percentText = this.make.text({
         x: width,
         y: height * 0.95 - 5,
         text: 'Loading... 0%',
         style: {
            font: '28px kidsrock',
            fill: '#767184'
         }
      });

      // display loading assets text
      var assetText = this.make.text({
         x: width,
         y: this.cameras.main.height - 140,
         text: '',
         style: {
            font: '24px kidsrock',
            fill: '#e19bf3'
         }
      });

      percentText.setOrigin(0.5, 0.5);
      assetText.setOrigin(0.5, 0.5);

      // update progress bar
      this.load.on('progress', function (value) {
         percentText.setText('Loading... ' + parseInt(value * 100) + '%');
         progressBar.clear();
         progressBar.fillStyle(0xe19bf3, 1);
         progressBar.fillRect((width) - 170, (height * 0.95) + 30, 340 * value, 5);
      });

      // update file progress text
      this.load.on('fileprogress', function (file) {
         assetText.setText('Loading asset: ' + file.key);
      });

      this.load.on('complete', function () {
         var _self = this;

         // fading out all assets
         this.tweens.add({
            targets: [progressBar, progressBox, percentText, assetText],
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: function(){
               this.targets[0].destroy(); // destroy all assets after tween complete
               _self.ready();
            }
         }, this);
      }.bind(this));

      this.timedEvent = this.time.delayedCall(1000, this.ready, [], this);

      // load images
      this.load.image('nuLogo', assets_image_url + 'nulogo.png');
      this.load.image('background', assets_image_url + 'bg.jpg');
      this.load.image('leaves', assets_image_url + 'leaves.png');
      this.load.image('character', assets_image_url + 'idle.png');
      this.load.image('userthumb', userthumb);


      // load sprites
      this.load.spritesheet('obstacle', assets_sprites_url + 'heart.png', {
         frameWidth: 118,
         frameHeight: 90
      });

      this.load.multiatlas('expression', assets_sprites_url + 'expressions/expression.json', assets_sprites_url + 'expressions');

      this.load.svg('tear', assets_image_url + 'tear.svg', {
         width: 100 * baseConfig.scaleRatio,
         height: 100 * baseConfig.scaleRatio
      })
   }

   create(){
      
   }

   ready (data) {
      this.readyCount++;

      if (this.readyCount === 2) {
         this.scene.start('Game', {username, usertoken});
      }
   }
};