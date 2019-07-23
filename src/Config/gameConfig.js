import Phaser from "phaser";
import baseConfig from "./baseConfig";

export default {
   type: Phaser.CANVAS,
   backgroundColor: '#fff',
   physics: {
      default: 'arcade',
      arcade: {
         gravity: {
            y: 0
         }
      }
   },
   scale: {
      parent: baseConfig.gameParent,
      mode: Phaser.Scale.FIT,
      width: baseConfig.w,
      height: baseConfig.h
   },

   tearSpeed: 500,
   tearGap: 200,
   safeZones: 3
};