const INS_DB_DATA = "http://localhost:3000/api/v1/crudDB/insertDBData";
const sql = "INS002_M_STOCK_JP.sql";

async function regisInfo() {
	const brCd = document.querySelector('#brCd').value;
	const brNm = document.querySelector('#brNm').value;
	const segment = document.querySelector('#segment').value;;
	// 入力値チェック

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
	let regisInfo = [{ "brCd": brCd, "brNm": brNm, "segment": segment, "sqlNm": sql }];
	console.log(JSON.stringify(regisInfo));

	// API呼び出し、DB登録
	// DB登録（非同期）
	const res = await fetch(INS_DB_DATA, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(regisInfo)
	});
	const result = await res.json();
	if(result.status == 200){
		alert('DB登録完了しました。');
	}
}

btn.addEventListener('click', regisInfo);

