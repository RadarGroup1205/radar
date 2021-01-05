// 接口地址
let serverUrl = 'http://202.114.41.165:8080/radar_db'

// 用回车提交数据
function keyLogin() {
	if (event.key == 'Enter')                                        //回车键的键值为13
		document.getElementById('submit').click();                  //调用登录按钮的登录事件
}

// 登录按钮事件响应
function getUser() {

	try {
		// 获取登录用户信息
		var username = document.getElementById('username').value;
		var password = document.getElementById('password').value;

		// ajax提交前表单校验，判断两个均不为空
		if (username == '' || password == '') {
			alert('用户名和密码不能为空！');
			return false;
		}

		// Ajax提交表单数据
		$.ajax({
			url: serverUrl + '/load',                                   //后台提供的服务器（接口） config.baseServerUrl + '/account/login',          
			type: 'post',
			data: {
				name: username,
				// pwd: password
				pwd: md5(password)
			},
			success: function (data) {                                  //data，接口返回来的用户权限等级
				console.log(data);

				if (data == '0') {                                        //登录成功，状态变为已登录，将登录名和用户类型存储到本地
					sessionStorage.setItem('loginState','1');
					sessionStorage.setItem('userName',username);
					sessionStorage.setItem('userType',data);
					// console.log('登录成功');
					// console.log(sessionStorage.getItem('userName'));
					window.location.href = 'index.html';
				}
				else {
					alert('请输入正确的用户名和密码！');
					window.location.reload();
				}
			},
			error: function(msg) {
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