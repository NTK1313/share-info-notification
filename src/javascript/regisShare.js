/**
 * 日本株・米国株の市場区分
 */
let array = new Array();
array[''] = new Array({ kbn: PREASE_SELECT });
array[JP] = new Array(
	{ kbn: PRIME },
	{ kbn: STANDARD },
	{ kbn: GROWTH }
);
array[EN] = [
	{ kbn: NYSE },
	{ kbn: NASDAQ }
];

/**
 * 株式ごとの市場区分選択
 */
document.querySelector("select[name='enjp']").onchange = function () {
	const segment = document.querySelector('#segment');
	segment.options.length = 0
	const changedPref = enjp.value;
	for (let i = 0; i < array[changedPref].length; i++) {
		let op = document.createElement('option');
		value = array[changedPref][i]
		op.value = value.kbn;
		op.innerText = value.kbn;
		segment.appendChild(op);
	}
}

/**
 * DBに銘柄登録
 */
async function regisInfo() {
	const enjp = document.querySelector('#enjp').value;
	const brCd = document.querySelector('#brCd').value;
	const brNm = document.querySelector('#brNm').value;
	const segment = document.querySelector('#segment').value;
	const regexp = new RegExp('^[1-9][0-9]{3}$');

	// 入力値チェック
	if (requireChk(brCd, REQUIRE_BR_CD)) {
		return;
	}
	if (requireChk(brNm, REQUIRE_BR_NM)) {
		return;
	}
	if (requireChk(segment, REQUIRE_SEGMENT)) {
		return;
	}
	if (enjp == JP && !regexp.test(brCd)) {
		alert(KETA_CHK_BR_CD);
		return;
	}

	// DB重複チェック
	const check = [{ 'brCd': brCd }];
	let sqlNm1 = enjp == JP ? 'SEL003_M_STOCK_JP' : 'SEL006_M_STOCK_EN';
	const execChkDb = await fetch(CHK_DB_DATA + '?' + SQL_NM + '=' + sqlNm1, setApiDetail([METHOD_POST, APPLICATION_JSON, check])).catch(error => {
		console.error(NETWORK_ERR, error);
		alert(NETWORK_ERR);
		return;
	});
	const resultChkDb = await execChkDb.json();

	// 既に最新データが登録されている場合は後続処理スキップ
	if (resultChkDb[0]['count'] > 0) {
		alert(DUPLICATE_BR_CD);
		return;
	}

	// リクエスト作成（JSON）
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
	let regisInfo = [{ 'brCd': brCd, 'brNm': brNm, 'segment': segment }];

	// API呼び出し、DB登録
	// DB登録（非同期）
	let sqlNm2 = enjp == JP ? 'INS002_M_STOCK_JP' : 'INS004_M_STOCK_EN';
	// setApiDetail([METHOD_POST, APPLICATION_JSON, resultGetDb])
	await fetch(INS_DB_DATA + '?' + SQL_NM + '=' + sqlNm2, setApiDetail([METHOD_POST, APPLICATION_JSON, regisInfo])).catch(error => {
		console.error(NETWORK_ERR, error);
		alert(NETWORK_ERR);
		return;
	});
}

// 要素を取得
btn.addEventListener(CLICK, regisInfo);
