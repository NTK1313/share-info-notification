insert into t_stock_en(
    ticker,
    shori_date,
    regis_date,
    regular_market_price,
    regular_market_change
)
select
	tgt.ticker,
	tgt.shori_date,
	current_timestamp,
	tgt.regular_market_price,
	'0'
from
	(
		select
			a.br_cd as ticker,
			a.shori_date,
			a.regular_market_price,
			to_char(a.shori_date, 'YYYY-MM-DD') as shori_ymd
		from
			wk_stock a
	) tgt
where
	1 = 1
	and not exists(
		select
			1
		from
			t_stock_en b
		where
			1 = 1
			and b.ticker = tgt.ticker
			and to_char(b.shori_date, 'YYYY-MM-DD') = tgt.shori_ymd
	)