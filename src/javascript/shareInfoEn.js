const latestSharePrm = ["SEL004_M_STOCK_EN", "SEL005_T_STOCK_EN", "INS003_T_STOCK_EN"];

/**
 * トランから株価取得
 * @param {実行SQL名} sqlNm 
 */
async function getShareInfo() {
	const res = await fetch(GET_DB_DATA + "/" + this.sqlNm).catch(error => {
		console.error('通信に失敗しました', error);
		alert('通信に失敗しました');
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
		console.error('通信に失敗しました', error);
		alert('通信に失敗しました');
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
	const result = await res.json();

	// YahooFinanceAPIを実行する。
	const res2 = await fetch(GET_SHARE_INFO_EN, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(result)
	}).catch(error => {
		console.error('通信に失敗しました', error);
		alert('通信に失敗しました');
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
				result[i]['株価（ドル）'] = result2[j]['株価（ドル）'];
				result[i]['前日からの変動値'] = result2[j]['前日からの変動値'];
			}
		}
	}

	// DB登録前のチェック
	const sql2 = this.sqlNm[1];
	const res1 = await fetch(CHK_DB_DATA + "/" + sql2, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(result)
	}).catch(error => {
		console.error('通信に失敗しました', error);
		alert('通信に失敗しました');
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

	// DB登録（非同期）
	const sql3 = this.sqlNm[2];
	fetch(INS_DB_DATA + "/" + sql3, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(result2)
	});
}

// 画面に表示する表作成
function createTable(result) {
	const ta = new DesignTableCreate(result);
	ta.animate();
}

/**
 * データ表作成＆カラーリング
 */
class TableCreate {
	constructor(result) {
		this.DOM = {};
		this.DOM.table = document.querySelector('#tablebody');
		// ヘッダ作成
		this.result = result;
		const share = result[0];
		const keyList = Object.keys(share);
		let data = keyList.reduce((acc, curr) => {
			return `${acc}<th>${curr}</th>`;
		}, "");
		data += '<th>更新</th>';
		// ボディ作成
		this.DOM.table.innerHTML = data + this._makeBody();
	}
	_makeBody() {
		return this.result.reduce((acc, curr) => {
			let valueList = Object.values(curr);
			// 銘柄コードをIDとして付与
			let code = valueList[0];
			// 1カラムずつ編集
			let edit = valueList.reduce((acc1, curr1) => {
				return `${acc1}<td>${curr1}</td>`;
			}, "");
			// 更新ボタン付与
			// edit += `<td><button id="cd${code}">更新</button></td>`;
			edit += `<td><button id="btntest">更新</button></td>`;
			// 1レコードずつ編集
			return `${acc}<tr>${edit}</tr>`;
		}, "");
	}
}

class DesignTableCreate extends TableCreate {
	constructor(result) {
		super(result);
		this.DOM.tr = document.querySelectorAll('tr');
	}

	animate() {
		this.DOM.tr.forEach((c, i) => {
			c.style.color = '#082029d7';
			// 1行ごとに色を変更する
			if (i == 0 || i % 2 == 0) {
				c.style.backgroundColor = '#86d2f0d7';
			} else {
				c.style.backgroundColor = '#ebf5f8d7';
			}
		});
	}
}

// 株価取得
btnEn1.addEventListener('click', { sqlNm: "SEL004_M_STOCK_EN", handleEvent: getShareInfo });
// 株価最新化
btnEn2.addEventListener('click', { sqlNm: latestSharePrm, handleEvent: latestShare });

// btntest.onclick = () => {
// 	alert('Hello test');
// }