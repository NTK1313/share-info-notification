/**
 * DB検索
 */
async function getShareInfo() {
	// 入力値チェック
	const enjp = document.querySelector('#enjp').value;
	const brCd = document.querySelector('#brCd').value;
	let dateStart = document.querySelector('.dateStart').value;
	const dateEnd = document.querySelector('.dateEnd').value.length == 0 ? editDate() : document.querySelector('.dateEnd').value;
	const regexp = new RegExp('[0-9]{4}');

	// 必須チェック
	if (brCd == '') {
		alert(REQUIRE_BR_CD);
		return;
	} else if (enjp == '') {
		alert(REQUIRE_SHARE_KBN);
		return;
	}
	// 桁数チェック
	if (!regexp.test(brCd) && enjp == JP) {
		alert(KETA_CHK_BR_CD);
		return;
	}

	if (dateStart.length == 0) {
		// デフォルトの開始日時(1週間前)を設定
		const param = { date: -7 };
		dateStart = editDate(param);
	} else {
		let sysStartDate = new Date(dateStart.substring(0, 4), dateStart.substring(5, 7) - 1, dateStart.substring(8, 10));
		let sysEndDate = new Date(dateEnd.substring(0, 4), dateEnd.substring(5, 7) - 1, dateEnd.substring(8, 10));

		// 日付不正チェック
		let fuseiChk = compareDate(sysStartDate, sysEndDate, 'P');
		if (!fuseiChk) {
			alert(KIKAN_FUSEI_ERR);
			return;
		}

		// 現在日付から２カ月前
		let sysChkDate = new Date(dateEnd.substring(0, 4), dateEnd.substring(5, 7) - 3, dateEnd.substring(8, 10));

		// 日付の範囲チェック
		let ChokaChk = compareDate(sysStartDate, sysChkDate, 'F');
		if (!ChokaChk) {
			alert(KIKAN_CHK_2M_OVER_ERR);
			return;
		}
	}

	const hc = new EditHtmlClass('.loader');
	hc.add('latest');

	// 実行SQLの選択
	let selSql = enjp == JP ? 'SEL009_T_STOCK_JP' : 'SEL010_T_STOCK_EN';
	const check = [{ 'brCd': brCd, 'dateStart': dateStart, 'dateEnd': dateEnd }];

	const execChkDb = await fetch(CHK_DB_DATA + '/' + selSql, setApiDetail([METHOD_POST, APPLICATION_JSON, check])).catch(error => {
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
	let dateEnd = document.querySelector('.dateEnd');
	dateEnd.value = editDate();
});