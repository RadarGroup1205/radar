//检查是否登录
function checkLog() {
	//获取跳转之前的页面url
	// sessionStorage.setItem('returnUrl', window.location.href)
	var a = sessionStorage.getItem('loginState');
	// console.log(a);
	if (!a) {
		// alert('没有登录，即将跳转至登录界面......');
		window.location.href = 'login.html';
	} else {
		return JSON.parse(a).Sno;
	}
}
