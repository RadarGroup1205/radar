// 接口地址
let serverUrl = 'http://202.114.41.165:8080/radar_db'

// 用回车提交数据
function keyLogin() {
	if (event.key == 'Enter')                                        //回车键的键值为13
		document.getElementById('submit').click();                  //调用登录按钮的登录事件
}

// 登录按钮事件响应
function getUser() {

	// 获取用户信息
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
		success: function (data) {                                  //接口返回来的data值，注意这个data是后台返回的值，上面的data是要传给后台的值  
			console.log(data);

			if (data == '0') {                                        //根据后台返回的data.code来判断打开什么页面    
				sessionStorage.username = username;                     //将username存储到本地sessionStorage中
				sessionStorage.loginState = 1;                          //用户登录状态变为已登录
				console.log('管理员登录');
				window.location.href = 'index.html';
			}
			else if (data == '1') {
				sessionStorage.loginState = 1 
				console.log('普通用户登录');
				window.location.href = 'User.html';
			}
			else {
				alert('请输入正确的用户名和密码！');
				window.location.reload();
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			alert(XMLHttpRequest.status);                             //状态
			alert(XMLHttpRequest.readyState);                         //状态码
			alert(textStatus);                                      	//错误信息
		}
	})
}