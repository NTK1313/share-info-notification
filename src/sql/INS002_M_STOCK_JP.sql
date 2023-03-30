insert into m_stock_jp(
    br_cd,
    br_name,
    market_segment,
    regis_date,
    update_date,
    delflg
)
values(
    $1,					-- 銘柄コード
    $2,					-- 銘柄名
    $3,                 -- 市場区分
    current_timestamp,	-- 登録日時
    current_timestamp,	-- 更新日時
    'f'                 -- 削除フラグ
)
;