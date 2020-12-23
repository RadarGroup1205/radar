layui.use(['element','jquery'], function () {
    var element = layui.element,
     $ = layui.jquery;

    //触发事件
    var active = {
        tabAdd:function (name,url,layid) {
            element.tabAdd('tabList', {
             title: name //'选项卡的标题'
            ,content: '<iframe id="iframeMain" style="width: 100%" ; height="100%" ; scrolling="no" frameborder="no" src="'+url+'"></iframe>'//'选项卡的内容' //支持传入html
            ,id: layid//'选项卡标题的lay-id属性值'
            });
        },
        tabChange:function (layid) {
            element.tabChange('tabList', layid);
        },
        tabDelete:function (layid) {
            element.tabDelete('tabList', layid);
        }
    }


      //当点击有siteactive属性的标签时，即左侧菜单栏中内容 ，触发点击事件
    $('.site-active').on("click", function () {
        alert(1111111111111111)
        var dataid = $(this);
        var name = dataid.attr("tab-name");
        var url = dataid.attr("tab-url");
        var tab_layid = dataid.attr("tab-layid");
        active.tabAdd(name, url = "", tab_layid);
        active.tabChange(tab_layid)
       
        //1、 判断tab-layid=layid的tab页是否打开
        if ($(".layui-tab-title li[lay-id]").length <= 0) { //1.1 初始状态：1个Tab页也没有打开
            active.tabAdd(name, url, tab_layid); //打开tab页
            active.tabChange(tab_layid)//转到该tab页
        } else { //1.2   判断该Tab页是否已打开
            var isData = false; //初始化一个标志，为false说明未打开该tab项 为true则说明已有
            $.each($(".layui-tab-title li[lay-id]"), function () {
               
                //如果点击左侧菜单栏所传入的id 在右侧tab项中的lay-id属性可以找到，则说明该tab项已经打开
                if ($(this).attr("lay-id") == tab_layid) {
                    isData = true;
                     
                }
            })
            if (isData == false) {
                //标志为false 新增一个tab项
                active.tabAdd(name, url, tab_layid); //1.2.1  该Tab页未打开，则打开该tab页
            }

            active.tabChange(tab_layid)//1.2.2 转到该tab页
        }

  
         FrameWH();  //计算ifram层的大小

    });



     function FrameWH() { //计算ifram层的大小
        var h = $(window).height() - 41 - 10 - 60 - 10 - 44 - 10;
        $("iframe").css("height", h + "px");
    }

    $(window).resize(function () {
        FrameWH();
    })

});