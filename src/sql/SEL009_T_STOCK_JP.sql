select
	tgt.br_cd as "銘柄コード",
	tgt.br_name as "銘柄名",
	tgt.market_segment as "市場区分",
	tgt.shori as "処理日",
	tgt.regular_market_price as "株価"
from
	(
		select
			a.br_cd,
			b.br_name,
			b.market_segment,
			to_char(a.shori_date, 'YYYY-MM-DD') as shori,
			a.regular_market_price,
			row_number() over(
				partition by a.br_cd,
				to_char(a.shori_date, 'YYYY-MM-DD')
				order by
					a.shori_date desc
			) as chk
		from
			t_stock_jp a
			inner join m_stock_jp b on a.br_cd = b.br_cd
		where
			a.br_cd = $1
			and to_char(a.shori_date, 'YYYY-MM-DD') between $2 and $3
	) tgt
where
	-- 日ごとの最新のデータのみ抽出
	tgt.chk = 1
order by
	tgt.shori;