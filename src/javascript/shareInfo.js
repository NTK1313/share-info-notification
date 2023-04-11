const latestSharePrm = ["SEL001_M_STOCK_JP", "SEL002_T_STOCK_JP", "INS001_T_STOCK_JP"];

/**
 * トランから株価取得
 * @param {実行SQL名} sqlNm 
 */
async function getShareInfo() {
	const res = await fetch(GET_DB_DATA + "/" + this.sqlNm).catch(error => {
		console.error(NETWORK_ERR, error);
		alert(NETWORK_ERR);
		return;
	});
	/** JSONイメージ
		[
			{
				"銘柄コード": 9432,
				"企業名": "NTT",
				"市場区分": "プライム",
				"株価": null,
				"前日からの変動値": null
			}
		]
	*/
	const result = await res.json();
	createTable(result);
};

/**
 * APIを実行して最新の株価取得しDB登録
 * @param {実行SQL名} sqlNm 
 */
async function latestShare() {
	const sql1 = this.sqlNm[0];
	const res = await fetch(GET_DB_DATA + "/" + sql1).catch(error => {
		console.error(NETWORK_ERR, error);
		alert(NETWORK_ERR);
		return;
	});
	/** JSONイメージ
		[
			{
				"銘柄コード": 9432,
				"企業名": "NTT",
				"市場区分": "プライム",
				"処理日時（株価）"2023-03-15 10:00:21":
				"株価（円）": 3964,
				"前日からの変動値": -22
			}
		]
	*/
	const result = await res.json();

	// YahooFinanceAPIを実行する。
	const detail = setApiDetail([METHOD_POST, APPLICATION_JSON, result]);
	const res2 = await fetch(GET_SHARE_INFO_JP, detail).catch(error => {
		console.error(NETWORK_ERR, error);
		alert(NETWORK_ERR);
		return;
	});
	/** JSONイメージ
		[
			{
				"銘柄コード": 9432,
				"処理日時（株価）"2023-03-15 10:00:21.000000":
				"株価": 3964,
				"前日からの変動値": -22
			}
		]
	*/
	const result2 = await res2.json();
	// strの銘柄コードをKeyとして株価と変動値をaddする
	for (let i = 0; i < result.length; i++) {
		let code = result[i]['銘柄コード'];
		for (let j = 0; j < result2.length; j++) {
			if (code == result2[j]['銘柄コード']) {
				result[i]['処理時間（株価）'] = result2[j]['処理時間（株価）'];
				result[i]['株価（円）'] = result2[j]['株価（円）'];
				result[i]['前日からの変動値'] = result2[j]['前日からの変動値'];
			}
		}
	}

	// DB登録前のチェック
	const detail1 = setApiDetail([METHOD_POST, APPLICATION_JSON, result]);
	const sql2 = this.sqlNm[1];
	const res1 = await fetch(CHK_DB_DATA + "/" + sql2, detail1).catch(error => {
		console.error(NETWORK_ERR, error);
		alert(NETWORK_ERR);
		return;
	});
	const result1 = await res1.json();

	// 既に最新データが登録されている場合は後続処理スキップ
	if (result1[0]['count'] > 0) {
		alert('最新情報がDB登録されているため登録処理をスキップします。');
		createTable(result);
		return;
	}

	// 結果を画面表示する。
	createTable(result);

	// DB登録
	const detail2 = setApiDetail([METHOD_POST, APPLICATION_JSON, result2]);
	const sql3 = this.sqlNm[2];
	await fetch(INS_DB_DATA + "/" + sql3, detail2).then(() => {
		alert(LATEST_COMPLETE);
	});
}

// 【更新ボタン押下時のイベント】
// 特定銘柄のみ更新
async function alt(value) {
	let body = [];
	let id = {};
	id['銘柄コード'] = value.id;
	body.push(id);

	// YahooFinanceAPIを実行する。
	// JSONイメージ [{"銘柄コード": 9432}]
	const detail = setApiDetail([METHOD_POST, APPLICATION_JSON, body]);
	const res = await fetch(GET_SHARE_INFO_JP, detail).catch(error => {
		console.error(NETWORK_ERR, error);
		alert(NETWORK_ERR);
		return;
	});
	const result = await res.json();

	// DB登録チェック
	const detail1 = setApiDetail([METHOD_POST, APPLICATION_JSON, result]);
	const res1 = await fetch(CHK_DB_DATA + "/" + "SEL002_T_STOCK_JP", detail1).catch(error => {
		console.error(NETWORK_ERR, error);
		alert(NETWORK_ERR);
		return;
	});
	const result1 = await res1.json();

	// 既に最新データが登録されている場合は後続処理スキップ
	if (result1[0]['count'] > 0) {
		alert(ALREADY_REGISTER);
		return;
	}

	// DB登録
	await fetch(INS_DB_DATA + "/" + "INS001_T_STOCK_JP", detail1);
	alert(REGISTER_COMPLETE);
}

/**
 * API付加情報の設定
 * @param {*} info 
 */
function setApiDetail(info) {
	return detail = {
		method: info[0],
		headers: {
			'Content-Type': info[1]
		},
		body: JSON.stringify(info[2])
	};
}

// 株価取得
btn1.addEventListener(CLICK, { sqlNm: "SEL001_M_STOCK_JP", handleEvent: getShareInfo });
// 株価最新化
btn2.addEventListener(CLICK, { sqlNm: latestSharePrm, handleEvent: latestShare });

