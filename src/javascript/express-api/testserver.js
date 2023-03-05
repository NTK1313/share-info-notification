// ライブラリ読み込み
const express = require('../../node-npm/node_modules/express');
const bodyParser = require('../../node-npm/node_modules/body-parser');
const cors = require('../../node-npm/node_modules/cors');

var app = express();
var router = express.Router();

const hostname = '127.0.0.1';
const port = 3000;

// CORSの設定を入れてリクエストからのアクセス許可
// https://qiita.com/rahydyn/items/e9ed2480e0e649313c04
// https://sentry.io/answers/why-does-my-javascript-code-receive-a-no-access-control-allow-origin-header-error-while-postman-does-not/
const corsOptions = {
  origin: `http://${hostname}:${port}`,
};
//body-parserの設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// GET http://localhost:3000/api/v2/
app.get('/api/v2/',function(req,res){
//	console.log(req);
//	const origin = req.headers.origin;
//	res.setHeader('Access-Control-Allow-Origin', origin);
    res.json({
        message:"Hello,world"
    });
});

//サーバ起動
app.listen(port);
console.log('listen on port ' + port);

/**
//body-parserの設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

// ルーティング設定
var router = require('./route/'); // route/index.jsをrouterとして読み込み
app.use('/api/v1/', router);       // http://localhost:3000/api/v1/

//サーバ起動
app.listen(port);
console.log(`Server running at http://${hostname}:${port}/`);
 */