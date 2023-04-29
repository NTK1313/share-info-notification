select
	'【' || a.ticker || '】' || a.br_name as br
from
	m_stock_en a
where
	a.delflg = 'f'
order by
	a.ticker;