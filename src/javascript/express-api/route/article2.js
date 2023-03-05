// http://localhost:3000/api/v1/article2/test
const express = require('../../../node-npm/node_modules/express');
var router = express.Router();

router.get('/test', function (req, res) {
	res.json({
		message: "This is article2 api"
	});
});

//routerをモジュールとして扱う準備
module.exports = router;