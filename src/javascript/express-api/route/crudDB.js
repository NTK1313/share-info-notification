const express = require('../../../node-npm/node_modules/express');
const router = express.Router();
let { Client } = require('../../../node-npm/node_modules/pg/lib');
const f = require("./execSql.js");

// TODO:/getPriceの処理のように非同期させればDB接続を共通化出来そう。

/**
 * DB検索
 * http://localhost:3000/api/v1/crudDB/getDBData
 */
router.get('/getDBData', function (req, res) {
	// SQL実行
	const client = connectDB();
	const sel001 = f.sqlReader("SEL001_M_STOCK_JP.sql");

	// // クエリ実行は非同期処理なので、後続処理はコールバック関数として書く
	client.query(sel001, (err, res2) => {
		// クエリ実行後の処理
		if (err) {
			console.log('処理ERR');
			console.log(err);
			throw err;
		} else {
			console.log('処理成功');
			const obj = JSON.parse(JSON.stringify(res2.rows));
			client.end();
			res.json(obj);
		}
	});
});

/**
 * DBチェック
 * http://localhost:3000/api/v1/crudDB/checkDBData
 */
router.post('/checkDBData', function (req1, res1) {
	const client = connectDB();
	const reqstr = JSON.parse(JSON.stringify(req1.body));
	const sel002 = f.sqlReader("SEL002_T_STOCK_JP.sql");

	// チェック対象は1レコードだけ
	let v = [];
	v.push(reqstr[0]['銘柄コード']);
	v.push(reqstr[0]['処理時間（株価）']);

	let query = {
		text: sel002,
		values: v,
	}
	client.query(query, (err, res) => {
		console.log(query);
		// クエリ実行後の処理
		if (err) {
			console.log('処理ERR');
			console.log(err);
			throw err;
		} else {
			console.log('処理完了');
			const obj = JSON.parse(JSON.stringify(res.rows));
			client.end();
			res1.json(obj);
		}
	});
});


/**
 * DB登録
 * http://localhost:3000/api/v1/crudDB/insertDBData
 */
router.post('/insertDBData', function (req1, res1) {
	const client = connectDB();
	const reqstr = JSON.parse(JSON.stringify(req1.body));
	let sql = "INS001_T_STOCK_JP.sql";
	if (reqstr[0]["sqlNm"]) {
		console.log("SQL指定あり");
		sql = reqstr[0]["sqlNm"];
	}
	ins001 = f.sqlReader(sql);

	// ループして１件ずつINSERTする
	for (let i = 0; i < reqstr.length; i++) {
		console.log(reqstr[i]);
		let v = [];
		let keyList = Object.keys(reqstr[i]);
		for (let key in keyList) {
			if (keyList[key] != "sqlNm") {
				v.push(reqstr[i][keyList[key]]);
			}
		}
		let query = {
			text: ins001,
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

/**
 * DB接続
 * @returns DB接続情報
 */
function connectDB() {
	const client = new Client({
		user: "postgres",
		host: "127.0.0.1",
		database: "sharedb",
		password: "skskr20081106",
		port: 5432,
	});
	client.connect();
	return client;
}

//routerをモジュールとして扱う準備
module.exports = router;