select
	'EN' as "EN/JP",
	a.ticker as "銘柄コード",
	a.br_name as "銘柄名",
	a.market_segment as "市場区分",
	case
		when a.delflg = 'f' then 'OFF'
		else 'ON'
	end as "削除フラグ"
from
	m_stock_en a
where
	a.ticker = $1;