const gameParent_ = document.getElementById('app');

export default {
   gameParent: document.getElementById('app'),
   assets_url: './assets/',
   w: (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPod|Opera Mini|IEMobile/i) ? gameParent_.clientWidth : 540) * window.devicePixelRatio,
   h: (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPod|Opera Mini|IEMobile/i) ? gameParent_.clientHeight : 960) * window.devicePixelRatio,
   scaleRatio: window.devicePixelRatio / 3,
   gridX: 3,
   gridY: 3,
}