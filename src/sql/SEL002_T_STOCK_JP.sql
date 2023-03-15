select
	count(1)
from
	t_stock_jp a
where
	a.br_cd = $1
and	a.shori_date = $2;