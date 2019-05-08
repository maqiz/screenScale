# screenScale
var  screenWidth = window.screen.availWidth || document.documentElement.clientWidth,
     sWidth = screenWidth > 414 ? (screenWidth / window.devicePixelRatio) : screenWidth,// window.devicePixelRatio(设备像素比)
     fontSize = (sWidth > 414 ? 414 : sWidth) / 750 * 100;
     document.documentElement.style.fontSize = fontSize + "px";
     
     
#手淘对rem和1px细线处理
!function (e, t) {
    var n = t.documentElement,
        d = e.devicePixelRatio || 1;
    function i() {
        var e = n.clientWidth / 7.5; // 7.5 = 设计稿宽度/100
        n.style.fontSize = e + "px"
    }
    if (function e() {
        t.body ? t.body.style.fontSize = "16px" : t.addEventListener("DOMContentLoaded", e)
    }(),
        i(),
        e.addEventListener("resize", i),
        e.addEventListener("pageshow",
            function (e) {
                e.persisted && i()
            }),
        2 <= d) {
        var o = t.createElement("body"),
            a = t.createElement("div"); 
            a.style.border = ".5px solid transparent",
                o.appendChild(a),
                n.appendChild(o),
                console.log(a.offsetHeight)
                1 === a.offsetHeight && n.classList.add("hairlines"),
                n.removeChild(o)
    }
}(window, document)

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
