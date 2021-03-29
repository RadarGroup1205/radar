// 接口地址
// let serverUrl = 'http://202.114.41.165:8080/radar_db'
const serverUrl = 'http://10.222.6.46:8080/radar_db'

// 用回车提交数据
function keyLogin() {
	if (event.key == 'Enter')                                        //回车键的键值为13
		// document.getElementById('submit').click();                  //调用登录按钮的登录事件
		loginIn();
}

// 生成一个用户对象字符串
function getUser(userName, strUser) {
	const user = JSON.parse(strUser);
	const userType = user.result;
	const userDepart = user.department;
	const person = {
		name: userName,
		type: userType,
		depart: userDepart
	}
	const man = JSON.stringify(person);
	return man;
}

// 登录按钮事件响应
function loginIn() {

	try {
		// 获取登录用户信息
		const userName = document.getElementById('username').value;
		const password = document.getElementById('password').value;

		// Ajax提交表单前校验，都不能为空
		if (userName == '' || password == '') {
			alert('用户名和密码不能为空！');
			return false;
		}

		// Ajax提交表单数据
		$.ajax({
			url: serverUrl + '/Load',
			type: 'post',
			data: {
				name: userName,
				pwd: md5(password)
			},
			// 登录成功，返回用户权限等级和所在部门，并用户登录名一起构成一个用户对象字符串，缓存起来
			success: function (res) {
				if (res) {
					sessionStorage.setItem('loginState', '1');
					const person = getUser(userName, res);
					sessionStorage.setItem('user', person);
					// const url = sessionStorage.getItem('returnUrl');
					// if (url) {
					// 	window.location.href = url;
					// }
					// else {
					// 	window.location.href = 'index.html';
					// }
					window.location.href = 'index.html';
				}
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

	} catch (error) {
		window.location.reload();
		alert(error.name + error.message);
	}

}