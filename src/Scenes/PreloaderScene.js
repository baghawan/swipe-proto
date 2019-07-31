import "phaser";
import baseConfig from "../Config/baseConfig";

export default class PreloaderScene extends Phaser.Scene {
   constructor () {
     super('Preloader');
   }

   init () {
      this.readyCount = 0;
   }
  
   preload () {
      console.log('Enter scene ' + this.scene.key)

      var assets_image_url = baseConfig.assets_url + 'images/';
      var assets_sprites_url = baseConfig.assets_url + 'sprites/';
      var assets_sounds_url = baseConfig.assets_url + 'sounds/';
      var width = this.cameras.main.centerX;
      var height = this.cameras.main.centerY;

      // add logo image
      // var sadboi = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 200, 'sadboi');

      // display progress bar
      var progressBar = this.add.graphics();
      var progressBox = this.add.graphics();

      progressBox.fillStyle(0x999999, 0.8);
      progressBox.fillRect((width) - 160, (height * 0.95) + 30, 320, 5); 

      // display loading percentage text
      var percentText = this.make.text({
         x: width,
         y: height * 0.95 - 5,
         text: 'Loading... 0%',
         style: {
            font: '24px monospace',
            fill: '#000'
         }
      });

      // display loading assets text
      var assetText = this.make.text({
         x: width,
         y: height * 0.95 + 70,
         text: '',
         style: {
            font: '24px monospace',
            fill: '#000'
         }
      });

      percentText.setOrigin(0.5, 0.5);
      assetText.setOrigin(0.5, 0.5);

      // update progress bar
      this.load.on('progress', function (value) {
         percentText.setText('Loading... ' + parseInt(value * 100) + '%');
         progressBar.clear();
         progressBar.fillStyle(0x000000, 1);
         progressBar.fillRect((width) - 160, (height * 0.95) + 30, 320 * value, 5);
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
      this.load.image('background', assets_image_url + 'bg.jpg');
      this.load.image('character', assets_image_url + 'idle.png');
      this.load.image('ekspresi-idle', assets_image_url + 'ekspresi-idle.png');


      // load sprites
      this.load.spritesheet('obstacle', assets_sprites_url + 'heart.png', {
         frameWidth: 158,
         frameHeight: 120
      });
      
      this.load.spritesheet('ekspresi-3', assets_sprites_url + 'ekspresi-3.png', {
         frameWidth: 630,
         frameHeight: 750
      });

      this.load.spritesheet('ekspresi-3', assets_sprites_url + 'ekspresi-3.png', {
         frameWidth: 630,
         frameHeight: 750
      });

      this.load.spritesheet('trans-3-4', assets_sprites_url + 'trans-3-4.png', {
         frameWidth: 630,
         frameHeight: 750
      });

      this.load.spritesheet('ekspresi-4', assets_sprites_url + 'ekspresi-4.png', {
         frameWidth: 630,
         frameHeight: 750
      });

      this.load.svg('tear', assets_image_url + 'tear.svg', {
         width: 60 * baseConfig.scaleRatio,
         height: 60 * baseConfig.scaleRatio
      })
   }

   ready () {
      this.readyCount++;

      if (this.readyCount === 2) {
         this.scene.start('Game');
      }
   }
};