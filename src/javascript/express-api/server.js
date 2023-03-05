// ライブラリ読み込み
const express = require('../../node-npm/node_modules/express');
const bodyParser = require('../../node-npm/node_modules/body-parser');
const cors = require('../../node-npm/node_modules/cors');

var app = express();
var router = express.Router();

const hostname = '127.0.0.1';
const port = 3000;

//body-parserの設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORSの設定を入れてリクエストからのアクセス許可
// https://qiita.com/chenglin/items/5e563e50d1c32dadf4c3
app.use(cors());

// ルーティング設定
var router = require('./route/');   // route/index.jsをrouterとして読み込み
app.use('/api/v1/', router);        // http://localhost:3000/api/v1/

//サーバ起動
app.listen(port);
console.log(`Server running at http://${hostname}:${port}/`);
