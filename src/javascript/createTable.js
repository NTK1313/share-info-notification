// 画面に表示する表作成
function createTable(result) {
	const ta = new DesignTableCreate(result);
	ta.animate();
}

// 画面に表示する表作成
function createInputTextTable(result) {
	new InputTextTableCreate(result);
}

/**
 * データ表作成＆カラーリング
 */
class TableCreate {
	constructor(result) {
		this.DOM = {};
		this.DOM.table = document.querySelector('#tablebody');
		// ヘッダ作成
		this.result = result;
		const share = result[0];
		const keyList = Object.keys(share);
		let data = keyList.reduce((acc, curr) => {
			return `${acc}<th>${curr}</th>`;
		}, '');
		data += '<th>更新</th>';
		this.DOM.table.innerHTML = data;
	}
}

class DesignTableCreate extends TableCreate {
	constructor(result) {
		super(result);
		// ボディ作成
		this.DOM.table.innerHTML += this._makeBody();
		this.DOM.tr = document.querySelectorAll('tr');
	}
	_makeBody() {
		return this.result.reduce((acc, curr) => {
			let valueList = Object.values(curr);
			// 銘柄コードをIDとして付与
			let code = valueList[0];
			// 1カラムずつ編集
			let edit = valueList.reduce((acc1, curr1) => {
				return `${acc1}<td>${curr1}</td>`;
			}, '');
			// 更新ボタン付与(ボタン押下時にイベント設定)
			edit += `<td><button id="${code}"  onclick="update(this)">更新</button></td>`;
			// 1レコードずつ編集
			return `${acc}<tr>${edit}</tr>`;
		}, '');
	}
	animate() {
		this.DOM.tr.forEach((c, i) => {
			c.style.color = '#082029d7';
			// 1行ごとに色を変更する
			if (i == 0 || i % 2 == 0) {
				c.style.backgroundColor = '#86d2f0d7';
			} else {
				c.style.backgroundColor = '#ebf5f8d7';
			}
		});
	}
}

class InputTextTableCreate extends TableCreate {
	constructor(result) {
		super(result);
		// ボディ作成
		this.DOM.table.innerHTML += this._makeBody();
		this.DOM.tr = document.querySelectorAll('tr');
	}
	_makeBody() {
		return this.result.reduce((acc, curr) => {
			const valueList = Object.values(curr);
			const enjp = valueList[0];

			// 銘柄コードをIDとして付与
			const code = valueList[1];

			// 前2つの要素（JP/EN、銘柄コード）は個別設定するためvalueListから削除する。
			valueList.shift();
			valueList.shift();

			// 1カラムずつ編集
			let edit = valueList.reduce((acc1, curr1) => {
				return `${acc1}<td><input id="${curr1}" value="${curr1}"></td>`;
			}, '');
			// 削除した要素を個別設定
			edit = `<td id="${enjp}">${enjp}</td><td id="${code}">${code}</td>` + edit;
			// 更新ボタン付与(ボタン押下時にイベント設定)
			edit += `<td><button onclick="update('${code}')">更新</button></td>`;
			// 1レコードずつ編集
			// class名の先頭が数字（日本株の銘柄コード）だとエラーとなってしまうので回避するためにプレフィックスにclsを付与
			return `${acc}<tr class="cls${code}">${edit}</tr>`;
		}, '');
	}
	animate() {
		this.DOM.tr.forEach((c, i) => {
			c.style.color = '#082029d7';
			// 1行ごとに色を変更する
			if (i == 0 || i % 2 == 0) {
				c.style.backgroundColor = '#86d2f0d7';
			} else {
				c.style.backgroundColor = '#ebf5f8d7';
			}
		});
	}
}