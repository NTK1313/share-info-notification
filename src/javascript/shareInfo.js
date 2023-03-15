const { create } = require("domain");

// 株価取得
callApi1();
// 株価最新化
callApi2();

async function callApi1() {
	const res = await fetch("http://127.0.0.1:3000/api/v1/crudDB/getDBData");
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
	const res = await fetch("http://127.0.0.1:3000/api/v1/crudDB/getDBData");
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
	// DBから返却された結果を画面表示する。
	const res2 = await fetch("http://127.0.0.1:3000/api/v1/execAPI/shareInfo", {
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
		var code = result[i]['銘柄コード'];
		for (let j = 0; j < result2.length; j++) {
			if (code == result2[j]['銘柄コード']){
				result[i]['処理時間（株価）'] = result2[j]['処理時間（株価）']; 
				result[i]['株価'] = result2[j]['株価'];
				result[i]['前日からの変動値'] = result2[j]['前日からの変動値'];
			}
		}
	}
	createTable(result);
	// DB登録
	fetch("http://localhost:3000/api/v1/crudDB/insertDBData", {
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
	var table = document.getElementById("table");
	var data = '';
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