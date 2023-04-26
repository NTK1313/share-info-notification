/**
 * API付加情報の設定
 * @param {*} info APIリクエスト情報
 * @returns
 */
function setApiDetail(info) {
	return detail = {
		method: info[0],
		headers: {
			'Content-Type': info[1]
		},
		body: JSON.stringify(info[2])
	};
}

/**
 * 日付情報の設定
 * @param {*} param 日付の加算、減算を行う際に設定
 * @returns
 */
function editDate(param) {
	let editYear;
	let editMonth;
	let editDate;
	if (typeof param !== 'undefined') {
		if (param['year']) {
			editYear = param['year'];
		}
		if (param['month']) {
			editMonth = param['month'];
		}
		if (param['date']) {
			editDate = param['date'];
		}
	}

	let hiduke = new Date();
	let day = hiduke.getDate();
	if (editDate) {
		hiduke.setDate(hiduke.getDate() + (editDate));
		day = hiduke.getDate();
	}

	let month = ('00' + (hiduke.getMonth() + 1)).slice(-2);
	if (editMonth) {
		hiduke.setMonth(hiduke.getMonth() + (editMonth));
		month = ('00' + (hiduke.getMonth() + 1)).slice(-2);;
	}

	let year = hiduke.getFullYear();
	if (editYear) {
		hiduke.setFullYear(hiduke.getFullYear() + (editYear));
		year = hiduke.getFullYear();
	}
	return `${year}-${month}-${day}`;
}

/**
 * 日付比較
 * @param {*} cpr1 比較対象日付
 * @param {*} cpr2 判定日付
 * @param {*} kbn 過去(P)or未来(F)
 * @returns 
 */
function compareDate(cpr1, cpr2, kbn) {
	let chk = false;
	if (kbn == 'P') {
		chk = cpr1.getTime() < cpr2.getTime();
	} else if (kbn == 'F') {
		chk = cpr1.getTime() > cpr2.getTime();
	}
	return chk;
}

/**
 * 必須項目チェック
 * @param {*} target チェック対象
 * @param {*} message エラー時に出力するメッセージ
 */
function requireChk(target, message) {
	let chkErr = false;
	if (target == '') {
		chkErr = true;
		alert(message);
	}
	return chkErr;
}