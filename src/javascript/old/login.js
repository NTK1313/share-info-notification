
//id = document.login_form.id.value
//pwd = document.login_form.pass.value;

// ライブラリ定義
var { Client } = require('../../src/node-npm/node_modules/pg');
// SQL実行
const client = new Client({
	user: "postgres",
	host: "127.0.0.1",
	database: "sharedb",
	password: "skskr20081106",
	port: 5432,
});
client.connect();
var f = require("./execSql.js");
const result = f.sqlReader("test.sql");

// クエリ実行は非同期処理なので、後続処理はコールバック関数として書く
client.query(result, (err, res) => {
	// クエリ実行後の処理
	console.log(res.rows[0]);
	var obj1 = JSON.parse(JSON.stringify(res.rows[0]));
	var id = obj1.name1;
	console.log(id);
	document.getElementById("sample").innerHTML
		= "Hello World!<br>↑JavaScriptによる出力";
	client.end();
});

/**
function nextPage() {
	//id = document.login_form.id.value
	//pwd = document.login_form.pass.value;
	// TODO:DB接続してパスワード認証する
	document.getElementById("sample").innerHTML
		= "Hello World!<br>↑JavaScriptによる出力";
	if (id == "ind" && pwd == "ex") {
		location.href = id + pwd + ".html";
	} else {
		alert("ログインID、パスワードが間違っています");
	}
}
*/