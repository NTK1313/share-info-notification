// TODO一覧
// 必須チェック、エラーチェック
// 銘柄登録チェック
// 過去データ取得
// トラン登録可否チェック（既に登録済みのものはスキップして登録できるように）
// トラン登録

/**
 * DB検索
 */
async function getShareInfo() {
	const enjp = document.querySelector('#enjp').value;
	const brCd = document.querySelector('#brCd').value;
	let ymdStart = document.querySelector('.ymdStart').value;
	let ymdEnd = document.querySelector('.ymdEnd').value;
	const regexp = new RegExp('[0-9]{4}');

	// 入力値チェック
	if (requireChk(brCd, REQUIRE_BR_CD)) {
		return;
	}
	if (requireChk(enjp, REQUIRE_SHARE_KBN)) {
		return;
	}
	if (!regexp.test(brCd) && enjp == JP) {
		alert(KETA_CHK_BR_CD);
		return;
	}
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
	let today = editDate();
	const sysToday = new Date(today.substring(0, 4), today.substring(5, 7) - 1, today.substring(8, 10));
	if (!compareDate(sysToday, sysEndDate, 'F')) {
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

	// ワーク登録
	await fetch(INS_DB_DATA + '?' + SQL_NM + '=' + 'INS005_WK_STOCK', setApiDetail([METHOD_POST, APPLICATION_JSON, resultGetShareInfo]));

	// トラン登録
	const sqlNm = enjp == JP ? 'SEI001_T_STOCK_JP' : 'SEI002_T_STOCK_EN';
	await fetch(GET_DB_DATA + '?' + SQL_NM + '=' + sqlNm).catch(error => {
		console.error(NETWORK_ERR, error);
		// hc.remove('latest');
		alert(NETWORK_ERR);
		return;
	});
	// ワークテーブル削除
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