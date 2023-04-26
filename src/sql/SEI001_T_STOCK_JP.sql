insert into t_stock_jp(
    br_cd,
    shori_date,
    regis_date,
    regular_market_price,
    regular_market_change
)
select
	tgt.br_cd,
	tgt.shori_date,
	current_timestamp,
	tgt.regular_market_price,
	'0'
from
	(
		select
			cast(a.br_cd as integer) as br_cd,
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
			t_stock_jp b
		where
			1 = 1
			and b.br_cd = tgt.br_cd
			and to_char(b.shori_date, 'YYYY-MM-DD') = tgt.shori_ymd
	)