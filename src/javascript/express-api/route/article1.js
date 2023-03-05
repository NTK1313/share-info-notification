// http://localhost:3000/api/v1/article1/test
const express = require('../../../node-npm/node_modules/express');
var router = express.Router();
var { Client } = require('../../../node-npm/node_modules/pg');

router.get('/test', function (req, res1) {
	// ライブラリ定義
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
		//console.log(res.rows[0]);
		var obj1 = JSON.parse(JSON.stringify(res.rows));
		var id = obj1.name1;
		//console.log(id);
		client.end();
		res1.json(obj1);
	});
});

//routerをモジュールとして扱う準備
module.exports = router;