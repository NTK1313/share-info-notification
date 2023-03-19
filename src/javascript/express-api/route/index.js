// ライブラリ読み込み
const express = require('../../../node-npm/node_modules/express');
const router = express.Router();

// ルーティング設定
router.use('/crudDB', require('./crudDB.js'));
router.use('/execAPI', require('./execAPI.js'));
module.exports = router;
