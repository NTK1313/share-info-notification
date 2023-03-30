select
	tgt.ticker as "銘柄コード",
	tgt.br_name as "企業名",
	tgt.market_segment as "市場区分",
	to_char(tgt.shori_date, 'YYYY-MM-DD HH24:MM:SS') as "処理時間（株価）",
	'$' || tgt.regular_market_price as "株価（ドル）",
	tgt.regular_market_change as "前日からの変動値"
from
	(
		select
			a.ticker,
			a.br_name,
			a.market_segment,
			b.shori_date,
			b.regular_market_price,
			b.regular_market_change,
			row_number() over(
				partition by a.ticker
				order by
					b.shori_date desc
			) as num
		from
			m_stock_en a
			left join t_stock_en b on a.ticker = b.ticker
	) tgt
where
	-- 最新のデータ状況だけ取得
	tgt.num = 1
order by
	tgt.ticker;