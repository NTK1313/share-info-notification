const latestSharePrm = ['SEL004_M_STOCK_EN', 'SEL005_T_STOCK_EN', 'INS003_T_STOCK_EN'];

/**
 * トランから株価取得
 * @param {実行SQL名} sqlNm 
 */
async function getShareInfo() {
	const hc = new EditHtmlClass('.loader');
	hc.add('latest');
	const execGetDb = await fetch(GET_DB_DATA + '/' + this.sqlNm).catch(error => {
		console.error(NETWORK_ERR, error);
		hc.remove('latest');
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
 * @param {実行SQL名} sqlNm 
 */
async function latestShare() {
	const hc = new EditHtmlClass('.loader');
	hc.add('latest');

	const sel004 = this.sqlNm[0];
	const execGetDb = await fetch(GET_DB_DATA + '/' + sel004).catch(error => {
		console.error(NETWORK_ERR, error);
		hc.remove('latest');
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
				"株価": 3964,
				"前日からの変動値": -22
			}
		]
	*/
	const resultGetDb = await execGetDb.json();

	// YahooFinanceAPIを実行する。
	const execGetShareInfo = await fetch(GET_SHARE_INFO_EN, setApiDetail([METHOD_POST, APPLICATION_JSON, resultGetDb])).catch(error => {
		console.error(NETWORK_ERR, error);
		hc.remove('latest');
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
				resultGetDb[i]['株価（ドル）'] = resultGetShareInfo[j]['株価（ドル）'];
				resultGetDb[i]['前日からの変動値'] = resultGetShareInfo[j]['前日からの変動値'];
			}
		}
	}

	// DB登録前のチェック
	const sel005 = this.sqlNm[1];
	const execChkDb = await fetch(CHK_DB_DATA + '/' + sel005, setApiDetail([METHOD_POST, APPLICATION_JSON, resultGetDb])).catch(error => {
		console.error(NETWORK_ERR, error);
		hc.remove('latest');
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

	// DB登録（非同期）
	const ins003 = this.sqlNm[2];
	fetch(INS_DB_DATA + '/' + ins003, setApiDetail([METHOD_POST, APPLICATION_JSON, resultGetShareInfo]));

	hc.remove('latest');
	createTable(resultGetDb);
}

/**
 * 【更新ボタン押下時のイベント】
 * 特定銘柄のみ更新
 * @param {銘柄情報} value 
 * @returns 
 */
async function update(value) {
	const body = [{'銘柄コード':value.id}];

	// YahooFinanceAPIを実行する。
	// JSONイメージ [{"銘柄コード": PG}]
	const execGetShareInfo = await fetch(GET_SHARE_INFO_EN, setApiDetail([METHOD_POST, APPLICATION_JSON, body])).catch(error => {
		console.error(NETWORK_ERR, error);
		alert(NETWORK_ERR);
		return;
	});
	const resultGetShareInfo = await execGetShareInfo.json();

	// DB登録チェック
	const execChkDb = await fetch(CHK_DB_DATA + '/' + 'SEL005_T_STOCK_EN', setApiDetail([METHOD_POST, APPLICATION_JSON, resultGetShareInfo])).catch(error => {
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
	await fetch(INS_DB_DATA + '/' + 'INS003_T_STOCK_EN', setApiDetail([METHOD_POST, APPLICATION_JSON, resultGetShareInfo]));
	alert(REGISTER_COMPLETE);
}

// 株価取得
btnEn1.addEventListener('click', { sqlNm: 'SEL004_M_STOCK_EN', handleEvent: getShareInfo });
// 株価最新化
btnEn2.addEventListener('click', { sqlNm: latestSharePrm, handleEvent: latestShare });
