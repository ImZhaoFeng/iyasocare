$(function() {
	let currentPage = 1;
	const itemsPerPage = 6;
	let productsData = [];
	let productsDataLength;
	let totalPages;
	const zfProductsPagesNow = $('#zf-products-pages-now');
	const zfPageCurrent = zfProductsPagesNow.find('#zf-page-current');
	const zfPageTotal = zfProductsPagesNow.find('#zf-page-total');

	function init() {
		// 从URL获取初始页码
		const params = new URLSearchParams(window.location.search);
		currentPage = parseInt(params.get('p')) || currentPage;
		// 加载JSON数据
		$.getJSON('json/products.json', function(data) {
			productsData = data.data.filter(item => item.use == 1); // 只选择use == 1的
			productsDataLength = productsData.length;
			totalPages = Math.ceil(productsDataLength / itemsPerPage);
			$('#page-input').attr('max', totalPages);
			loadPageBegin(currentPage);
		}).fail(function() {
			$('#zf-products-list').text('Sorry, there is an error with the API loading.');
		});
	}

	function loadPage(page) { 
		if (page <= 0) {
			page = 1;
		} else if (page > totalPages) {
			page = totalPages;
		} else if (currentPage !== page){
			loadPageBegin(page);
		}
		// 将当前页数的数值赋值给变量currentPage
		currentPage = page;
	}
	function loadPageBegin(page) {
		const start = (page - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		const paginatedData = productsData.slice(start, end);
		
		// 更新URL参数
		const newUrl = new URL(window.location.href);
		newUrl.searchParams.set('p', page.toString());
		history.pushState({}, '', newUrl);
		
		// 渲染产品
		renderProducts(paginatedData);
		
		// 更新分页控件
		updatePaginationControls(page);
	}
	

	function renderProducts(products) {
		const $container = $('#zf-products-list');
		$container.empty();

		products.forEach(product => {
		  $container.append(`
			<a href="products/${product.id}.html" title="${product.title}">
				<div class="img-box">
					<img src="${product.img}" alt="${product.title}">
					<i class="flaticon-zfck-1 center-icon"></i>
				</div>
				<div class="details zf-pro-disc">
					<span>0</span>
					<div class="zf-pro-jianjie">
						<h3>${product.title}</h3>
						<p>${product.desc}</p>
					</div>
				</div>
			</a>
		  `);
		});
	}

	function updatePaginationControls( current) {
		zfPageCurrent.text(current);
		zfPageTotal.text(totalPages);
		$('#page-input').val(current);
		
		// 换成div
		if (current <= 1) {
			$('#prev-page').addClass('zf-page-arrow-disabled');
			$('#first-page').addClass('zf-page-arrow-disabled');
		} else {
			$('#prev-page').removeClass('zf-page-arrow-disabled');
			$('#first-page').removeClass('zf-page-arrow-disabled');
		}
		if (current >= totalPages) {
			$('#next-page').addClass('zf-page-arrow-disabled');
			$('#last-page').addClass('zf-page-arrow-disabled');
		} else {
			$('#next-page').removeClass('zf-page-arrow-disabled');
			$('#last-page').removeClass('zf-page-arrow-disabled');
		}
		
		
	}

	// 初始化加载
	init();

	// 事件绑定
	$('#first-page').click(() => loadPage(1));
	$('#prev-page').click(() => loadPage(currentPage - 1));
	$('#next-page').click(() => loadPage(currentPage + 1));
	$('#last-page').click(() => loadPage(Math.ceil(productsData.length / itemsPerPage)));
	$('#go-page').click(() => {
		const target = parseInt($('#page-input').val());
		if (target > 0 && target <= Math.ceil(productsData.length / itemsPerPage)) {
			loadPage(target);
		}
	});
	// 回车键事件
	$('#page-input').keydown((event) => {
	    if (event.key === 'Enter') {  // 检测是否按下回车键
	        const target = parseInt($('#page-input').val());
	        if (target > 0 && target <= Math.ceil(productsData.length / itemsPerPage)) {
	            loadPage(target);
	        }
	    }
	});
	$('#page-input').on('keydown', function(e) {
		// 阻止输入小数点（. 和 , 键）
		if (e.key === '.' || e.key === ',') {
			e.preventDefault();
		}
	}).on('input', function(){
		if ($(this).val() > totalPages) {
			$(this).val(totalPages);
		}
	});
	
});


/*
const currentUrl = window.location.href;
const query = window.location.search.substring(1);
const queryArr = query.split('&');
const queryAbj = {};
for (const pair of queryArr) {
	const [key, value] = pair.split('=');
	queryAbj[decodeURIComponent(key)] = decodeURIComponent(value || '');
}
console.log(queryAbj);
*/

