$(function(){
	function zfLeaveMsg(zfData, errMap, zfLinkChek) {
		
		const fromBox = $('.zf-leave-message');
		zfData.visitPagePosition = fromBox.data('zf-position'); // 页面位置 visit_page_position
		
		const zfUserName = fromBox.find('#zf-input-name');
		const zfUserTel = fromBox.find('#zf-input-tel');
		const zfUserEmail = fromBox.find('#zf-input-email');
		const zfUserMessage = fromBox.find('#zf-input-message');
		const zfSubMessage = fromBox.find('#zf-input-sub-msg');
		
		const zfUserNameTip = fromBox.find('.zf-input-name-tip');
		const zfUserTelTip = fromBox.find('.zf-input-tel-tip');
		const zfUserEmailTip = fromBox.find('.zf-input-email-tip');
		const zfUserMessageTip = fromBox.find('.zf-input-message-tip');
		
		const zfSuccess = fromBox.find('.zf-msg-success'); // 提交成功的div
		const zfsuccessTip = fromBox.find('.zf-msg-success-tip'); // 提交成功的div内部提示语div
		const zfsuccessTipHtml = '<i class="flaticon-zfsuccess"></i><div>Thank you for your submission. We will respond to you at the earliest opportunity.</div>';
		
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
		const ZF_ERR_TIP_TITLE = "ERROR:";
		const ZF_ERR_TIP_TEXT = "Something Went Wrong, Please Try Again Later.";
		const ZF_AJAX_URL = 'http://127.0.0.1:50519/user/ly';
		
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
		zfSubMessage.on('click', function(event){ 
			event.preventDefault();
			zfSubmit();
		});
		
		// 打开错误提示窗，同时关闭提交遮罩。新版
		function zfSubErrorOpen(ef, code, time = 0) {
			zfSubError.removeClass('zf-none');
			zfSuccess.addClass('zf-none');
			let t = errMap?.[ef]?.[code]?.t ?? ZF_ERR_TIP_TITLE;
			let c = errMap?.[ef]?.[code]?.c ?? ZF_ERR_TIP_TEXT;
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
	}

	// function liuYan() {
		
	// }
	
	
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