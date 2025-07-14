$(function() {
	let currentPage = 1;
	const itemsPerPage = 6;
	let productsData = [];
	let productsDataLength;
	let totalPages;

	function init() {
		// 从URL获取初始页码
		const params = new URLSearchParams(window.location.search);
		currentPage = parseInt(params.get('p')) || currentPage;
		console.log("currentPage:" + currentPage)
		// 加载JSON数据
		$.getJSON('json/products.json', function(data) {
			productsData = data.data;
			productsDataLength = productsData.length;
			totalPages = Math.ceil(productsDataLength / itemsPerPage);
			loadPageBegin(currentPage);
		}).fail(function() {
			console.error('Failed to load data...');
		});
	}

	function loadPage(page) { 
		if (page <= 0) {
			page = 1
		} else if (page > totalPages) {
			page = totalPages
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
		const $container = $('#zf-product-list');
		$container.empty();

		products.forEach(product => {
		  $container.append(`
			<a href="products/${product.id}.html" class="grid" title="${product.title}">
				<div class="img-holder">
					<img src="${product.img}" alt="${product.title}">
					<i class="flaticon-zfck-1 center-icon"></i>
				</div>
				<div class="details zf-pro-dt-h">
					<div class="zf-pro-jianjie">
						<h3 class="zf-pro-h50">${product.title}</h3>
						<p>${product.desc}</p>
					</div>
				</div>
			</a>
		  `);
		});
	}

	function updatePaginationControls( current) {
		$('#zf-products-pages-now').html(`
			<div>第<span>${current}</span>页</div>/
			<div>共<span>${totalPages}</span>页</div>
		`);

		// 更新按钮状态
		// $('#prev-page').prop('disabled', current <= 1);
		// $('#next-page').prop('disabled', current >= totalPages);
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

	
});