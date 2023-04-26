/**
 * DB検索
 */
async function getShareInfo() {
	const enjp = document.querySelector('#enjp').value;
	const brCd = document.querySelector('#brCd').value;
	const regexp = new RegExp('[0-9]{4}');

	// 入力値チェック
	if (requireChk(brCd, REQUIRE_BR_CD)) {
		return;
	}
	if (requireChk(enjp, REQUIRE_SHARE_KBN)) {
		return;
	}
	if (!regexp.test(brCd) && enjp == JP) {
		alert(KETA_CHK_BR_CD);
		return;
	}
	const hc = new EditHtmlClass('.loader');
	hc.add('latest');

	// 実行SQLの選択
	let selSql = enjp == JP ? 'SEL007_M_STOCK_JP':'SEL008_M_STOCK_EN';
	const check = [{ 'brCd': brCd }];

	const execChkDb = await fetch(CHK_DB_DATA + '?' + SQL_NM + '=' + selSql, setApiDetail([METHOD_POST, APPLICATION_JSON, check])).catch(error => {
		console.error(NETWORK_ERR, error);
		hc.remove('latest');
		alert(NETWORK_ERR);
		return;
	});
	/** JSONイメージ
		[
			{
				"銘柄コード": 9432,
				"企業名": "NTT",
				"市場区分": "プライム",
				"削除フラグ": false
			}
		]
	*/
	const resultChkDb = await execChkDb.json();
	hc.remove('latest');
	if (resultChkDb.length == 0) {
		alert(SHARE_IS_NOT_REGISTOR);
	} else {
		const hc2 = new EditHtmlClass('.sharetable');
		hc2.remove('before');
		hc2.add('latest');
		createInputTextTable(resultChkDb,true);
	}
};

/**
 * 【更新ボタン押下時のイベント】
 * 特定銘柄のみ更新
 * @param {銘柄情報} value 
 * @returns 
 */
async function update(value) {
	// 配列初期値
	let elements = [];
	let element = {};
	let enjp;
	let errFlg = false;

	// 親要素（tr）の取得
	const a = '.cls' + value;
	const palent = document.querySelector(a);
	// 子要素（td）の取得
	let child = palent.children;
	Array.from(child).forEach(function (el, index) {
		// 孫要素（input,button）の取得
		let gc = el.children;
		// 株式区分チェック
		if (index == 0) {
			enjp = el.id;
		}
		if (index == 1) {
			element[el.id] = el.id;
		}
		Array.from(gc).forEach(function (ggc) {
			const value = ggc.value;
			// エラーチェック（親階層のindexごとに異なるエラーチェックとする）
			// indexと項目の関係(index:0と1は固定値のためチェック対象外)
			// index:0,ENJP index:1,銘柄コード index:2,銘柄名 index:3,市場区分 index:4,削除フラグ index:5,更新ボタン
			if (index == 2) {
				// 銘柄名チェック
				if (value.length == 0) {
					alert(REQUIRE_BR_NM);
					errFlg = true;
				}
			} else if (index == 3) {
				// 市場区分チェック
				if (enjp == JP) {
					if (!(value == PRIME || value == STANDARD || value == GROWTH)) {
						alert(SEGMENT_ERR_JP);
						errFlg = true;
					}
				}
				if (enjp == EN) {
					if (!(value == NYSE || value == NASDAQ)) {
						alert(SEGMENT_ERR_EN);
						errFlg = true;
					}
				}
			} else if (index == 4) {
				// 削除フラグチェック
				if (!(value == 'ON' || value == 'OFF')) {
					alert(DELFLG_ERR);
					errFlg = true;
				}
			}
			if (ggc.tagName !== 'BUTTON') {
				element[ggc.value] = ggc.value;
			}
		})
	})
	if (errFlg) {
		return;
	}
	elements.push(element);
	// 実行SQL
	const updSql = enjp == 'JP' ? 'UPD001_M_STOCK_JP' : 'UPD002_M_STOCK_EN';
	await fetch(UPD_DB_DATA + '?' + SQL_NM + '=' + updSql, setApiDetail([METHOD_POST, APPLICATION_JSON, elements])).catch(() => {
		// TODO:サーバ側でも処理が成功するのになぜかcatchに入ってしまうので調査必要。
		alert(UPDATE_COMPLETE);
	});

}

// 要素を取得
select.addEventListener(CLICK, getShareInfo);
