import "phaser";
import baseConfig from "../Config/baseConfig";


export default class BootScene extends Phaser.Scene {
   constructor () {
     super('Boot');
   }
  
   preload () {
      console.log('Device Pixel Ratio: ' + window.devicePixelRatio)
      console.log('Enter scene ' + this.scene.key)
      
      var assets_image_url = baseConfig.assets_url + 'images/';

      this.load.svg({
         key: 'sadboi',
         url: assets_image_url + 'sadboi.svg',
         svgConfig: {
            scale: (1 * .75) * baseConfig.scaleRatio // actual svg size discale 0.75 lalu dikali device pixel ratio
         }
      });

      console.log(baseConfig.gameParent.clientHeight)
   }
  
   create () {
      this.scene.start('Preloader');
   }
};