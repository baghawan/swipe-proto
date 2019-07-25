import "phaser";
import gameConfig from './Config/gameConfig';
import GameScene from './Scenes/GameScene';
import BootScene from './Scenes/BootScene';
import PreloaderScene from './Scenes/PreloaderScene';
import GameoverScene from './Scenes/GameoverScene';

class Game extends Phaser.Game {
   constructor () {
      super(gameConfig);
      this.scene.add('Boot', BootScene);
      this.scene.add('Preloader', PreloaderScene);
      this.scene.add('Game', GameScene);
      this.scene.start('Boot');

      // scene.scale.on('orientationchange', function(orientation) {
      //    if (orientation === Phaser.Scale.PORTRAIT) {
      //       console.log('portrait');
      //    } else if (orientation === Phaser.Scale.LANDSCAPE) {
      //        // ...
      //    }
      // });
   }
   
   
}

setTimeout(function(){
   window.game = new Game();
   console.log(window.game)
}, 100)

