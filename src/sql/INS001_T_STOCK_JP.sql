insert into t_stock_jp(
    br_cd,
    shori_date,
    regis_date,
    regular_market_price,
    regular_market_change
)
values(
    $1,					-- 銘柄コード
    $2,					-- 処理日時（株価）
    current_timestamp,	-- 登録日時
    $3,					-- 株価
    $4					-- 前日からの変動値
)
;