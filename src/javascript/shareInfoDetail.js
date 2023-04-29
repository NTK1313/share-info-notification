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
	const ymdEnd = document.querySelector('.ymdEnd').value.length == 0 ? editDate() : document.querySelector('.ymdEnd').value;

	// 【】内のブランドコードのみを抽出して後続処理を実行
	let brCd = document.querySelector('#brCd').value;
	const regexp2 = new RegExp('(?<=【).*?(?=】)');
	brCd = brCd.match(regexp2)[0];


	if (ymdStart.length == 0) {
		// デフォルトの開始日時(1週間前)を設定
		const param = { date: -7 };
		ymdStart = editDate(param);
	} else {
		// 日付不正チェック
		let sysStartDate = new Date(ymdStart.substring(0, 4), ymdStart.substring(5, 7) - 1, ymdStart.substring(8, 10));
		let sysEndDate = new Date(ymdEnd.substring(0, 4), ymdEnd.substring(5, 7) - 1, ymdEnd.substring(8, 10));
		if (!compareDate(sysStartDate, sysEndDate, 'P')) {
			alert(KIKAN_FUSEI_ERR);
			return;
		}

		// 日付の範囲チェック
		// 現在日付から２カ月前（テーブル構成を再検討して期間を延ばす）
		let sysChkDate = new Date(ymdEnd.substring(0, 4), ymdEnd.substring(5, 7) - 3, ymdEnd.substring(8, 10));
		if (!compareDate(sysStartDate, sysChkDate, 'F')) {
			alert(KIKAN_CHK_2M_OVER_ERR);
			return;
		}
	}

	const hc = new EditHtmlClass('.loader');
	hc.add('latest');

	// 実行SQLの選択
	let selSql = enjp == JP ? 'SEL009_T_STOCK_JP' : 'SEL010_T_STOCK_EN';
	const check = [{ 'brCd': brCd, 'ymdStart': ymdStart, 'ymdEnd': ymdEnd }];

	const execChkDb = await fetch(CHK_DB_DATA + '?' + SQL_NM + '=' + selSql, setApiDetail([METHOD_POST, APPLICATION_JSON, check])).catch(error => {
		console.error(NETWORK_ERR, error);
		hc.remove('latest');
		alert(NETWORK_ERR);
		return;
	});
	const resultChkDb = await execChkDb.json();
	hc.remove('latest');
	if (resultChkDb.length == 0) {
		alert(SHARE_IS_NOT_REGISTOR);
	} else {
		const hc2 = new EditHtmlClass('.sharetable');
		hc2.remove('before');
		hc2.add('latest');
		createTable(resultChkDb, false);

		let prices = [];
		let days = [];
		for (let key in resultChkDb) {
			const replacePrm = enjp == JP ? '\\' : '$';
			prices.push(resultChkDb[key]['株価'].replace(replacePrm, ''));
			days.push(resultChkDb[key]['処理日']);
		}

		const hc3 = new EditHtmlClass('.mycanvas');
		hc3.remove('before');
		hc3.add('latest');
		createGraph(prices, days);
	}
};

/**
 * グラフ作成
 * @param {*} prices 価格の配列
 * @param {*} days 日付の配列
 */
function createGraph(prices, days) {
	if (window.myGraph) {
		myGraph.destroy();
	}
	const config = {
		type: 'line',
		data: {
			datasets: [{
				data: prices,
				label: '株価推移',
				borderWidth: 1
			}],
			labels: days
		},
		options: {
			responsive: true,
			ticks: {                       // 目盛り
				min: 600,                  // 最小値
				max: 1000,                 // 最大値
				stepSize: 10,              // 軸間隔
				fontColor: "blue",         // 目盛りの色
				fontSize: 5                // フォントサイズ
			}
		}
	};
	const ctx = document.getElementById('mycanvas__graph').getContext('2d');
	window.myGraph = new Chart(ctx, config);
}

// 要素を取得
select.addEventListener(CLICK, getShareInfo);

window.addEventListener(LOAD, function () {
	let ymdEnd = document.querySelector('.ymdEnd');
	ymdEnd.value = editDate();
});