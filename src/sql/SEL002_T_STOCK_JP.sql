select
	a.br_cd	||	'：'	||	b.br_name	as	chk
from
	t_stock_jp a
	inner join m_stock_jp b on a.br_cd = b.br_cd
where
	a.br_cd = any($1 :: int [])
	and a.shori_date = any($2 :: timestamp without time zone [])
order by
	a.br_cd
;