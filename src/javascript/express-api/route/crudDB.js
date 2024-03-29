const express = require('../../../node-npm/node_modules/express');
const router = express.Router();
let { Client } = require('../../../node-npm/node_modules/pg/lib');
const f = require('./execSql.js');

// 定数一覧
const sqlNm = 'sqlNm';
const replaceSqlQuery = 'replaceSqlQuery';

// TODO:/getPriceの処理のように非同期させればDB接続を共通化出来そう。

/**
 * DB検索
 * http://localhost:3000/api/v1/crudDB/getDBData
 */
router.get('/getDBData', function (req, res) {
	// SQL実行
	const client = new connectDB();
	const sel001 = f.sqlReader(req.query[sqlNm] + '.sql');

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
	const client = new connectDB();
	const reqstr = JSON.parse(JSON.stringify(req1.body));
	const sqlstr = req1.query[sqlNm] + '.sql';
	const sql = f.sqlReader(sqlstr);
	let v = [];
	if (sqlstr == 'SEL002_T_STOCK_JP.sql' || sqlstr == 'SEL005_T_STOCK_EN.sql') {
		// 銘柄コードの配列と処理時間の配列を配列にセット
		const codes = reqstr.map(function (value) {
			return value['銘柄コード'];
		});
		let times = reqstr.map(function (value) {
			return value['処理時間（株価）'];
		});
		// 重複削除
		const uniquCodes = Array.from(new Map(codes.map((value) => [value])));
		const uniqueTimes = Array.from(new Map(times.map((value) => [value])));
		v.push(uniquCodes);
		v.push(uniqueTimes);
	} else if (sqlstr == 'SEL009_T_STOCK_JP.sql' || sqlstr == 'SEL010_T_STOCK_EN.sql') {
		// 銘柄情報詳細
		const code = reqstr[0]['brCd'];
		const ymdStart = reqstr[0]['ymdStart'];
		const ymdEnd = reqstr[0]['ymdEnd'];
		v.push(code);
		v.push(ymdStart);
		v.push(ymdEnd);
	}
	else {
		// 銘柄登録、銘柄更新、銘柄詳細情報
		const code = reqstr[0]['brCd'];
		v.push(code);
	}

	let query = {
		text: sql,
		values: v,
	}
	client.query(query, (err, res) => {
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
	const client = new connectDB();
	const reqstr = JSON.parse(JSON.stringify(req1.body));
	let sql = f.sqlReader(req1.query[sqlNm] + '.sql');

	// 実行SQLの置換を行うかどうか
	console.log(req1.query[replaceSqlQuery]);
	const replaceFlg = req1.query[replaceSqlQuery] ? true : false;

	// ループして１件ずつINSERTする
	for (let i = 0; i < reqstr.length; i++) {
		let v = [];
		let keyList = Object.keys(reqstr[i]);
		let query = '';
		for (let key in keyList) {
			if (replaceFlg) {
				sql = sql.replace('$1', reqstr[i][keyList[key]]);
			} else {
				v.push(reqstr[i][keyList[key]]);
			}
		}
		query = replaceFlg ? { text: sql } : { text: sql, values: v };
		client.query(query, (err, res) => {
			// クエリ実行後の処理
			if (err) {
				console.log('登録ERR');
				console.log(err);
				throw err;
			} else {
				console.log('レコード登録');
				// 非同期実行が全て終わった時に切断
				client.on('drain', client.end.bind(client));
			}
		});
	}
	console.log('登録処理完了');
	res1.json('[{"MSG": 処理完了}]');
});

/**
 * DB更新
 * http://localhost:3000/api/v1/crudDB/updateDBData
 */
router.post('/updateDBData', function (req1, res1) {
	const client = new connectDB();
	// 更新は1件ずつ行う想定
	const reqstr = JSON.parse(JSON.stringify(req1.body))[0];
	const sql = f.sqlReader(req1.query[sqlNm] + '.sql');

	let keyList = Object.keys(reqstr);
	let query = {
		text: sql,
		values: keyList,
	}
	client.query(query, (err, res) => {
		// クエリ実行後の処理
		if (err) {
			console.log('処理ERR');
			console.log(err);
			throw err;
		} else {
			console.log('処理完了');
			// const obj = JSON.parse(JSON.stringify(res.rows));
			client.end();
			// res1.json(obj);
			res1.json('[{"MSG": 処理完了}]');
		}
	});
});

/**
 * DB接続
 * @return client
 */
class connectDB {
	constructor() {
		const client = new Client({
			user: 'postgres',
			host: '127.0.0.1',
			database: 'sharedb',
			password: 'skskr20081106',
			port: 5432,
		});
		client.connect();
		return client;
	}
}

//routerをモジュールとして扱う準備
module.exports = router;