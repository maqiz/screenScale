# screenScale
var  screenWidth = window.screen.availWidth || document.documentElement.clientWidth,
     sWidth = screenWidth > 414 ? (screenWidth / window.devicePixelRatio) : screenWidth,// window.devicePixelRatio(设备像素比)
     fontSize = (sWidth > 414 ? 414 : sWidth) / 750 * 100;
     document.documentElement.style.fontSize = fontSize + "px";

#防抖

function debounce(fn, wait, immediate) {
    let timer = null

    return function() {
        let args = arguments
        let context = this

        if (immediate && !timer) {
            fn.apply(context, args)
        }

        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(context, args)
        }, wait)
    }
}

#节流

function throttle(fn, wait, immediate) {
    let timer = null
    let callNow = immediate
    
    return function() {
        let context = this,
            args = arguments

        if (callNow) {
            fn.apply(context, args)
            callNow = false
        }

        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(context, args)
                timer = null
            }, wait)
        }
    }
