select
	a.br_cd as "銘柄コード",
	a.br_name as "企業名",
	a.market_segment as "市場区分",
	b.regular_market_price as "株価",
	b.regular_market_change as "前日からの変動値"
from
	m_stock_jp a
	left join t_stock_jp b on a.br_cd = b.br_cd