exports.sqlReader = function (sqlFile) {
	const file = 'C:/Users/nnsks/github_local/share_info_notification/src/sql/' + sqlFile;
	const fs = require('fs');
	const data = fs.readFileSync(file, 'utf-8');
	console.log(data);
	// DB接続、SQL実行
	// var f = require("./connectDb.js");
	// var result =  await f.execSql(data);
	return data;
	// return result;
}