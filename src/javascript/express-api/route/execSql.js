exports.sqlReader = function (sqlFile) {
	var file = "C:/Users/nnsks/github_local/share_info_notification/src/sql/" + sqlFile;
	var fs = require("fs");
	const data = fs.readFileSync(file, "utf-8");
	console.log(data);
	// DB接続、SQL実行
	// var f = require("./connectDb.js");
	// var result =  await f.execSql(data);
	return data;
	// return result;
}