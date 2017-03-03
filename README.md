# screenScale
var  screenWidth = window.screen.availWidth || document.documentElement.clientWidth,
     sWidth = screenWidth > 414 ? (screenWidth / window.devicePixelRatio) : screenWidth,// window.devicePixelRatio(设备像素比)
     fontSize = (sWidth > 414 ? 414 : sWidth) / 750 * 100;
     document.documentElement.style.fontSize = fontSize + "px";
