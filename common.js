/*通用常量*/
var curPopup,
    header = $('#header'),
    $mask = $('#mask'),
    $body = $('body')

/*基本常量*/
var API_BASE_URL = location.origin + '/mobile/',
    SITE_URL = location.origin,
    body = $('#container'),
    key = getCookie('key');

var DEBUG = location.origin.indexOf('test.haodiaoju.cn') > 0;
// var key = COMMON_VAR.key || '882c1ad4a2ef0ef36ad87abe68486773'

/*通用函数*/
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2];
    return '';
}

function addCookie(name, value, expireHours) {
    var cookieString = name + "=" + escape(value) + "; path=/";
    //判断是否设置过期时间
    if (expireHours > 0) {
        var date = new Date();
        date.setTime(date.getTime() + expireHours * 3600 * 1000);
        cookieString = cookieString + ";expires=" + date.toGMTString();
    }
    document.cookie = cookieString;
}

function getCookie(name) {
    var strcookie = document.cookie;
    var arrcookie = strcookie.split("; ");
    for (var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == name) return unescape(arr[1]);
    }
    return null;
}

function delCookie(name) { //删除cookie
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + "; path=/;expires=" + exp.toGMTString();
}

/*左上角返回*/
body.on('click', '.back', function(ev) {
    ev.preventDefault();
    var tmp = $(this).parent().parent();
    console.log(tmp.hasClass('show'));
    if (curPopup && curPopup.hasClass('show')) {
        hidePopup();
    } else if (tmp.hasClass('show')) {
        tmp.removeClass('show')
        hidePopup();
    } else {
        history.go(-1);
    }
})

function hidePopup() {
    $mask && $mask.removeClass('show');
    curPopup && curPopup.removeClass('show');
    $body.removeClass('disabled-scroll');
    var hasShow = $('.show');
    if (hasShow.length > 0) {
        curPopup = $(hasShow[hasShow.length - 1]);
    }
}

function infiniteScroll() {
    var limit, page, hasmore, isloading;

    infiniteScroll.prototype.init = function(options) {
        var defaults = {
            data: {},
            callback: function() {},
            resulthandle: ''
        }
        var options = $.extend({}, defaults, options);
        if (options.iIntervalId) {
            limit = options.limit > 0 ? options.limit : 10;
            page = 1;
            hasmore = true;
            isloading = false;
        }
        infiniteScroll.prototype.getList(options);
        $(window).scroll(function() {
            if (isloading) { //防止scroll重复执行
                return false;
            }
            if (($(window).scrollTop() + $(window).height() > $(document).height() - 1)) {
                isloading = true;
                options.iIntervalId = false;
                infiniteScroll.prototype.getList(options);
            }
        });
    }

    infiniteScroll.prototype.getList = function(options) {
        if (!hasmore) {
            $('.loading').remove();
            return false;
        }
        param = {};
        //参数
        if (options.getparam) {
            param = options.getparam;
        }
        //初始化时延时分页为1
        if (options.iIntervalId) {
            param.page = 1;
        }
        param.limit = limit;
        param.page = page;
        $.getJSON(options.url, param, function(result) {
            // checkLogin(result.login);
            $('.loading').remove();
            console.log(result);
            page++;
            var data = $.extend({}, result.datas, result.pager);
            console.log(data);
            var html = template(options.tmplid, data);
            if (options.iIntervalId === false) {
                $(options.containerobj).append(html);
            } else {
                $(options.containerobj).html(html);
            }
            hasmore = result.pager.hasmore;
            if (!hasmore) {
                $('.loading').remove();
            }
            if (options.callback) {
                // options.callback.call('callback');
                options.callback && options.callback(data);
            }
            isloading = false;
        });
    }
}


/*节流函数*/
throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
        previous = options.leading === false ? 0 : new Date();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function() {
        var now = new Date();
        if (!previous && options.leading === false) previous = now;
        // 计算剩余时间
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        // 当到达wait指定的时间间隔，则调用func函数
        // 精彩之处：按理来说remaining <= 0已经足够证明已经到达wait的时间间隔，但这里还考虑到假如客户端修改了系统时间则马上执行func函数。
        if (remaining <= 0 || remaining > wait) {
            // 由于setTimeout存在最小时间精度问题，因此会存在到达wait的时间间隔，但之前设置的setTimeout操作还没被执行，因此为保险起见，这里先清理setTimeout操作
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            // options.trailing=true时，延时执行func函数
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};

/*辅助函数*/
template && template.helper('dateParser', function(date, format) {
    format = format || 'yyyy-MM-dd hh:mm:ss';
    date = date * 1000;
    var dateline = new Date(date);
    return format.replace(/yyyy/g, dateline.getFullYear())
        .replace(/MM/g, dateline.getMonth() + 1)
        .replace(/dd/g, dateline.getDate())
        .replace(/hh/g, dateline.getHours())
        .replace(/mm/g, dateline.getMinutes())
        .replace(/ss/g, dateline.getSeconds());
});
var urlReg = /^haodiaoyu:\/\/shop_goods\?params=(\d*)$/;
template && template.helper('urlParser', function(url) {
    var match = url.match(urlReg);
    // console.log(match, url);
    return match ? SITE_URL + '/wap/goods_detail.html?goods_id=' + match[1] : url;
});
$.fn.number = function() {
    return new Number(this.html())
}

/**
 * 异步上传图片
 */
$.fn.ajaxUploadImage = function(options) {
    var defaults = {
        url: '',
        data: {},
        start: function() {}, // 开始上传触发事件
        success: function() {}
    }
    var options = $.extend({}, defaults, options);
    var _uploadFile;

    function _checkFile() {
        //文件为空判断
        if (_uploadFile === null || _uploadFile === undefined) {
            alert("请选择您要上传的文件！");
            return false;
        }
        return true;
    };
    return this.each(function() {
        $(this).on('change', function() {
            var _element = $(this);
            options.start.call('start', _element);
            _uploadFile = _element.prop('files')[0];
            if (!_checkFile) return false;
            try {
                //执行上传操作
                var xhr = new XMLHttpRequest();
                xhr.open("post", options.url, true);
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        returnDate = $.parseJSON(xhr.responseText);
                        options.success.call('success', _element, returnDate);
                    };
                };
                //表单数据
                var fd = new FormData();
                for (k in options.data) {
                    fd.append(k, options.data[k]);
                }
                fd.append(_element.attr('name'), _uploadFile);
                //执行发送
                result = xhr.send(fd);
            } catch (e) {
                console.log(e);
                alert(e);
            }
        });
    });
}
//防止遮罩、弹框滑动
preventMove($('#mask'));
preventMove($('#dialog'));
preventMove($('.common-header'));
//防止弹框滑动
function preventMove(obj) {
	$(obj).on('touchmove',function(e) {
		e.preventDefault();
	})
}
