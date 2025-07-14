$(function(){
	
// 详情标签切换 开始
	if (document.querySelector('.zf-pro-details-title')) {
		$('.zf-pro-details-title li').mousedown(function(){
			$index = $(this).index();
			$(this).addClass('zf-select').siblings().removeClass('zf-select');
			$('.zf-pro-details-lab').eq($index).addClass('zf-show').siblings().removeClass('zf-show');
		})
	}
// 详情标签切换 结束
	
	
// 加载产品页右侧热门列表 s
	// 原生js
	if (document.getElementById('zf-hot-pro-js')) {
		fetch('right-hot.html')
			.then(response => response.text())
			.then(html => {
				document.getElementById('zf-hot-pro-js').innerHTML = html;
			})
			.catch(err => console.error('导航加载失败:', err));
	}
// 加载产品页右侧热门列表 e
	
// 右侧nav滚动固定 开始
	if (document.querySelector('.zf-pro-details-right')) {
		const $parent = $('.zf-pro-details-right');
		const $target = $('.zf-pro-details-nav-box');
		let metrics = {
			offsetTop: $parent.offset().top,
			parentWidth: $parent.outerWidth(),
			left: $parent.offset().left
		};
		
		// 响应式断点
		const isMobile = () => window.innerWidth < 992;
		
		// 核心逻辑（保持丝滑感）
		const update = () => {
			if(isMobile()) return $target.removeAttr('style');
			
			const scrollTop = $(window).scrollTop();
			if(scrollTop > metrics.offsetTop) {
				$target.css({
					position: 'fixed',
					top: '30px',
					left: metrics.left,
					width: metrics.parentWidth,
					'max-width': 'calc(100vw - 40px)'
				});
			} else {
				$target.removeAttr('style');
			}
		};
		
		// 优化事件处理
		let ticking = false;
		const handleScroll = () => {
			if(!ticking) {
				requestAnimationFrame(() => {
					update();
					ticking = false;
				});
				ticking = true;
			}
		};
		
		// 防抖resize
		let resizeTimer;
		$(window)
			.on('scroll', handleScroll)
			.on('resize', () => {
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(() => {
					metrics = {
						offsetTop: $parent.offset().top,
						parentWidth: $parent.outerWidth(),
						left: $parent.offset().left
					};
					update();
				}, 10);
		});
	}
// 右侧nav滚动固定 结束
	
	
// swiper 主图轮播图 开始
	zfProductSwiper();
	function zfProductSwiper() {
		// 1、缩略图
		if (document.querySelector('.mySwiper')) {
			var swiper = new Swiper(".mySwiper", {
				loop: false,  // 无限循环
				spaceBetween: 10,  // 图片间距
				slidesPerView: 4,  // 缩略图的数量
				freeMode: true,  // 拖动滚动条
				watchSlidesProgress: true,  
				mousewheel: true,  // 滚轮换图
				scrollbar: {
					el: '.swiper-scrollbar',  // 滚动条，类选择器
					hide: true,  // 滚动条自动隐藏
					draggable: true,  // 允许拖动滚动条
				},
			});
		}
		
		// 2、主图
		if (document.querySelector('.mySwiper2')) {
			var swiper2 = new Swiper(".mySwiper2", {
				loop: false,  // 无限循环
				spaceBetween: 10, // 图片间距
				navigation: {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
					hideOnClick: true, // 点击图层隐藏箭头
				},
				thumbs: {
					swiper: swiper,
					autoScrollOffset: 1,  // 缩略图点击到两侧时，自动滑动
				},
				
				zoom : true, // 缩放，图片需要被swiper-zoom-container类的元素包裹
				mousewheel: true,  // 滚轮换图
				
				scrollbar: {
					el: '.swiper-scrollbar',  // 滚动条，类选择器
					hide: true,  // 滚动条自动隐藏
					draggable: true,  // 允许拖动滚动条
				},
				// 鼠标置于图片之上停止自动播放
				// autoplay: {
				// 	pauseOnMouseEnter: false,  // 无论是true还是false都一样？
				// },
			});
		}
	}
	
// swiper 主图轮播图 结束

// 当前页面的导航选中状态 s
	zfPageNavActive();
	function zfPageNavActive() {
		const zfCurrentPage = $('.zf-current-page-name');
		let pageName = zfCurrentPage.data('zf-current-page-name');
		let dataName = `li[data-page-name="${pageName}"]`;
		$(dataName).addClass('zf-nav-active');
	}
// 当前页面的导航选中状态 e
	
	
	
//右侧滚动固定 开始 留作备用，未做优化
	// const $zfProRight = $('.zf-pro-details-right');
	// const $zfProRightBox = $('.zf-pro-details-nav-box');
	// var ofsetTop = $zfProRight.offset().top;
	// var parentWidth = $zfProRight.outerWidth(); // 获取父元素宽度
	// // 使用requestAnimationFrame优化滚动处理
	// let ticking = false;
	// $(window).on('resize scroll', function() {
	//   if (!ticking) {
	// 	window.requestAnimationFrame(function() {
	// 	  const scrollTop = $(window).scrollTop();
	// 	  const topDiff = scrollTop - ofsetTop;
	// 	  setBox(topDiff, $zfProRightBox, $zfProRight, parentWidth);
	// 	  ticking = false;
	// 	});
	// 	ticking = true;
	//   }
	// });
	
	// function setBox(topDiff, $zfProRightBox, $zfProRight, parentWidth){
	// 	console.log(1);
		
	// 	if (topDiff > 0) {
	// 		$zfProRightBox.css({
	// 			"position": "fixed",
	// 			"top": "30px",
	// 			"left": $zfProRight.offset().left,
	// 			"width": parentWidth // 设置与父元素相同的宽度
	// 		});
	// 	} else {
	// 		$zfProRightBox.removeAttr('style');
	// 	}
	// }
//右侧滚动固定 结束 留作备用，未做优化


	
	
// 搜索引擎日志 开始
	
	
	
// 搜索引擎日志 结束
	
	
	
	
	
	
	
	
	
	
})