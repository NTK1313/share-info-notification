insert into m_stock_en(
    ticker,
    br_name,
    market_segment,
    regis_date,
    update_date,
    delflg
)
values(
    $1,					-- ティッカー
    $2,					-- 銘柄名
    $3,                 -- 市場区分
    current_timestamp,	-- 登録日時
    current_timestamp,	-- 更新日時
    'f'                 -- 削除フラグ
)
;