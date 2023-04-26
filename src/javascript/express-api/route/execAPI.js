const yahooFinance = require('../../../node-npm/node_modules/yahoo-finance2').default;
const { exec } = require('child_process');
const express = require('../../../node-npm/node_modules/express');
const router = express.Router();

// 定数
const HISTORICAL = 'historical';
const QUOTE = 'quote';

/**
 * YahooFinanceAPI実行
 * http://localhost:3000/api/v1/execAPI/shareInfo
 */
router.post('/shareInfo/:kbn', async (req, res) => {
	const reqstr = JSON.parse(JSON.stringify(req.body));
	const jpEn = req.params.kbn;
	const execApi = req.query['execApi'];
	// 銘柄コードのみのリスト作成
	let codes = reqstr.map(function (value) {
		return value['銘柄コード'];
	})
	let results;
	if (execApi == QUOTE) {
		results = await call(codes, null, jpEn, execApi);
	}
	if (execApi == HISTORICAL) {
		const chkKikan = [reqstr[0]['検索開始日'], reqstr[0]['検索終了日']];
		results = await call(codes, chkKikan, jpEn, execApi);
	}

	res.json(JSON.parse(JSON.stringify(results)));
});

/**
 * YAHOOファイナンスAPIを実行して株価取得する。
 * @param codes 銘柄コード
 * @param chkKikan 検索対象の期間（0:検索開始日、1:検索終了日）
 * @param jpEn 日本/米国区分
 * @param execApi 呼び出すAPIの種類
 * @returns API取得結果
 */
async function call(codes, chkKikan, jpEn, execApi) {
	// 配列分ループする（forEachはawait/asyncをサポートしていないので利用できない）
	let results = [];
	for (let i = 0; i < codes.length; i++) {
		let code = jpEn == 'JP' ? codes[i] + '.T' : codes[i];
		let result = '';
		if (execApi == HISTORICAL) {
			result = await yahooFinance.historical(code, { period1: chkKikan[0], period2: chkKikan[1] });
			// 期間分をループ
			for (let j = 0; j < result.length; j++) {
				let wk = {};
				wk['brCd'] = codes[i];
				wk['shoriDate'] = convertTime(result[j].date);
				const adjCloseStr = result[j].adjClose.toString().substring(0, 7);
				wk['adjClose'] = jpEn == 'JP' ? '\\' + adjCloseStr : '$' + adjCloseStr;
				results.push(wk);
			}
		}

		if (execApi == QUOTE) {
			let wk = {};
			// CMDコマンド:npx yahoo-finance2 quote 3092.T
			result = await yahooFinance.quote(code);
			// regularMarketPrice:株価
			// regularMarketChange:前日からの変動値
			wk['銘柄コード'] = codes[i];
			wk['処理時間（株価）'] = convertTime(result.regularMarketTime);
			const prmNm = jpEn == 'JP' ? '株価（円）' : '株価（ドル）';
			const priceStr = result.regularMarketPrice.toString().substring(0, 7)
			wk[prmNm] = jpEn == 'JP' ? '\\' + priceStr : '$' + priceStr;
			wk['前日からの変動値'] = Math.round(result.regularMarketChange * 10) / 10;
			results.push(wk);
		}
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
function convertTime(dt) {
	let y = dt.getFullYear();
	let m = ('00' + (dt.getMonth() + 1)).slice(-2);
	let d = ('00' + dt.getDate()).slice(-2);
	let hh = ('00' + dt.getHours()).slice(-2);
	let mm = ('00' + dt.getMinutes()).slice(-2);
	let ss = ('00' + dt.getSeconds()).slice(-2);
	let result = y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
	return result;
}

//routerをモジュールとして扱う準備
module.exports = router;