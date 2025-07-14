if (document.getElementById('zf-pro-footer-js')) {
	fetch('../footer.html')
		.then(response => response.text())
		.then(html => {
			document.getElementById('zf-pro-footer-js').innerHTML = html;
		})
		.catch(() => {});
		// .catch(err => console.error('导航加载失败:', err));
} else if (document.getElementById('zf-footer-js')) {
	fetch('footer.html')
		.then(response => response.text())
		.then(html => {
			document.getElementById('zf-footer-js').innerHTML = html;
		})
		.catch(() => {});
		// .catch(err => console.error('导航加载失败:', err));
}