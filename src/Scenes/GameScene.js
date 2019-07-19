import "phaser";
import baseConfig from "../Config/baseConfig";




export default class GameScene extends Phaser.Scene {
   constructor () {
     super('Game');
   }
  
   preload () {
      console.log('Enter scene ' + this.scene.key);

      var assets_image_url = baseConfig.assets_url + 'images/';

      this.load.svg('tear', assets_image_url + 'tear.svg', {
         width: 20,
         height: 20
      })
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
      var centerGrid;
   
      var grid = this.add.graphics();
      this.drawGrid(grid);

      var teardrops = this.add.group({
         key: 'tear',
         repeat: baseConfig.gridY - 1,
         setXY: { x: 50, y: 10, stepX: baseConfig.w / baseConfig.gridY }
      });
   }

   
};