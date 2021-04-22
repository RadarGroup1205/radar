// 接口地址
// let serverUrl = 'http://202.114.41.165:8080/radar_db'
const serverUrl = 'http://10.222.6.46:8080/radar_db'

// 注册登录事件
// 点击登录按钮触发登录
const btn = document.querySelector('#login-btn');
btn.addEventListener('click', login);
// 敲回车触发登录
const main = document.querySelector('.main');
main.addEventListener('keydown', function (event) {
	if (event.key == 'Enter')
		login();
})

// 登录函数
function login() {
	try {
		// 获取登录用户信息
		const userName = document.getElementById('username').value;
		const password = document.getElementById('password').value;

		// Ajax提交表单前校验
		if (userName == '' || password == '') {
			alert('用户名和密码不能为空！');
			return false;
		}
		else {
			// Ajax提交表单数据
			$.ajax({
				url: serverUrl + '/Load',
				type: 'post',
				data: {
					name: userName,
					pwd: md5(password)
				},
				success: function (data) {
					// 登录成功
					if (data) {
						// 更新登录状态
						sessionStorage.setItem('loginState', '1');
						// 返回用户权限等级和所在部门，并用户登录名一起构成一个用户对象，以字符串形式缓存起来
						const user = setUser(userName, data);
						sessionStorage.setItem('user', user);
						window.location.href = 'index.html';
					}
					// 用户名/密码错误
					else {
						alert('请输入正确的用户名和密码！');
						window.location.reload();
					}
				},
				error: function (msg) {
					alert('登录失败\n网络连接错误' + JSON.stringify(msg));
				}
				// error: function (XMLHttpRequest, textStatus, errorThrown) {
				// 	alert(XMLHttpRequest.status);                             //状态
				// 	alert(XMLHttpRequest.readyState);                         //状态码
				// 	alert(textStatus);                                      	//错误信息
				// }
			});
		}

	} catch (error) {
		window.location.reload();
		alert(error.name + error.message);
	}
}

// 生成一个用户对象，字符串形式
function setUser(userName, strUser) {
	// 对象字符串转对象
	let user = JSON.parse(strUser);
	const userType = user.result;
	const userDepart = user.department;
	const person = {
		name: userName,
		type: userType,
		depart: userDepart
	}
	// 对象转对象字符串
	user = JSON.stringify(person);
	return user;
}