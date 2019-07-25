import Phaser from "phaser";
import baseConfig from "./baseConfig";

export default {
   type: Phaser.AUTO,
   backgroundColor: '#fff',
   physics: {
      default: 'arcade',
      arcade: {
         debug: true,
         gravity: {
            y: 100
         },
         checkCollision: {
            down: true
         }
      }
   },

   // parent: baseConfig.gameParent,
   // width: baseConfig.gameParent.clientWidth * window.devicePixelRatio,
   // height: baseConfig.gameParent.clientHeight * window.devicePixelRatio,

   scale: {
      parent: baseConfig.gameParent,
      mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: baseConfig.w,
      height: baseConfig.h,
   },

   level: 1,
   score: 0,
   gameOver: false,
   safeZones: 3,

   speed: 100,
   gap: 400,
   
   multiplier: 0.5
};