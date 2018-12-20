$(function () {
	homepage.initPage();
	homepage.bindEvent();
})

var homepage = {
	currentPage: 1,
	totalPage: 2,
	needAddNum: true,
	needShift: true,
	scrollTop: 0,
	initPage: function () {
		this.setCaseContent();
		this.setSize();
		this.setAnimate();
	},
	setCaseContent: function () {
		$(".case-brief-content").each(function (index, item) {
			var content = $(this).parent().parent().attr("content");
			$(item).text(homepage.getTextByLength(content, 112));
		});
	},
	setSize: function () {
		var width = $(window).width();
		if (width < 1440) {
			$(".product-box:nth-child(3n)").hide();
			$(".product-box").css("width","33.3333%");
		} else {
			$(".product-box:nth-child(3n)").show();
			$(".product-box").css("width","25%");
		}
	},
	setAnimate: function () {
		$(window).scroll(function () {
			//数字动效
			var top = $(".statistic-box-wrapper").offset().top;
			var windowAllHeight = $(window).scrollTop() + $(window).height();
			if (top >= $(window).scrollTop() && top < windowAllHeight) {
				if (homepage.needAddNum) {
					homepage.needAddNum = false;
					homepage.addNum($(".count-change"));
					homepage.addNum($(".count-type"));
					homepage.addNum($(".count-zone"));
					homepage.addNum($(".count-percent"));
				}
			} else {
				homepage.needAddNum = true;
			}

			//成功案例动效
			var caseTop = $(".case-box-wrapper").offset().top;
			var caseHeight = $(".case-box-wrapper").height();
			var topToBottom = (caseTop >= $(window).scrollTop() && (caseTop < windowAllHeight));
			var test = (caseTop < $(window).scrollTop() );
			if (topToBottom || test) {
				if (homepage.needShift) {
					homepage.needShift = false;
					$(".case-box-wrapper").animate({paddingLeft: 0}, 1000);
					$(".case-box").animate({opacity:1}, 1000);
				}
			} else {
				homepage.needShift = true;
				$(".case-box-wrapper").css({paddingLeft: "50px"});
				$(".case-box").css({opacity:0});
			}
		});
	},
	addNum: function ($obj) {
		var start= 0;
		var num = parseInt($obj.text());
		var space = Math.ceil(num / 20);
		var interval=setInterval(function(){
			start = start + space;
			if(start > num){
				start = num;
				clearInterval(interval);
			}
			$obj.text(start)
		}, 100);
	},
	bindEvent: function () {
		this.showProductInfo();
		this.showProductNum();
		this.caseBigger();
		this.caseDetail();
		this.goToPage();
	},
	//产品hover效果，显示产品信息
	showProductInfo: function () {
		$(".product-box").hover(function(){
			$(this).find(".product-bigger-image").show().animate({width:"110%",height:"110%",top: "-5%", left:"-5%"}, 1000);
			$(this).find(".product-mask").show().animate({top:"-5%"}, 1000);

			var width= $(this).find(".product-title").width();
			var nameWidth= $(this).find(".product-name").width();
			var managerWidth= $(this).find(".product-manager").width();
			if (width < nameWidth + managerWidth) {
				$(this).find(".product-manager").hide();
			}
			if ($(window).width() > 1180) {
				$("body").css("overflow-x", "hidden");
			}
		},function(){
			$(this).find(".product-manager").show();
			$("body").css("overflow-x", "auto");
			$(this).find(".product-mask").animate({top:"100%"}, 100).hide();
			$(this).find(".product-bigger-image").animate({width:"100%",height:"100%",top: "0", left:"0"},100).hide();
		});
	},
	//根据屏幕宽度显示不同产品个数
	showProductNum: function () {
		$(window).resize(function () {
			homepage.setSize();
		});
	},
	//成功案例hover效果
	caseBigger: function () {
		$(".case-box").hover(function(){

		},function(){
			$(this).find(".case-detail").removeClass("shred");
			$(this).find(".case-detail").text("查看详情");
			var content = $(this).find(".case-box-content").attr("content");
			$(this).find(".case-brief-content").text(homepage.getTextByLength(content, 112));
		});
	},
	//成功案例-查看详情
	caseDetail: function () {
		$(".case-detail").click(function () {
			var content = $(this).parent().parent().attr("content");
			if ($(this).hasClass("shred")) {
				$(this).removeClass("shred");
				$(this).text("查看详情");
				$(this).prev().text(homepage.getTextByLength(content, 112));
			} else {
				$(this).addClass("shred");
				$(this).text("收起详情");
				$(this).prev().text(content);
			}
		});
	},
	// 截取字符串,中文为2个字符
	getTextByLength : function (str, requireLength) {
		var text = str;
		var length = 0;
		if (str) {
			for (var i = 0; i < str.length; i++)
			{
				if (str.substr(i,1).charCodeAt(0) > 255) {
					length = length + 2;
				} else {
					length ++;
				}
				if (length >= requireLength) {
					text = str.substr(0, i-2) + "...";
					break;
				}
			}
		} else {
			text = "";
		}
		return text;
	},
	//成功案例-翻页功能
	goToPage: function () {
		$(".pre-page").click(function () {
			if ($(this).hasClass("pre-disabled")) {
				return;
			}
			homepage.currentPage--;
			$(".dot-page[page='" + homepage.currentPage + "']").trigger("click");
		});

		$(".next-page").click(function () {
			if ($(this).hasClass("next-disabled")) {
				return;
			}
			homepage.currentPage++;
			$(".dot-page[page='" + homepage.currentPage + "']").trigger("click");
		});

		$(".dot-page").click(function () {
			if ($(this).hasClass("current-page")) {
				return;
			}
			$(".current-page").removeClass("current-page");
			$(this).addClass("current-page");
			homepage.currentPage = parseInt($(this).attr("page"));

			if (homepage.currentPage == 1) {
				$(".pre-page").addClass("pre-disabled");
			}
			if (homepage.currentPage < homepage.totalPage) {
				$(".next-page").removeClass("next-disabled");
			}
			if (homepage.currentPage == homepage.totalPage) {
				$(".next-page").addClass("next-disabled");
			}
			if (homepage.currentPage > 1) {
				$(".pre-page").removeClass("pre-disabled");
			}
		});
	}
}