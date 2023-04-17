update
	m_stock_en
set
	br_name = $2,
	market_segment = $3,
	delflg = case
		when $4 = 'ON' then cast('t' as boolean)
		else cast('f' as boolean)
	end,
	update_date =  current_timestamp
where
	ticker = $1;