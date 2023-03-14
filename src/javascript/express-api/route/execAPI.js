const yahooFinance = require('../../../node-npm/node_modules/yahoo-finance2').default;
const express = require('../../../node-npm/node_modules/express');
var router = express.Router();
// YahooFinanceAPIを実行して銘柄情報を取得する
// http://localhost:3000/api/v1/execAPI/shareInfo
router.post('/shareInfo', async (req, res) => {
	var reqstr = JSON.parse(JSON.stringify(req.body));
	// 銘柄コードのみのリスト作成
	var codes = reqstr.map(function (value) {
		console.log(value["銘柄コード"]);
		return value["銘柄コード"];
	})
	// リクエストから必要な情報を抜き出し配列で保持
	var results = await call(codes);
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