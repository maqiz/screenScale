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
    
    /* 初始化canvas圆动画 */
    initialCircleAnimation = (count) => {
        try {
            /* 比例值 */
            const scala = ((window.screen.availWidth || document.documentElement.clientWidth)/ 750).toFixed(2);
            this.canvasEl.width = 260*scala;
            this.canvasEl.height = 260*scala;
            const ctx = this.canvasEl.getContext('2d');
            let i = 0;
            this.timer = setInterval(() => {
                if(count >=i) {
                    this.strokeCircle(i, ctx, scala);
                    i++;
                } else {
                    this.clearStrokeTimer();
                }
            }, 20)
            
        } catch (error) {
            throw new Error(error)
        }
    }

    /* 绘画圆环 */
    strokeCircle = (n, ctx, scala) => {
        const width = this.canvasEl.width;
        const height = this.canvasEl.height;
        const cirX = width / 2,cirY = height / 2;
        const rad = Math.PI * 2 / 100, r= 100 * scala;
        const gradient = ctx.createLinearGradient(0, 0, width,height);
        gradient.addColorStop('0.25', '#FFE077');
        gradient.addColorStop('0.5', '#77FFFE');
        gradient.addColorStop('0.75', '#FF8379');
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.beginPath(); //路径开始
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 24*scala;
        ctx.lineCap = "round";
        ctx.arc(cirX, cirY, r, -Math.PI / 2, -Math.PI / 2 + n * rad, false); //用于绘制圆弧ctx.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        /* 绘画小圆 */
        const smallR = 16*scala;
        const x= cirX - Math.cos(-n * rad -Math.PI / 2) * r,
        y = Math.sin(-n * rad -Math.PI / 2) * r + cirY;
        ctx.save();
        ctx.beginPath(); //路径开始
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 12*scala;
        ctx.arc(x, y, smallR,0 , Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    /* 清除画圆环动画定时器 */
    clearStrokeTimer = () => {
        try {
            if( this.timer ) {
                clearInterval(this.timer);
                this.timer = null
            }
        } catch (error) {
            throw new Error(error)
        }
    }
    
    /* 向内凹的圆 */
    background: radial-gradient(50px at left top,transparent 50%,#fff 50%) top left / 50% 50% no-repeat,
                    radial-gradient(50px at right top,transparent 50%,#fff 50%) top right /50% 50% no-repeat,
                    radial-gradient(50px at left bottom,transparent 50%,#fff 50%) left bottom / 50% 50% no-repeat,
                    radial-gradient(50px at right bottom,transparent 50%,#fff 50%) right bottom / 50% 50% no-repeat,
