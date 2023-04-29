select
	'【' || a.br_cd || '】' || a.br_name as br
from
	m_stock_jp a
where
	a.delflg = 'f'
order by
	a.br_cd;