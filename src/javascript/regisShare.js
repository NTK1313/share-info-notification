const INS_DB_DATA = 'http://localhost:3000/api/v1/crudDB/insertDBData';
const CHK_DB_DATA = 'http://localhost:3000/api/v1/crudDB/checkDBData';

async function regisInfo() {
	const brCd = document.querySelector('#brCd').value;
	const brNm = document.querySelector('#brNm').value;
	const segment = document.querySelector('#segment').value;
	const regexp = new RegExp('[0-9]{4}');

	// 入力値チェック
	if (brCd == '') {
		alert('銘柄コードは必須項目です');
		return;
	} else if (brNm == '') {
		alert('企業名は必須項目です');
		return;
	} else if (segment == '') {
		alert('市場区分は必須項目です');
		return;
	}
	// 桁数チェック
	if (!regexp.test(brCd)) {
		alert('銘柄コードは4桁の数値で入力してください');
		return;
	}

	// DB重複チェック
	let check = [{ "brCd": brCd, "sqlNm": "SEL003_M_STOCK_JP.sql" }];
	const res1 = await fetch(CHK_DB_DATA, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(check)
	}).catch(error => {
		console.error('通信に失敗しました', error);
		alert('通信に失敗しました');
		return;
	});
	const result1 = await res1.json();

	// 既に最新データが登録されている場合は後続処理スキップ
	if (result1[0]['count'] > 0) {
		alert('既に同一銘柄コードが登録されているため登録できません。');
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
	let regisInfo = [{ "brCd": brCd, "brNm": brNm, "segment": segment, "sqlNm": "INS002_M_STOCK_JP.sql" }];
	console.log(JSON.stringify(regisInfo));

	// API呼び出し、DB登録
	// DB登録（非同期）
	const res = await fetch(INS_DB_DATA, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(regisInfo)
	}).catch(error => {
		console.error('通信に失敗しました', error);
		alert('通信に失敗しました');
		return;
	});
}
// 要素を取得
btn.addEventListener('click', regisInfo);

