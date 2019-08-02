import "phaser";
import baseConfig from "../Config/baseConfig";


export default class BootScene extends Phaser.Scene {
   constructor () {
     super('Boot');
   }

   loadFonts(){
      var element = document.createElement('style');
      document.head.appendChild(element);

      var sheet = element.sheet;
      var styles = '@font-face { font-family: "kidsrock"; src: url("' + baseConfig.assets_url + '/fonts/kidsrock.otf") format("opentype"); }';
      sheet.insertRule(styles, 0);
   }

   init(){
      this.loadFonts();
   }
  
   preload () {
      console.log('Device Pixel Ratio: ' + window.devicePixelRatio)
      console.log('Enter scene ' + this.scene.key)
      console.log(baseConfig.gameParent.clientHeight)

      this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

   }
  
   create () {
      this.cameras.main.setBackgroundColor(0xfff1c4)

      var userData;
      var options = {
         method: 'get',
         headers: {
             "Access-Control-Request-Headers": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
             "Access-Control-Request-Method": "X-Requested-With, content-type, Authorization"
         },
      }

      fetch('https://randomuser.me/api?inc=name,registered,picture', options)
      .then(resp => resp.json())
      .then(function(data){
         userData = { ...data.results[0] }

         this.scene.start('Preloader', {userData});
         
      }.bind(this))
      .catch(function(err) {
         console.log(err)
      });
   }
};