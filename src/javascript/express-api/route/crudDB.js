const express = require('../../../node-npm/node_modules/express');
const router = express.Router();
let { Client } = require('../../../node-npm/node_modules/pg/lib');
const f = require("./execSql.js");

// TODO:/getPriceの処理のように非同期させればDB接続を共通化出来そう。

/**
 * DB検索
 * http://localhost:3000/api/v1/crudDB/getDBData
 */
router.get('/getDBData/:sqlNm', function (req, res) {
	// SQL実行
	console.log("実行SQL：" + req.params.sqlNm);
	const client = new connectDB();
	const sel001 = f.sqlReader(req.params.sqlNm + ".sql");

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
router.post('/checkDBData/:sqlNm', function (req1, res1) {
	const client = new connectDB();
	// URL
	console.log(req1.params.sqlNm);
	const reqstr = JSON.parse(JSON.stringify(req1.body));
	// const sqlstr = reqstr[0]["sqlNm"] ? reqstr[0]["sqlNm"] : "SEL002_T_STOCK_JP.sql";
	const sqlstr = req1.params.sqlNm + ".sql"
	let sql = f.sqlReader(sqlstr);
	// チェック対象は1レコードだけ
	let v = [];
	if (sqlstr == "SEL002_T_STOCK_JP.sql") {
		v.push(reqstr[0]['銘柄コード']);
		v.push(reqstr[0]['処理時間（株価）']);
	} else {
		v.push(reqstr[0]['brCd']);
	}

	let query = {
		text: sql,
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
router.post('/insertDBData/:sqlNm', function (req1, res1) {
	const client = new connectDB();
	const reqstr = JSON.parse(JSON.stringify(req1.body));
	console.log("実行SQL：" + req1.params.sqlNm);
	// const sqlstr = reqstr[0]["sqlNm"] ? reqstr[0]["sqlNm"] : "INS001_T_STOCK_JP.sql";
	const sql = f.sqlReader(req1.params.sqlNm + ".sql");

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
			text: sql,
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
 * @return client
 */
class connectDB {
	constructor() {
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
}

//routerをモジュールとして扱う準備
module.exports = router;