select
	count(1)
from
	t_stock_en a
where
	a.ticker = $1
and	a.shori_date = $2;