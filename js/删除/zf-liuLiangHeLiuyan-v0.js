$(function(){
	liuLiangHeLiuyan();
	function liuLiangHeLiuyan() {
		let visitDomain = window.location.hostname;  // 用户访问的域名 visit_domain
		let visitPage = window.location.pathname;  // 用户访问的页面 visit_page
		let visitPagePosition = 'footer';  // 页面位置 visit_page_position
		let visitUrl = window.location.href; // 用户访问的完整链接 visit_url
		
		let srcUrl = document.referrer;  // 来源链接地址	src_url
		let srcDomain = '';  // 来源网站域名：搜索引擎或外链平台
		let srcPlatform = navigator.platform;  // 来源平台 src_platform
		
		let userLanguage = navigator.language || navigator.userLanguage;  // 用户的语言设置
		let userLanguages = navigator.languages.join(', ');  // 用户的语言偏好列表
		
		let srcEngine = '';  // 来源搜素引擎 src_engine
		let srcDevice = '';  // 来源设备 src_device
		let srcOs = ''; // 来源系统 src_os
		
		let userAgentJs = navigator.userAgent;
		let userAgent = userAgentJs.toLowerCase();
		let srcBrowser = '';  // 来源浏览器类型 src_browser
		
		
		let formIsValid = true;
		
		if (srcUrl) {
			const newSrcUrl = new URL(srcUrl);
			srcDomain = newSrcUrl.hostname;
			if (srcUrl.includes('google.com')) {
				srcEngine = 'Google';
			} else if (srcUrl.includes('baidu.com')) {
				srcEngine = 'Baidu';
			} else if (srcUrl.includes('bing.com')) {
				srcEngine = 'Bing';
			}
		}
		
		if (/mobile|android|iphone|ipad/i.test(userAgent)) {
			srcDevice = 'Mobile';
		} else {
			srcDevice = 'Desktop';
		}
		
		if (/win/i.test(userAgent)) {
			srcOs = 'Windows';
		} else if (/mac/i.test(userAgent)) {
			srcOs = 'MacOS';
		} else if (/linux/i.test(userAgent)) {
			srcOs = 'Linux';
		} else if (/android/i.test(userAgent)) {
			srcOs = 'Android';
		} else if (/iphone|ipad|ipod/i.test(userAgent)) {
			srcOs = 'iOS';
		}
		
		if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) {
			srcBrowser = 'Chrome';
		} else if (/firefox/i.test(userAgent)) {
			srcBrowser = 'Firefox';
		} else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
			srcBrowser = 'Safari';
		} else if (/edge/i.test(userAgent)) {
			srcBrowser = 'Edge';
		} else if (/opr\//i.test(userAgent)) {
			srcBrowser = 'Opera';
		} else if (/msie|trident/i.test(userAgent)) {
			srcBrowser = 'Internet Explorer';
		}
		
		const zfUserName = $('#zf-footer-name');
		const zfUserTel = $('#zf-footer-tel');
		const zfUserEmail = $('#zf-footer-email');
		const zfUserMessage = $('#zf-footer-message');
		
		const zfUserNameTip = $('.zf-footer-name-tip');
		const zfUserTelTip = $('.zf-footer-tel-tip');
		const zfUserEmailTip = $('.zf-footer-email-tip');
		const zfUserMessageTip = $('.zf-footer-message-tip');
		
		const zfSuccess = $('.zf-sub-success'); // 提交成功的div
		const zfsuccessTip = $('.zf-sub-success-tip'); // 提交成功的div内部提示语div
		const zfsuccessTipHtml = '<i class="flaticon-zfsuccess"></i><div>Thank you for your submission. We will respond to you at the earliest opportunity.</div>';
		
		const zfFooterCheckTip = $('.zf-footer-check-tip');
		
		
		const zfSubError = $('.zf-sub-error');  // 提交失败提示框
		const zfSubErrorTipClose = zfSubError.find('.zf-sub-error-tip-close');  // 关闭提示
		const zfSubErrorTip = zfSubError.find('.zf-sub-error-tip');  // 错误提示
		const zfSubErrorTipTitle = zfSubError.find('.zf-sub-error-tip-title'); // 错误提示-title
		
		
		// EB
		// 0	执行insert失败，未写入数据；
		// 1	执行insert成功，写入1条数据；
		// 2	提交留言超频；
		// 3	有token，但检测token与前端不一致，不合法；
		// 4	有token，但前端数据不完整（未检测token合法性）；
		// 5	没有token，可能是恶意请求，因为前端无token无法提交留言，此结果可能性较低，但需重视；
		
		// FB
		// 0 输入未完成
		// 1 页面加载服务器有问题
		// 2 输入未完成 & 页面加载服务器有问题
		
		// 检测是否为数组
		// if ($.isArray(myVar)) jQuery
		// if (Array.isArray(myVar)) 原生
		const ZF_ERR_ARR = {
			EB: {
				'0': { 
					t: "Oops, there seems to be a server issue.",
					c: "Please try submitting again later."
				},
				'2': { 
					t: "Server Busy Alert",
					c: "We’ve noticed a high submission frequency. To ensure a smooth experience, please wait {zfEbSleepTime} minutes before trying again."
				},
				'3': {
					t: "Current Page Error",
					c: "The page has encountered an error or has expired. Please refresh and try again."
				},
				'4': {
					t: "Submission Incomplete or Invalid",
					c: "Oops! Some information seems to be missing. Kindly complete all fields and try submitting again."
				},
				'5': {
					t: "Server Error",
					c: "Oh no, it looks like there’s a server issue, Please refresh the page and try again later."
				},
				'400': {
					t: "Server network error",
					c: "Sorry, there’s an issue with the server or the network. Please try again later."
				}
			},
			FB: {
				'0': {
					t: "Oops! Your submission wasn’t completed",
					c: "Please ensure all required fields are filled correctly and try again."
				},
				'1': {
					t: "Sorry, the page didn’t load properly.",
					c: "Please refresh your browser or try submitting again later."
				},
				'2': {
					t: "We encountered a couple of issues.",
					c: ["Page didn't load. You'll need to refresh first before trying again.",
						"Incomplete submission. Check all required fields and resubmit."]
				}
			}
		}
		
		const ZF_ERR_TIP_TITLE = "ERROR:";
		const ZF_ERR_TIP_TEXT = "Something Went Wrong, Please Try Again Later.";
		const ZF_AJAX_URL = 'http://127.0.0.1:50519/user/ly';
		
		let zfLinkChek = '';  // 需要留言时传递到API
		
		const zfLiuLiangData = {
			'visitDomain': visitDomain,  // 用户访问的域名
			'visitPage': visitPage,  //用户访问的页面
			'visitPagePosition': visitPagePosition, // 页面位置
			'visitUrl': visitUrl, // 用户访问的完整链接
			
			'srcUrl': srcUrl, // 来源链接地址
			'srcDomain' : srcDomain, // 来源链接的域名
			'srcPlatform': srcPlatform, // 来源平台
			
			'userLanguage': userLanguage, // 用户的语言设置
			'userLanguages':  userLanguages,  // 用户的语言偏好列表
			
			'srcEngine': srcEngine,  // 来源搜素引擎
			'srcDevice': srcDevice,  // 来源设备
			'srcOs': srcOs,  // 来源系统
			
			'userAgentJs': userAgentJs,  // userAgentJs
			// 'userAgent': userAgent,  // userAgent就是将userAgentJs转为了小写
			'srcBrowser': srcBrowser,  // 来源浏览器类型
			
			'isLiuLiang': true, 
		};
		
		zfLiuLiangSubmit();
		function zfLiuLiangSubmit() {
			$.ajax({
				type: "POST",  // Ajax请求方式
				url: ZF_AJAX_URL,  // 需要请求的服务器地址
				xhrFields: {
					withCredentials: true  // 允许跨域请求时携带cookie
				},
				data: zfLiuLiangData,
				dataType: "json",
				success: function(s){ // 请求成功要执行的代码 // 参数：是从服务器返回的数据
					zfLinkChek = s.t;
					zfFooterCheckTip.attr('zf-chek-data', zfLinkChek);
				},
				error: function(e){}
			});
		}
		
		function userNameInput(){
			let userName = zfUserName.val().trim();
			const nameRegex = /^(?!\s*$)(?!.*\s{2,})[\s\S]{1,50}$/u;
			let tip = '';
			if (!userName) {
				tip = 'Name is required.';
				formIsValid = false;
			} else if (userName.length > 50) {
				tip = 'max 50 characters.';
				formIsValid = false;
			} else if (!nameRegex.test(userName)) {
				tip = 'No consecutive spaces.';
				formIsValid = false;
			}
			zfUserNameTip.text(tip);
		};
		
		function userTelInput(){
			let userTel = zfUserTel.val().trim();
			const telRegex = /^[0-9+\-\s]{0,20}$/;
			let tip = '';
			if (userTel && !telRegex.test(userTel)) {
				tip = 'Invalid phone number.';
				formIsValid = false;
			}
			zfUserTelTip.text(tip);
		};
		
		function userEmailInput(){
			let userEmail = zfUserEmail.val().trim();
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
			let tip = '';
			if (!userEmail) {
				tip = 'Email is required.';
				formIsValid = false;
			} else if (userEmail.length > 50) {
				tip = 'Email: max 50 characters.';
				formIsValid = false;
			} else if (!emailRegex.test(userEmail)) {
				tip = 'Invalid email.';
				formIsValid = false;
			}
			zfUserEmailTip.text(tip)
		};
		
		
		function userMessageInput() {
			let userMessage = zfUserMessage.val().trim();
			let tip = '';
			if (userMessage.length > 1000) {
				tip = 'max 1000 characters.';
				formIsValid = false;
			}
			zfUserMessageTip.text(tip);
		}
		
		// 1. 姓名验证：允许中文、英文、空格，1-50字符
		zfUserName.on('input',function(){
			userNameInput();
		});
		
		// 2. 电话验证：允许数字、+、-、空格，最长20字符（非必填，可以为空）
		zfUserTel.on('input',function(){
			userTelInput();
		});
		
		// 3. 邮箱验证：常规邮箱格式，最长50字符，不允许为空
		zfUserEmail.on('blur',function(){
			userEmailInput();
		});
		
		// 4. 消息验证：最多1000字符，允许为空
		zfUserMessage.on('blur',function(){
			userMessageInput();
		});
			
			
		// zfLiuyan提交成功后执行
		function subSuccess() {
			zfSuccess.removeClass('zf-ajax-loader');
			
			zfsuccessTip.html(zfsuccessTipHtml);
			zfUserName.val('');
			zfUserTel.val('');
			zfUserEmail.val('');
			zfUserMessage.val('');
		};
		
		
		// 提交执行
		function zfLiuyan() {  
			zfSuccess.removeClass('zf-none');
			let zfUserData = {  // 发送到服务器数据
				'userName': zfUserName.val().trim(),
				'userTel': zfUserTel.val().trim(),
				'userEmail': zfUserEmail.val().trim(),
				'userMessage': zfUserMessage.val().trim(),
				'zfLinkChek': zfLinkChek,
			};
			
			let zfLiuyanData = {
				...zfUserData,
				...zfLiuLiangData
			}
			delete zfLiuyanData.isLiuLiang;
			delete zfLiuyanData.srcDomain;
			
			let ef = 'EB';
			$.ajax({ // $.ajax()是一个方法,接受一个对象
				type: "POST",  // Ajax请求方式
				url: ZF_AJAX_URL,  // 需要请求的服务器地址
				xhrFields: {
					withCredentials: true  // 允许跨域请求时携带cookie
				},
				data: zfLiuyanData,
				dataType: "json",
				success: function(s){ // 请求成功要执行的代码 // 参数：是从服务器返回的数据
					// console.log(s);
					let code = s.lyr;
					if (code == 1) {  // 留言成功
						subSuccess();
					} else {
						let time = s.lyt;
						zfSubErrorOpen(ef, code, time);
					}
				},
				error: function(e){ // 请求失败要执行的代码
					zfSubErrorOpen(ef, 400);
				}
			});
			
		};
		
		function zfSubmit() {
			let ef = 'FB';  // 前端 
			formIsValid = true;
			userNameInput();
			userTelInput();
			userEmailInput();
			userMessageInput();
			if (zfLinkChek.trim() && formIsValid) {
				zfLiuyan();
			} else if (!zfLinkChek.trim() && !formIsValid) {  // 2 输入未完成 & 页面加载服务器有问题
				zfSubErrorOpen(ef, 2);
			} else { 
				if (!formIsValid) {  // 0 输入未完成
					zfSubErrorOpen(ef, 0);
				} else {  // 1 页面加载服务器有问题
					zfSubErrorOpen(ef, 1);
				}
			}
		};
		
		// 给按钮添加单击事件
		$('#zf-footer-button').on('click', function(event){ 
			event.preventDefault();
			zfSubmit();
		});
		
		// 打开错误提示窗，同时关闭提交遮罩。新版
		function zfSubErrorOpen(ef, code, time = 0) {
			zfSubError.removeClass('zf-none');
			zfSuccess.addClass('zf-none');
			let t = (errMap?.[ef]?.[code]?.t ?? ZF_ERR_TIP_TITLE) + ((ef == 'FB') ? '0' : '1') + '-' + code;
			console.log(t)
			let c = ZF_ERR_ARR?.[ef]?.[code]?.c ?? ZF_ERR_TIP_TEXT;
			if (Array.isArray(c)) {c = c.join('\n');}
			if (Number(time) > 0) { // time = String(time);
				c = c.replace(/\{zfEbSleepTime\}/g, time);  // 用time替换掉原字符串中的占位符{zfEbSleepTime}，花括号需要转义，所以是\{zfEbSleepTime\}，
			}
			zfSubErrorTipTitle.text(t);
			zfSubErrorTip.text(c);
		}
		
		// 关闭提示
		zfSubErrorTipClose.click(function(){
			zfSubError.addClass('zf-none');
			zfSubErrorTipTitle.text('');
			zfSubErrorTip.text('');
		});
		
		
		// 其他页面留言 开始
		// function loadScript(src, callback) {
		// 	try {
				
		// 		var script = document.createElement('script'); 	// 创建 <script> 标签
		// 		script.src = src;								// 设置 src 属性为传入的路径
		// 		script.onload = function() {					// 脚本加载完成后执行回调函数
		// 			callback();									// 调用回调函数
		// 		};
		// 		script.onerror = function(error) {				// 脚本加载失败时的错误处理
		// 			console.error('脚本加载失败:', error);		// 打印错误信息
		// 		};
		// 		document.head.appendChild(script);			 	// 插入 <script> 标签并加载
		// 	} catch (err) {
		// 		console.error('加载脚本时发生错误:', err.message);	// 捕获并打印错误
		// 	}
		// }
		
		// if ($('.zf-leave-message')) {
		// 	loadScript('zf-liuyan.js', function(){
		// 		zfLiuYan(zfLiuLiangData, ZF_ERR_ARR, zfLinkChek);
		// 	});
		// }
			// console.log(1111111111111111111111111)
			
			
			
		// function loadScript(src, callback) {
		//     try {
		//         var script = document.createElement('script');
		//         script.src = src;
		//         script.onload = function() {
		//             console.log(src + ' 加载完成');
		//             callback();
		//         };
		//         script.onerror = function(error) {
		//             console.error(src + ' 加载失败:', error);
		//         };
		//         document.head.appendChild(script);
		//     } catch (err) {
		//         console.error('加载脚本时发生错误:', err.message);
		//     }
		// }
		
		// if ($('.zf-leave-message')) {
		//     loadScript('zf-liuyan.js', function(){
		//         console.log('正在调用 zfLeaveMsg 函数');
		//         if (typeof zfLeaveMsg === 'function') {
		//             zfLeaveMsg(zfLiuLiangData, ZF_ERR_ARR, zfLinkChek);
		//         } else {
		//             console.error('zfLeaveMsg 函数未定义');
		//         }
		//     });
		// }
		
		
		
		
		
		function loadScript(src, callback) {
		  try {
		    var script = document.createElement('script');
		    script.src = src;
		    script.async = false; // 同步加载以保证顺序
		    script.onload = function() {
		      console.log(`${src} 加载完成`);
		      callback();
		    };
		    script.onerror = function(error) {
		      console.error(`${src} 加载失败（HTTP ${error.target.status}）`);
		    };
		    document.head.appendChild(script);
		  } catch (err) {
		    console.error('加载脚本时发生错误:', err.message);
		  }
		}
		
		// 使用原生 JavaScript 检查元素
		if (document.querySelector('.zf-leave-message')) {
		  loadScript('zf-liuyan.js', function() {
		    console.log('正在调用 zfLeaveMsg 函数');
		    // 检查所有依赖项
		    if (
		      typeof zfLeaveMsg === 'function' &&
		      typeof zfLiuLiangData !== 'undefined' &&
		      Array.isArray(ZF_ERR_ARR) &&
		      typeof zfLinkChek === 'function'
		    ) {
		      zfLeaveMsg(zfLiuLiangData, ZF_ERR_ARR, zfLinkChek);
		    } else {
		      console.error('zfLeaveMsg 或其依赖项未正确初始化');
		    }
		  });
		}
		// 其他页面留言 结束
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		if (document.querySelector('.zf-leave-message')) {
			zfLeaveMsg(zfLiuLiangData, ZF_ERR_ARR, zfLinkChek);
		}
		function zfLeaveMsg(zfData, errMap, zfLinkChek) {
			
			const fromBox = $('.zf-leave-message');
			zfData.visitPagePosition = fromBox.data('zf-position'); // 页面位置 visit_page_position
			
			const lyzfUserName = fromBox.find('#zf-input-name');
			const lyzfUserTel = fromBox.find('#zf-input-tel');
			const lyzfUserEmail = fromBox.find('#zf-input-email');
			const lyzfUserMessage = fromBox.find('#zf-input-message');
			const lyzfSubMessage = fromBox.find('#zf-input-sub-msg');
			
			const lyzfUserNameTip = fromBox.find('.zf-input-name-tip');
			const lyzfUserTelTip = fromBox.find('.zf-input-tel-tip');
			const lyzfUserEmailTip = fromBox.find('.zf-input-email-tip');
			const lyzfUserMessageTip = fromBox.find('.zf-input-message-tip');
			
			const lyzfSuccess = fromBox.find('.zf-msg-success'); // 提交成功的div
			const lyzfSuccessTip = fromBox.find('.zf-msg-success-tip'); // 提交成功的div内部提示语div
			const lyzfSuccessTipHtml = '<i class="flaticon-zfSuccess"></i><div>Thank you for your submission. We will respond to you at the earliest opportunity.</div>';
			
			const zfSubError = $('.zf-sub-error');  // 提交失败提示框
			const zfSubErrorTipClose = zfSubError.find('.zf-sub-error-tip-close');  // 关闭提示
			const zfSubErrorTip = zfSubError.find('.zf-sub-error-tip');  // 错误提示
			const zfSubErrorTipTitle = zfSubError.find('.zf-sub-error-tip-title'); // 错误提示-title

			
			function userNameInput(){
				let userName = lyzfUserName.val().trim();
				const nameRegex = /^(?!\s*$)(?!.*\s{2,})[\s\S]{1,50}$/u;
				let tip = '';
				if (!userName) {
					tip = 'Name is required.';
					formIsValid = false;
				} else if (userName.length > 50) {
					tip = 'max 50 characters.';
					formIsValid = false;
				} else if (!nameRegex.test(userName)) {
					tip = 'No consecutive spaces.';
					formIsValid = false;
				}
				lyzfUserNameTip.text(tip);
			};
			
			function userTelInput(){
				let userTel = lyzfUserTel.val().trim();
				const telRegex = /^[0-9+\-\s]{0,20}$/;
				let tip = '';
				if (userTel && !telRegex.test(userTel)) {
					tip = 'Invalid phone number.';
					formIsValid = false;
				}
				lyzfUserTelTip.text(tip);
			};
			
			function userEmailInput(){
				let userEmail = lyzfUserEmail.val().trim();
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
				let tip = '';
				if (!userEmail) {
					tip = 'Email is required.';
					formIsValid = false;
				} else if (userEmail.length > 50) {
					tip = 'Email: max 50 characters.';
					formIsValid = false;
				} else if (!emailRegex.test(userEmail)) {
					tip = 'Invalid email.';
					formIsValid = false;
				}
				lyzfUserEmailTip.text(tip)
			};
			
			
			function userMessageInput() {
				let userMessage = lyzfUserMessage.val().trim();
				let tip = '';
				if (userMessage.length > 1000) {
					tip = 'max 1000 characters.';
					formIsValid = false;
				}
				lyzfUserMessageTip.text(tip);
			}
			
			// 1. 姓名验证：允许中文、英文、空格，1-50字符
			lyzfUserName.on('input',function(){
				userNameInput();
			});
			
			// 2. 电话验证：允许数字、+、-、空格，最长20字符（非必填，可以为空）
			lyzfUserTel.on('input',function(){
				userTelInput();
			});
			
			// 3. 邮箱验证：常规邮箱格式，最长50字符，不允许为空
			lyzfUserEmail.on('blur',function(){
				userEmailInput();
			});
			
			// 4. 消息验证：最多1000字符，允许为空
			lyzfUserMessage.on('blur',function(){
				userMessageInput();
			});
				
				
			// zfLiuyan提交成功后执行
			function subSuccess() {
				lyzfSuccess.removeClass('zf-ajax-loader');
				
				lyzfSuccessTip.html(lyzfSuccessTipHtml);
				lyzfUserName.val('');
				lyzfUserTel.val('');
				lyzfUserEmail.val('');
				lyzfUserMessage.val('');
			};
			
			
			// 提交执行
			function zfLiuyan() {  
				lyzfSuccess.removeClass('zf-none');
				let zfUserData = {  // 发送到服务器数据
					'userName': lyzfUserName.val().trim(),
					'userTel': lyzfUserTel.val().trim(),
					'userEmail': lyzfUserEmail.val().trim(),
					'userMessage': lyzfUserMessage.val().trim(),
					'zfLinkChek': zfLinkChek,
				};
				
				let zfLiuyanData = {
					...zfUserData,
					...zfData,
				}
				delete zfLiuyanData.isLiuLiang;
				delete zfLiuyanData.srcDomain;
				
				let ef = 'EB';
				$.ajax({ // $.ajax()是一个方法,接受一个对象
					type: "POST",  // Ajax请求方式
					url: ZF_AJAX_URL,  // 需要请求的服务器地址
					xhrFields: {
						withCredentials: true  // 允许跨域请求时携带cookie
					},
					data: zfLiuyanData,
					dataType: "json",
					success: function(s){ // 请求成功要执行的代码 // 参数：是从服务器返回的数据
						// console.log(s);
						let code = s.lyr;
						if (code == 1) {  // 留言成功
							subSuccess();
						} else {
							let time = s.lyt;
							zfSubErrorOpen(ef, code, time);
						}
					},
					error: function(e){ // 请求失败要执行的代码
						zfSubErrorOpen(ef, 400);
					}
				});
				
			};
			
			function zfSubmit() {
				let ef = 'FB';  // 前端 
				formIsValid = true;
				userNameInput();
				userTelInput();
				userEmailInput();
				userMessageInput();
				if (zfLinkChek.trim() && formIsValid) {
					zfLiuyan();
				} else if (!zfLinkChek.trim() && !formIsValid) {  // 2 输入未完成 & 页面加载服务器有问题
					zfSubErrorOpen(ef, 2);
				} else { 
					if (!formIsValid) {  // 0 输入未完成
						zfSubErrorOpen(ef, 0);
					} else {  // 1 页面加载服务器有问题
						zfSubErrorOpen(ef, 1);
					}
				}
			};
			
			// 给按钮添加单击事件
			lyzfSubMessage.on('click', function(event){ 
				event.preventDefault();
				zfSubmit();
			});

		}
	}
})







// console.log('用户访问的域名' + visitDomain);
// console.log('用户访问的页面' + visitPage);
// console.log('页面位置' + visitPagePosition);
// console.log('用户访问的完整链接' + visitUrl);
// console.log('来源链接地址' + srcUrl);
// console.log('来源平台' + srcPlatform);
// console.log('用户的语言设置' + userLanguage);
// console.log('用户的语言偏好列表' + userLanguages);
// console.log('来源设备' + srcDevice);
// console.log('来源系统' + srcOs);
// console.log('来源浏览器类型' + srcBrowser);
// console.log('来源搜素引擎' + srcEngine);
// console.log('userAgent:' + userAgent);
// console.log('userAgentJs:' + userAgentJs);