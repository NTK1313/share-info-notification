callApi();
async function callApi() {
	const res = await fetch("http://127.0.0.1:3000/api/v1/article1/getDBData");
	const result = await res.json();
	// DBから返却された結果を画面表示する。
	const str = JSON.stringify(result);
	const res2 = await fetch("http://127.0.0.1:3000/api/v1/article1/getPrice", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: str
	});
	const result2 = await res2.json();
	console.log('POST');
	console.log(result2);

	/** JSONイメージ
	[
		{
			"br_cd": 3092,
			"br_name": "ZOZO",
			"market_segment": "プライム"
		},
		{
			"br_cd": 4220,
			"br_name": "リケンテクノス",
			"market_segment": "プライム"
		}
	]
*/
	//  表作成
	var table = document.getElementById("table");
	// JSONのparse
	const obj = JSON.parse(str);
	var data = '';
	for (let i = 0; i < obj.length; i++) {
		const share = obj[i];
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
};
