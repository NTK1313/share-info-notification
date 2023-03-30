-- テーブル名変更
ALTER TABLE m_stock rename TO m_stock_jp

-- カラム名変更
alter table t_stock_jp rename  stock_price to regular_market_price

-- カラム追加
ALTER TABLE t_stock_jp ADD COLUMN regular_market_change character varying(10)


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

-- 株価トラン（日本）
CREATE TABLE public.t_stock_jp (
    br_cd integer NOT NULL,
    shori_date timestamp without time zone NOT NULL,
    regis_date timestamp without time zone NOT NULL,
    regular_market_price character varying(10),
    regular_market_change character varying(10),
	primary key(br_cd,shori_date)
);
COMMENT ON COLUMN t_stock_jp.br_cd IS '銘柄コード';
COMMENT ON COLUMN t_stock_jp.shori_date IS '処理日時（株価）';
COMMENT ON COLUMN t_stock_jp.regis_date IS '登録日時';
COMMENT ON COLUMN t_stock_jp.regular_market_price IS '株価（円）';
COMMENT ON COLUMN t_stock_jp.regular_market_change IS '前日からの変動値';

-- 株価トラン（米国）
CREATE TABLE public.t_stock_en (
    ticker character varying(10) NOT NULL,
    shori_date timestamp without time zone NOT NULL,
    regis_date timestamp without time zone NOT NULL,
    regular_market_price character varying(10),
    regular_market_change character varying(10),
	primary key(ticker,shori_date)
);
COMMENT ON COLUMN t_stock_en.ticker IS 'ティッカー';
COMMENT ON COLUMN t_stock_en.shori_date IS '処理日時（株価）';
COMMENT ON COLUMN t_stock_en.regis_date IS '登録日時';
COMMENT ON COLUMN t_stock_en.regular_market_price IS '株価（ドル）';
COMMENT ON COLUMN t_stock_en.regular_market_change IS '前日からの変動値';