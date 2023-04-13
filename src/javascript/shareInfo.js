const latestSharePrm = ["SEL001_M_STOCK_JP", "SEL002_T_STOCK_JP", "INS001_T_STOCK_JP"];

/**
 * トランから株価取得
 */
async function getShareInfo() {
	const hc = new EditHtmlClass('.loader');
	hc.add('latest');
	const execGetDb = await fetch(GET_DB_DATA + "/" + this.sqlNm).catch(error => {
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
	const resultGetDb = await execGetDb.json();
	hc.remove('latest');
	createTable(resultGetDb);
};

/**
 * APIを実行して最新の株価取得しDB登録
 */
async function latestShare() {
	const hc = new EditHtmlClass('.loader');
	hc.add('latest');

	const sel001 = this.sqlNm[0];
	const execGetDb = await fetch(GET_DB_DATA + "/" + sel001).catch(error => {
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
	const resultGetDb = await execGetDb.json();

	// YahooFinanceAPIを実行する。
	const execGetShareInfo = await fetch(GET_SHARE_INFO_JP, setApiDetail([METHOD_POST, APPLICATION_JSON, resultGetDb])).catch(error => {
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
	const resultGetShareInfo = await execGetShareInfo.json();
	// strの銘柄コードをKeyとして株価と変動値をaddする
	for (let i = 0; i < resultGetDb.length; i++) {
		let code = resultGetDb[i]['銘柄コード'];
		for (let j = 0; j < resultGetShareInfo.length; j++) {
			if (code == resultGetShareInfo[j]['銘柄コード']) {
				resultGetDb[i]['処理時間（株価）'] = resultGetShareInfo[j]['処理時間（株価）'];
				resultGetDb[i]['株価（円）'] = resultGetShareInfo[j]['株価（円）'];
				resultGetDb[i]['前日からの変動値'] = resultGetShareInfo[j]['前日からの変動値'];
			}
		}
	}

	// DB登録前のチェック
	const sel002 = this.sqlNm[1];
	const execChkDb = await fetch(CHK_DB_DATA + "/" + sel002, setApiDetail([METHOD_POST, APPLICATION_JSON, resultGetDb])).catch(error => {
		console.error(NETWORK_ERR, error);
		alert(NETWORK_ERR);
		return;
	});
	const resultChkDb = await execChkDb.json();

	// 既に最新データが登録されている場合は後続処理スキップ
	if (resultChkDb.length > 0) {
		const codeInfo = resultChkDb.map(function (value) {
			return value['chk'];
		});
		let data = codeInfo.reduce((acc, curr) => {
			return `${acc}\n${curr}`;
		}, '\n');
		hc.remove('latest');
		createTable(resultGetDb);
		alert(ALREADY_REGISTER_ALL + data);
		return;
	}

	// DB登録
	const ins001 = this.sqlNm[2];
	await fetch(INS_DB_DATA + "/" + ins001, setApiDetail([METHOD_POST, APPLICATION_JSON, resultGetShareInfo])).then(() => {
		alert(LATEST_COMPLETE);
	});

	hc.remove('latest');
	createTable(resultGetDb);
}

/**
 * 【更新ボタン押下時のイベント】
 * 特定銘柄のみ更新
 * @param {銘柄情報} value 
 * @returns 
 */
async function alt(value) {
	let body = [];
	let id = {};
	id['銘柄コード'] = value.id;
	body.push(id);

	// YahooFinanceAPIを実行する。
	// JSONイメージ [{"銘柄コード": 9432}]
	const execGetShareInfo = await fetch(GET_SHARE_INFO_JP, setApiDetail([METHOD_POST, APPLICATION_JSON, body])).catch(error => {
		console.error(NETWORK_ERR, error);
		alert(NETWORK_ERR);
		return;
	});
	const resultGetShareInfo = await execGetShareInfo.json();

	// DB登録チェック
	const execChkDb = await fetch(CHK_DB_DATA + "/" + "SEL002_T_STOCK_JP", setApiDetail([METHOD_POST, APPLICATION_JSON, resultGetShareInfo])).catch(error => {
		console.error(NETWORK_ERR, error);
		alert(NETWORK_ERR);
		return;
	});
	const resultChkDb = await execChkDb.json();

	// 既に最新データが登録されている場合は後続処理スキップ
	if (resultChkDb.length > 0) {
		alert(ALREADY_REGISTER);
		return;
	}

	// DB登録
	await fetch(INS_DB_DATA + "/" + "INS001_T_STOCK_JP", setApiDetail([METHOD_POST, APPLICATION_JSON, resultGetShareInfo]));
	alert(REGISTER_COMPLETE);
}

// 株価取得
btn1.addEventListener(CLICK, { sqlNm: "SEL001_M_STOCK_JP", handleEvent: getShareInfo });
// 株価最新化
btn2.addEventListener(CLICK, { sqlNm: latestSharePrm, handleEvent: latestShare });
