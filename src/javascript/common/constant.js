//共通利用する定数定義一覧
const CLICK = 'click';

// API設定用
const METHOD_GET = 'GET';
const METHOD_POST = 'POST';
const METHOD_PUT = 'PUT';
const METHOD_DELETE = 'DELETE';
// const CONTENT_TYPE = 'Content-Type';
const APPLICATION_JSON = 'application/json';

// エンドポイント一覧
const GET_DB_DATA = 'http://127.0.0.1:3000/api/v1/crudDB/getDBData';
const CHK_DB_DATA = 'http://localhost:3000/api/v1/crudDB/checkDBData';
const INS_DB_DATA = 'http://localhost:3000/api/v1/crudDB/insertDBData';
const GET_SHARE_INFO_JP = 'http://127.0.0.1:3000/api/v1/execAPI/shareInfo/JP';
const GET_SHARE_INFO_EN = 'http://127.0.0.1:3000/api/v1/execAPI/shareInfo/EN';

// メッセージ一覧
const NETWORK_ERR ='通信に失敗しました';
const ALREADY_REGISTER_ALL = '以下の銘柄の最新情報がDB登録されているため一括登録処理は実施できません。';
const ALREADY_REGISTER = '最新情報がDB登録されているため登録処理をスキップします。';
const REGISTER_COMPLETE = 'DB登録完了しました。';
const LATEST_COMPLETE = '一括最新化処理が完了しました。';