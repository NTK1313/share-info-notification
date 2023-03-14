const yahooFinance = require('../../../node-npm/node_modules/yahoo-finance2').default;
const express = require('../../../node-npm/node_modules/express');
var router = express.Router();
var { Client } = require('../../../node-npm/node_modules/pg');
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

// 取得した銘柄の現在値を取得する
// http://localhost:3000/api/v1/article1/getPrice
router.post('/getPrice', async (req, res) => {
	var reqstr = JSON.parse(JSON.stringify(req.body));
	// 銘柄コードのみのリスト作成
	var codes = reqstr.map(function (value) {
		console.log(value["銘柄コード"]);
		return value["銘柄コード"];
	})
	// リクエストから必要な情報を抜き出し配列で保持（ループ）
	var results = await call(codes);

	// DBに結果登録（非同期）

	// レスポンスの作成
	res.json(JSON.parse(JSON.stringify(results)));
});

// YAHOOファイナンスAPIを実行して株価取得する。
async function call(codes) {
	// 配列分ループする（forEachはawait/asyncをサポートしていないので利用できない）
	var results = [];
	for (let i = 0; i < codes.length; i++) {
		const result = await yahooFinance.quote(codes[i] + '.T');
		// regularMarketPrice:株価
		// regularMarketChange:前日からの変動値
		let wk = {};
		wk['銘柄コード'] = codes[i];
		wk['株価'] = result.regularMarketPrice;
		wk['前日からの変動値'] = result.regularMarketChange;
		results.push(wk);
	}
	return results;
}

//routerをモジュールとして扱う準備
module.exports = router;