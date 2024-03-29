/**
 * 株式ごとの銘柄情報取得
 */
document.querySelector("select[name='enjp']").onchange = async function () {
	const sqlNm1 = enjp.value == JP ? 'SEL011_M_STOCK_JP' : 'SEL012_M_STOCK_EN';
	// DBアクセス
	const execGetDb = await fetch(GET_DB_DATA + '?' + SQL_NM + '=' + sqlNm1).catch(error => {
		console.error(NETWORK_ERR, error);
		hc.remove('latest');
		alert(NETWORK_ERR);
		return;
	});
	const resultGetDb = await execGetDb.json();
	const brCd = document.querySelector('#brCd');
	brCd.options.length = 0;
	for (let i = 0; i < resultGetDb.length; i++) {
		let op = document.createElement('option');
		value = resultGetDb[i];
		op.value = value['br'];
		op.innerText = value['br'];
		brCd.appendChild(op);
	}
}

/**
 * DB検索
 */
async function getShareInfo() {
	const enjp = document.querySelector('#enjp').value;
	let ymdStart = document.querySelector('.ymdStart').value;
	let ymdEnd = document.querySelector('.ymdEnd').value;

	// 【】内のブランドコードのみを抽出して後続処理を実行
	let brCd = document.querySelector('#brCd').value;
	const regexp = new RegExp('(?<=【).*?(?=】)');
	brCd = brCd.match(regexp)[0];

	// 入力値チェック
	if (requireChk(ymdStart, REQUIRE_KIKAN)) {
		return;
	} else if (requireChk(ymdEnd, REQUIRE_KIKAN)) {
		return;
	}

	// 日付不正チェック
	const sysStartDate = new Date(ymdStart.substring(0, 4), ymdStart.substring(5, 7) - 1, ymdStart.substring(8, 10));
	const sysEndDate = new Date(ymdEnd.substring(0, 4), ymdEnd.substring(5, 7) - 1, ymdEnd.substring(8, 10));
	if (!compareDate(sysStartDate, sysEndDate, 'P')) {
		alert(KIKAN_FUSEI_ERR);
		return;
	}

	// 未来日チェック
	let tomorrow = editDate({ date: 1 });
	const sysTomorrow = new Date(tomorrow.substring(0, 4), tomorrow.substring(5, 7) - 1, tomorrow.substring(8, 10));
	if (!compareDate(sysTomorrow, sysEndDate, 'F')) {
		alert(KIKAN_FUTURE_ERR);
		return;
	}

	// 日付の範囲チェック
	// ymdEndから１カ月前
	const sysChkDate = new Date(ymdEnd.substring(0, 4), ymdEnd.substring(5, 7) - 2, ymdEnd.substring(8, 10));
	if (!compareDate(sysStartDate, sysChkDate, 'F')) {
		alert(KIKAN_CHK_1M_OVER_ERR);
		return;
	}

	// const hc = new EditHtmlClass('.loader');
	// hc.add('latest');

	// 実行SQLの選択
	const selSql = enjp == JP ? 'SEL003_M_STOCK_JP' : 'SEL006_M_STOCK_EN';
	const check = [{ 'brCd': brCd }];
	// 銘柄登録チェック
	const execChkDb = await fetch(CHK_DB_DATA + '?' + SQL_NM + '=' + selSql, setApiDetail([METHOD_POST, APPLICATION_JSON, check])).catch(error => {
		console.error(NETWORK_ERR, error);
		hc.remove('latest');
		alert(NETWORK_ERR);
		return;
	});
	const resultChkDb = await execChkDb.json();
	// hc.remove('latest');
	if (resultChkDb.length == 0) {
		alert(SHARE_IS_NOT_REGISTOR);
		return;
	}

	// 過去データの取得
	ymdStart = ymdStart.replaceAll('/', '-')
	ymdEnd = ymdEnd.replaceAll('/', '-')

	// YahooFinanceAPIを実行する。
	const apiNm = enjp == JP ? GET_SHARE_INFO_JP : GET_SHARE_INFO_EN;
	const body = [{ '銘柄コード': brCd, '検索開始日': ymdStart, '検索終了日': ymdEnd }];
	const execGetShareInfo = await fetch(apiNm + '?' + EXEC_API + '=' + HISTORICAL, setApiDetail([METHOD_POST, APPLICATION_JSON, body])).catch(error => {
		console.error(NETWORK_ERR, error);
		// hc.remove('latest');
		alert(NETWORK_ERR);
		return;
	});
	const resultGetShareInfo = await execGetShareInfo.json();
	// 連想配列からSELECT句作成
	const sqlPrm = sqlDualQuery(resultGetShareInfo);
	const body2 = [{ 'Query': sqlPrm }];
	// ワーク登録
	await fetch(INS_DB_DATA + '?' + SQL_NM + '=' + 'INS005_WK_STOCK' + '&' + REPLACE_SQL_QUERY + '=' + 'true', setApiDetail([METHOD_POST, APPLICATION_JSON, body2]));

	// トラン登録
	const sqlNm = enjp == JP ? 'SEI001_T_STOCK_JP' : 'SEI002_T_STOCK_EN';
	await fetch(GET_DB_DATA + '?' + SQL_NM + '=' + sqlNm).catch(error => {
		console.error(NETWORK_ERR, error);
		// hc.remove('latest');
		alert(NETWORK_ERR);
		return;
	});
	// ワークテーブル削除
	// TODO:ワークが初期化されない、トランに登録されない時がたまにあるので原因調査する。
	await fetch(GET_DB_DATA + '?' + SQL_NM + '=' + 'DEL001_WK_STOCK').catch(error => {
		console.error(NETWORK_ERR, error);
		// hc.remove('latest');
		alert(NETWORK_ERR);
		return;
	});
	alert(UPDATE_COMPLETE)
};

// 要素を取得
select.addEventListener(CLICK, getShareInfo);

window.addEventListener(LOAD, function () {
	let ymdEnd = document.querySelector('.ymdEnd');
	ymdEnd.value = editDate();
});