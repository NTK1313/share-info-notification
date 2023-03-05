exports.execSql = function(query) {
	const { Client } = require("pg");
	const client = new Client({
		user: "postgres",
		host: "127.0.0.1",
		database: "sharedb",
		password: "skskr20081106",
		port: 5432,
	});
	client.connect();
	client.query(query, (err,res) => {
		client.end();
		return res.rows[0];
	});
}