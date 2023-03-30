select
	count(1)
from
	m_stock_jp a
where
	a.br_cd = $1
;