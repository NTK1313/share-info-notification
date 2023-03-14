// ライブラリ読み込み
const express = require('../../../node-npm/node_modules/express');
var router = express.Router();

// ルーティング設定
router.use('/article1', require('./article1.js'));
router.use('/article2', require('./article2.js'));
module.exports = router;
