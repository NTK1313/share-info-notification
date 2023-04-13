// TODO:同期的に実行できないから調査が必要
exports.execSql = async function () {
	const { Client } = require('../../../node-npm/node_modules/pg');
	const client = new Client({
		user: 'postgres',
		host: '127.0.0.1',
		database: 'sharedb',
		password: 'skskr20081106',
		port: 5432,
	});
	async function execQuery() {
		try {
			client.connect();
			console.log('接続完了');
			// const res = client.query(query1);
			// obj = JSON.parse(JSON.stringify(res.rows));
			// console.log(obj);
			client.query(query1, (err, res) => {
				let obj = JSON.parse(JSON.stringify(res.rows));
				client.end();
				console.log(res.rows);
				console.log(obj);
				return obj;
			})
		} catch (e) {
			console.error(e);
		};
	}
	execQuery();
}