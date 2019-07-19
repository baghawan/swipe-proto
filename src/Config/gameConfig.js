import Phaser from "phaser";
import baseConfig from "./baseConfig";

export default {
   type: Phaser.AUTO,
   backgroundColor: '#fff',
   scale: {
      parent: baseConfig.gameParent,
      mode: Phaser.Scale.FIT,
      width: baseConfig.w,
      height: baseConfig.h
   },
};