import Phaser from "phaser";
import baseConfig from "./baseConfig";

export default {
   type: Phaser.AUTO,
   backgroundColor: '#fff',
   physics: {
      default: 'arcade',
      arcade: {
         debug: true,
         // gravity: {
         //    y: 100
         // },
         checkCollision: {
            down: true
         }
      }
   },

   scale: {
      parent: baseConfig.gameParent,
      mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: baseConfig.w,
      height: baseConfig.h,
   },
};