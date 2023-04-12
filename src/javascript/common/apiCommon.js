/**
 * API付加情報の設定
 * @param {*} info 
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