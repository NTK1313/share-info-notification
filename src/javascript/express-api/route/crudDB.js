const express = require('../../../node-npm/node_modules/express');
var router = express.Router();
var { Client } = require('../../../node-npm/node_modules/pg/lib');

// TODO:/getPriceの処理のように非同期させればDB接続を共通化出来そう。

/**
 * DB検索
 * http://localhost:3000/api/v1/crudDB/getDBData
 */
router.get('/getDBData', function (req, res) {
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
	const sqlStr = f.sqlReader("SEL001_M_STOCK_JP.sql");

	// // クエリ実行は非同期処理なので、後続処理はコールバック関数として書く
	client.query(sqlStr, (err, res2) => {
		// クエリ実行後の処理
		var obj = JSON.parse(JSON.stringify(res2.rows));
		client.end();
		console.log(obj);
		res.json(obj);
	});
});

/**
 * DB登録
 * http://localhost:3000/api/v1/crudDB/insertDBData
 */
router.post('/insertDBData', function (req1, res1) {
	// SQL実行
	const client = new Client({
		user: "postgres",
		host: "127.0.0.1",
		database: "sharedb",
		password: "skskr20081106",
		port: 5432,
	});
	client.connect();
	const reqstr = JSON.parse(JSON.stringify(req1.body));
	// TODO:INSERT時のチェック処理をかます
	
	var f = require("./execSql.js");
	const sqlStr = f.sqlReader("INS001_T_STOCK_JP.sql");

	// ループして１件ずつINSERTする
	for (let i = 0; i < reqstr.length; i++) {
		console.log(reqstr[i]);
		var v = [];
		var keyList = Object.keys(reqstr[i]);
		for (let key in keyList) {
			v.push(reqstr[i][keyList[key]]);
		}
		const query = {
			text: sqlStr,
			values: v,
		}

		client.query(query, (err, res) => {
			console.log(query);
			// クエリ実行後の処理
			if (err) {
				console.log('登録ERR');
				console.log(err);
				throw err;
			} else {
				console.log('登録完了');
				// 非同期実行が全て終わった時に切断
				client.on('drain', client.end.bind(client));
			}
		});
	}
});


//routerをモジュールとして扱う準備
module.exports = router;