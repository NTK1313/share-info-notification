insert into wk_stock(
    br_cd,
    shori_date,
    regular_market_price
)
values(
    $1,					-- 銘柄コード
    $2,					-- 処理日時
    $3					-- 株価
)
;