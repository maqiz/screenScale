var list_content = $("#order_list"),
    order_data = {},
    curType = 'state_all';
// var key = getCookie

// 首次加载订单列表
function getOrders(type, show){
    var temp = type == 'state_all' ? '' : type ;
    $.post(
        API_BASE_URL+'member_order?op=order_list',
        {key: key, state_type:temp},
        function(data){
            order_data[type] = {type: type, order_list:data.datas.order_group_list, hasmore: data.pager.hasmore, next: data.pager.next};
            show && selectOrder(type, show);
        }
    )
}

// 加载下一页的列表
function getNextOrder(next){
    var type = curType == 'state_all' ? '' : curType;
    $.post(
        API_BASE_URL+'member_order?op=order_list&page='+next,
        {key:key, state_type:type},
        function(data){
            // $("#"+curType).html(data.datas.count);
            order_data[curType]['order_list'] = order_data[curType]['order_list'].concat(data.datas.order_group_list);
            var html = template('order_temp', {type: curType, order_list:data.datas.order_group_list});
            // console.log(order_data[type]);
            list_content.append(html)
            // show && selectOrder(type);
            if (data.pager.hasmore){
                order_data[curType]['next'] = data.pager.next;
            }else{
                order_data[curType]['hasmore'] = false;
            }
            isloading = false;
        }
    )
}

// 选择列表数据显示
function selectOrder(type, obj){
    if (!order_data[type]) {
        getOrders(type, obj);
        return;
    }
    var html = template('order_temp', order_data[type]);
    console.log(order_data[type]);
    // console.log(html);
    list_content.html(html)
    curType = type;
    if (typeof obj == 'string'){
        $('#'+obj).addClass('selected').siblings().removeClass('selected');
    }else{
        $(obj).addClass('selected').siblings().removeClass('selected');
    }
}
curType = getQueryString('state_type') || curType;
// 初始化
getOrders(curType, curType);
// getOrders('state_new');
// getOrders('state_pay');
// getOrders('state_send');
// getOrders('state_noeval');

// 滚动监听
var isloading = false;
window.onscroll = throttle(function(){
    if (isloading) { //防止scroll重复执行
        return false;
    }
    if (($(window).scrollTop() + $(window).height() > $(document).height() - 1) && order_data[curType]['hasmore']) {
        isloading = true;
        getNextOrder(order_data[curType]['next']);
    }
}, 250);
