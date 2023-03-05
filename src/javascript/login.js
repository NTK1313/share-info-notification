function nextPage() {
	// ログイン認証する
	id = document.login_form.id.value
	pwd = document.login_form.pass.value;
	console.log(id);
	console.log(pwd);
	// ログイン印象OKの場合
	if (id && pwd) {
		const url = "../html/shareInfo.html";
		//var param = "?value=" + str;
		location.href = url;
	} else {
		alert("ログインID、またはパスワードが正しくありません。");
		console.log("test");
		const url = "../html/loginNg.html";
		//var param = "?value=" + str;
		location.href = url;
	}
}
