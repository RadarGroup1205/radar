//检查是否登录
function checkLog() {
	//获取跳转之前的页面url
	// sessionStorage.setItem('returnUrl', window.location.href)
	var a = Number(sessionStorage.loginState)
	//console.log(JSON.parse(a));
	if (!a) {
		window.location.href = 'login.html';
	} else {
		return JSON.parse(a).Sno;
	}
}
