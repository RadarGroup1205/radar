// 检查是否登录
checkLogin();
// 无论登录前什么页面，都要到index.html，不存，不实现在index.html下打开登录前的页面
function checkLogin() {
	try {
		// 以登录状态记录是否登录
		const state = sessionStorage.getItem('loginState');
		// 未登录，跳转至登录页面
		if (!state) {
			window.location.href = 'login.html';
		}
	}
	catch (ex) {
		alert(ex.message);
	}
}
