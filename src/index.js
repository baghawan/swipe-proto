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
      this.scene.add('Gameover', GameoverScene);
      this.scene.start('Boot');
   }
}

window.game = new Game();