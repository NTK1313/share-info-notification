const express = require('../../../node-npm/node_modules/express');
var router = express.Router();
var { Client } = require('../../../node-npm/node_modules/pg/lib');
// DBから対象銘柄を取得する
// http://localhost:3000/api/v1/article1/getDBData
// TODO:/getPriceの処理のように非同期させればDB接続を共通化出来そう。
router.get('/getDBData', function (req, res1) {
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

	// // クエリ実行は非同期処理なので、後続処理はコールバック関数として書く
	client.query(result, (err, res2) => {
		// クエリ実行後の処理
		var obj = JSON.parse(JSON.stringify(res2.rows));
		client.end();
		console.log(obj);
		res1.json(obj);
	});
});
//routerをモジュールとして扱う準備
module.exports = router;