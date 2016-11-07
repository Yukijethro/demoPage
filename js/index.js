// tab 
(function(){
	var controlList = $('.control-list-item');
	var contentList = $('.content-list-item');

	controlList.click(function(event) {
		var index = $(this).index();

		$(this).addClass('active').siblings().removeClass('active');

		contentList.eq(index).slideDown('slow').siblings().slideUp('fast');

	});
})();

// 图片轮播 start
(function(){

function Carousel(){
	var _this = this;
	this.timer = null;
	this.speed = 2000;
	this.carousel = $('#carousel');
	this.prevBtn = this.carousel.find('.prev');
	this.nextBtn = this.carousel.find('.next');
	this.carouselInner = this.carousel.find('.carousel-inner');
	this.carouselArray = this.carousel.find('.carousel-item');
	this.listIndexArray = this.carousel.find('.list-index-item');
	this.singleCarouselItemWidth = $(this.carouselArray[0]).width();

	// 默认需要从第二索引开始，因为索引0的元素为轮播倒退到顶部才显示
	this.carouselIndex = 1;

	this.carousel.hover(function() {
		clearInterval(_this.timer);
	}, function() {
		_this.autoPaly();
	});

	//	取得点击元素的下标，然后运动到按钮下标所对应的元素位置
	this.listIndexArray.click(function(event) {
		var current = $(this).index() + 1;

		if(!$(_this.carouselInner).is(':animated')){
			$(_this.carouselInner).animate({left : -(current * _this.singleCarouselItemWidth)}, 500);
			_this.carouselIndex = current;
			_this.changeCurrentIndexBtn();
		}

	});

	//	左右切换按钮的点击事件
	this.prevBtn.click(function(event) {
		if($(_this.carouselInner).is(':animated')){
			return false;
		}
		_this.move('left');
	});
	this.nextBtn.click(function(event) {
		if($(_this.carouselInner).is(':animated')){
			return false;
		}
		_this.move('right');
	});
}
Carousel.prototype = {
	init : function(){
		this.carouselInner.css('width', this.carouselArray.length * this.singleCarouselItemWidth);
		this.autoPaly();
	},
	autoPaly : function(){
		var _this = this;

		this.timer = setInterval(function(){
			_this.move('right');
		}, _this.speed);
	},
	changeCurrentIndexBtn : function(){
		this.listIndexArray.eq(this.carouselIndex - 1).addClass('current').siblings().removeClass('current');
		if(this.carouselIndex >= (this.carouselArray.length - 1)){
			this.listIndexArray.eq(0).addClass('current').siblings().removeClass('current');
		}
	},
	move : function(dir){
		var _this = this;
		// 此处的carouselIndex是自增还是自减可以决定自动轮播的方向
		if(dir === 'right'){
			_this.carouselIndex++;
		}else{
			_this.carouselIndex--;
		}

		//	#################################################################################################################
		//	此处需要继续优化，当移动到尾部或头部时，需要立即将carouselInner定位到正常显示范围内，而不是在下次运动开始时才定位
		//	#################################################################################################################
		if(_this.carouselIndex > (this.carouselArray.length - 1)){
			//	定位到第二个元素的left
			_this.carouselInner.css('left', -(this.singleCarouselItemWidth));
			// 重置索引到第三个元素
			_this.carouselIndex = 2;
		}

		if(_this.carouselIndex < 0){
			//	定位到倒数第二个元素的left
			_this.carouselInner.css('left', -((this.carouselArray.length - 2) * this.singleCarouselItemWidth));
			//	重置索引到倒数第三个元素
			_this.carouselIndex = this.carouselArray.length - 3;

		}
		
		_this.carouselInner.animate({left : -(_this.carouselIndex * _this.singleCarouselItemWidth)}, 500);
		_this.changeCurrentIndexBtn();
	}

};

new Carousel().init();

})();
// 图片轮播 end

