// 检查是否登录
// 如果没有登录，跳转至登录页面，如果已登录，跳转至登录之前的页面，并返回一个的对象
function checkLogin() {
	try {
		let state = sessionStorage.getItem('loginState');
		if (!state) {
			// 存储当前页面的url，并获取登录状态
			// sessionStorage.setItem('returnUrl', window.location.href);
			// alert('没有登录，即将跳转至登录页面......');
			window.location.href = 'login.html';
		}
		else {
			const person = sessionStorage.getItem('user');
			const man = JSON.parse(person);
			return man;
		}
	}
	catch (ex) {
		alert(ex.message);
	}
}
