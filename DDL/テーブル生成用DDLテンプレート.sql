-- テーブル名変更
ALTER TABLE m_stock rename TO m_stock_jp

-- テーブル生成用DDLテンプレート
-- 株価マスタ（日本）
CREATE TABLE public.m_stock_jp (
    br_cd integer NOT NULL,
    br_name character varying(20),
    market_segment character varying(20),
    regis_date timestamp without time zone,
    update_date timestamp without time zone,
    delflg boolean,
	primary key(br_cd)
);
COMMENT ON COLUMN m_stock_jp.br_cd IS '銘柄コード';
COMMENT ON COLUMN m_stock_jp.br_name IS '銘柄名';
COMMENT ON COLUMN m_stock_jp.market_segment IS '市場区分（プライム/スタンダード/グロース)';
COMMENT ON COLUMN m_stock_jp.regis_date IS '登録日時';
COMMENT ON COLUMN m_stock_jp.update_date IS '更新日時';
COMMENT ON COLUMN m_stock_jp.delflg IS '削除フラグ';

-- 株価マスタ（米国）
CREATE TABLE public.m_stock_en (
    ticker character varying(10) NOT NULL,
    br_name character varying(20),
    market_segment character varying(20),
    regis_date timestamp without time zone,
    update_date timestamp without time zone,
    delflg boolean,
	primary key(ticker)
);
COMMENT ON COLUMN m_stock_en.ticker IS 'ティッカー';
COMMENT ON COLUMN m_stock_en.br_name IS '銘柄名';
COMMENT ON COLUMN m_stock_en.market_segment IS '市場区分（NYSE/NASDAQ）';
COMMENT ON COLUMN m_stock_en.regis_date IS '登録日時';
COMMENT ON COLUMN m_stock_en.update_date IS '更新日時';
COMMENT ON COLUMN m_stock_en.delflg IS '削除フラグ';


