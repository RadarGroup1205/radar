layui.use(['layer', 'form', 'element', 'jquery', 'dialog'], function() {
	var layer = layui.layer;
	var element = layui.element();
	var form = layui.form();
	var $ = layui.jquery;
	var dialog = layui.dialog;
	var hideBtn = $('#hideBtn');
	var mainLayout = $('#main-layout');
	var mainMask = $('.main-mask');

	//触发事件
	var active = {
		tabAdd:function (name,url,layid) {
			element.tabAdd('tab', {
				title: name //'选项卡的标题'
			,content: '<iframe id="iframeMain" style="width: 100%" ; height="100%" ; scrolling="no" frameborder="no" src="'+url+'"></iframe>'//'选项卡的内容' //支持传入html
			,id: layid//'选项卡标题的lay-id属性值'
			});
		},
		tabChange:function (layid) {
			element.tabChange('tab', layid);
		},
		tabDelete:function (layid) {
			element.tabDelete('tab', layid);
		}
	}


		  //当点击有siteactive属性的标签时，即左侧菜单栏中内容 ，触发点击事件
		$('.site-active').on("click", function () {
			var dataid = $(this);
			var name = dataid.attr("data-text");
			var url = dataid.attr("data-url");
			var tab_layid = dataid.attr("data-id");
			//alert(1111111)
			//1、 判断tab-layid=layid的tab页是否打开
			if ($(".layui-tab-title li[lay-id]").length <= 0) { //1.1 初始状态：1个Tab页也没有打开
				//alert(2222222)
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

	
	//监听导航点击
	// element.on('nav(leftNav)', function(elem) {
	// 	var navA = $(elem).find('a');
	// 	var id = navA.attr('data-id');
	// 	var url = navA.attr('data-url');
	// 	var text = navA.attr('data-text');
	// 	if(!url){
	// 		return;
	// 	}
	// 	var isActive = $('.main-layout-tab .layui-tab-title').find("li[lay-id=" + id + "]");
	// 	if(isActive.length > 0) {
	// 		//切换到选项卡
	// 		element.tabChange('tab', id);
	// 	} else {
	// 		element.tabAdd('tab', {
	// 			title: text,
	// 			content: '<iframe src="' + url + '" name="iframe' + id + '" class="iframe" framborder="0" data-id="' + id + '" scrolling="auto" width="100%"  height="100%"></iframe>',
	// 			id: id
	// 		});
	// 		element.tabChange('tab', id);
			
	// 	}
	// 	mainLayout.removeClass('hide-side');
	// });
	// //监听导航点击
	// element.on('nav()', function(elem) {
	// 	var navA = $(elem).find('a');
	// 	var id = navA.attr('data-id');
	// 	var url = navA.attr('data-url');
	// 	var text = navA.attr('data-text');
	// 	if(!url){
	// 		return;
	// 	}
	// 	var isActive = $('.main-layout-tab .layui-tab-title').find("li[lay-id=" + id + "]");
	// 	if(isActive.length > 0) {
	// 		//切换到选项卡
	// 		element.tabChange('tab', id);
	// 	} else {
	// 		element.tabAdd('tab', {
	// 			title: text,
	// 			content: '<iframe src="' + url + '" name="iframe' + id + '" class="iframe" framborder="0" data-id="' + id + '" scrolling="auto" width="100%"  height="100%"></iframe>',
	// 			id: id
	// 		});
	// 		element.tabChange('tab', id);
			
	// 	}
	// 	mainLayout.removeClass('hide-side');
	// });
	//菜单隐藏显示
	hideBtn.on('click', function() {
		if(!mainLayout.hasClass('hide-side')) {
			mainLayout.addClass('hide-side');
		} else {
			mainLayout.removeClass('hide-side');
		}
	});
	//遮罩点击隐藏
	mainMask.on('click', function() {
		mainLayout.removeClass('hide-side');
	})

	//示范一个公告层
//	layer.open({
//		  type: 1
//		  ,title: false //不显示标题栏
//		  ,closeBtn: false
//		  ,area: '300px;'
//		  ,shade: 0.8
//		  ,id: 'LAY_layuipro' //设定一个id，防止重复弹出
//		  ,resize: false
//		  ,btn: ['火速围观', '残忍拒绝']
//		  ,btnAlign: 'c'
//		  ,moveType: 1 //拖拽模式，0或者1
//		  ,content: '<div style="padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">后台模版1.1版本今日更新：<br><br><br>数据列表页...<br><br>编辑删除弹出功能<br><br>失去焦点排序功能<br>数据列表页<br>数据列表页<br>数据列表页</div>'
//		  ,success: function(layero){
//		    var btn = layero.find('.layui-layer-btn');
//		    btn.find('.layui-layer-btn0').attr({
//		      href: 'http://www.layui.com/'
//		      ,target: '_blank'
//		    });
//		  }
//		});
});