// 元素拖曳 start
window.onload = function(){

	(function(){

		function MoveElement(){
			var _this = this;
			this.moveEl = this.getElementsByClassName('moveEl')[0];
			this.con    = document.getElementById('moveElement');

			this.moveEl.onmousedown = function(ev){
				ev = ev || window.event;
				var targetX = ev.clientX - _this.moveEl.offsetLeft;
				var targetY = ev.clientY - _this.moveEl.offsetTop;


				document.onmousemove = function(event){
					event = event || window.event;
					var maxW = _this.con.offsetWidth;
					var maxH = _this.con.offsetHeight;
			
					var posX = event.clientX - targetX;
					var posY = event.clientY - targetY;

					//	减去border
					maxW = maxW - _this.moveEl.offsetWidth - 2;
					maxH = maxH - _this.moveEl.offsetHeight - 2;

					_this.moveEl.style.left = event.clientX - targetX + 'px';
					_this.moveEl.style.top = event.clientY - targetY + 'px';

					if(posX <= 0){
						_this.moveEl.style.left = 0 + 'px';
					}else if(posX >= maxW){
						_this.moveEl.style.left = maxW + 'px';
					}

					if(posY <= 0){
						_this.moveEl.style.top = 0 + 'px';
					}else if(posY >= maxH){
						_this.moveEl.style.top = maxH + 'px';
					}

					document.onmouseup = function(){
						document.onmousemove = null;
					}

				}
			}
		}
		MoveElement.prototype = {
			getElementsByClassName : function(className, parent){
				if(document.getElementsByClassName){
					return document.getElementsByClassName(className);
				}else{
					var elArray = Array();
					var oParent = parent?parent:document.getElementsByTagName('*');

					for(var i = 0; i < oParent.length; i++){
						if(oParent[i].className === className){
							elArray.push(oParent[i]);
						}
					}
					return elArray;
				}
			}

		};

		new MoveElement();

	})();
}

// 元素拖曳 end


$.prototype.tabs = function(options){
	this.each(function(index, el) {
		new Tabs($(el), options);
	});

	return this;
};

function Tabs($elem, options){
	var that    = this;

	var defaults = {
	    cIndex		: 0,             			//当前显示tab名称
	    tabNavs: '.tab__navs',
	    tabTabs: '.tab__tabs',
	    tabLinkClass: '.tab__link',
	    tabItemClass: '.tab__item',
	    activeClass : 'active'      			//当tab被选择时的样式
	};

	this.options = $.extend({}, defaults, options); //初始化参数
	this.$elem   = $elem;
	this.$navs	 = this.$elem.children(this.options.tabNavs);
	this.$tabs   = this.$elem.children(this.options.tabTabs);

	this.init();
}

Tabs.prototype.init = function(){
	//	初始化显示
	this.show(this.options.cIndex);

	this.events();
};

Tabs.prototype.events = function(){
	var that = this;

	this.$navs.on('click', this.options.tabLinkClass, function(){
		var index = $(this).index();
		that.show(index);
	});
};

Tabs.prototype.show = function(index){
	//	判断上一次点击和当前点击的是否为同一元素,如果是直接返回
	if(this.cIndex === index){
		return; 
	};
	//	如果点的是新元素，则把之前的隐藏掉
	this.hide(this.cIndex);
	//	把当前点击的下标缓存起来
	this.cIndex = index;
	//	显示当前元素
	this.$tabs.children(this.options.tabItemClass).eq(index).addClass(this.options.activeClass);
	this.$navs.children(this.options.tabLinkClass).eq(index).addClass(this.options.activeClass);
};

Tabs.prototype.hide = function(index){
	this.$tabs.children(this.options.tabItemClass).eq(index).removeClass(this.options.activeClass);
	this.$navs.children(this.options.tabLinkClass).eq(index).removeClass(this.options.activeClass);
};

$('.tab').tabs({
	cIndex: 0
});


var Accordion = function($el) {
	var that = this;

	$el.on('click', '.accordion__link', function(event){
		var $targetElem = $(event.target);

		that.dropdown($targetElem);
	});
};

Accordion.prototype.dropdown = function($targetElem) {
	var 
		$parent = $targetElem.parent(),
		$next   = $targetElem.next('.accordion__submenu');

	$next.slideToggle();
	$parent.toggleClass('open');
};	

var accordion = new Accordion($('.accordion'));