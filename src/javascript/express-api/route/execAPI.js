const yahooFinance = require('../../../node-npm/node_modules/yahoo-finance2').default;
const express = require('../../../node-npm/node_modules/express');
var router = express.Router();

/**
 * YahooFinanceAPI実行
 * http://localhost:3000/api/v1/execAPI/shareInfo
 */
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

/**
 * YAHOOファイナンスAPIを実行して株価取得する。
 * @param codes 銘柄コード 
 * @returns API取得結果
 */
async function call(codes) {
	// 配列分ループする（forEachはawait/asyncをサポートしていないので利用できない）
	var results = [];
	for (let i = 0; i < codes.length; i++) {
		const result = await yahooFinance.quote(codes[i] + '.T');
		// regularMarketPrice:株価
		// regularMarketChange:前日からの変動値
		let wk = {};
		wk['銘柄コード'] = codes[i];
		wk['処理時間（株価）'] = convertTime(result.regularMarketTime);
		wk['株価'] = result.regularMarketPrice;
		wk['前日からの変動値'] = result.regularMarketChange;
		results.push(wk);
	}
	return results;
}

/**
 * 日付フォーマット変換
 * 変換前：Wed Mar 15 2023 09:36:09 GMT+0900 (日本標準時)
 * 変換後：2023-03-15 09:36:09.000000
 * @param dt　フォーマット変換前の日付 
 * @returns フォーマット変換後の日付
 */
function convertTime(dt){
	var y = dt.getFullYear();
	var m = ("00" + (dt.getMonth()+1)).slice(-2);
	var d = ("00" + dt.getDate()).slice(-2);
	var hh =("00" + dt.getHours()).slice(-2);
	var mm =("00" + dt.getMinutes()).slice(-2);
	var ss =("00" + dt.getSeconds()).slice(-2);
	var msec=("000000"+dt.getMilliseconds()).slice(-6);
	var result = y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss + "."+msec;
	console.log(result);
	return result;
}

//routerをモジュールとして扱う準備
module.exports = router;