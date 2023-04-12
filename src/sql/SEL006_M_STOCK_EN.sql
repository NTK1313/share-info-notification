select
	count(1)
from
	m_stock_en a
where
	a.ticker = $1
;