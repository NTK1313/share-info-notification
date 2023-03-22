const GET_DB_DATA = "http://127.0.0.1:3000/api/v1/crudDB/getDBData";
const CHK_DB_DATA = "http://localhost:3000/api/v1/crudDB/checkDBData";
const INS_DB_DATA = "http://localhost:3000/api/v1/crudDB/insertDBData";
const GET_SHARE_INFO = "http://127.0.0.1:3000/api/v1/execAPI/shareInfo";

async function callApi1() {
	const res = await fetch(GET_DB_DATA);
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

async function callApi2() {
	const res = await fetch(GET_DB_DATA);
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
	const res2 = await fetch(GET_SHARE_INFO, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(result)
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
				result[i]['株価'] = result2[j]['株価'];
				result[i]['前日からの変動値'] = result2[j]['前日からの変動値'];
			}
		}
	}

	// DB登録前のチェック
	const res1 = await fetch(CHK_DB_DATA, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(result)
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
	fetch(INS_DB_DATA, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(result2)
	});
}

// 画面に表示する表作成
function createTable(result) {
	//  表作成
	let table = document.querySelector('#tablebody');
	let data = '';
	for (let i = 0; i < result.length; i++) {
		const share = result[i];
		const keyList = Object.keys(share);

		// ヘッダ作成
		if (i == 0) {
			for (let key in keyList) {
				data += "<th>" + keyList[key] + "</th>";
			}
		}

		// ボディ作成
		data += "<tr>";
		for (let key in keyList) {
			data += "<td>" + share[keyList[key]] + "</td>";
		}
		data += "</tr>";
	}
	// console.log(data);
	table.innerHTML = data;
}

// 株価取得
btn1.addEventListener('click', callApi1);
// 株価最新化
btn2.addEventListener('click', callApi2);
