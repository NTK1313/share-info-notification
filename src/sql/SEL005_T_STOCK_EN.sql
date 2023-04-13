select
	a.ticker	||	'：'	||	b.br_name	as	chk
from
	t_stock_en a
	inner join m_stock_en b on a.ticker = b.ticker
where
	a.ticker = any($1 :: varchar [])
and	a.shori_date = any($2 :: timestamp without time zone [])
order by
	a.ticker
;