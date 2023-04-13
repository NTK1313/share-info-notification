/**
 * HTMLのclass追加・変更・削除するClass
 */
class EditHtmlClass {
	constructor(el) {
		this.DOM = {};
		this.el = el;
		this.DOM.el = document.querySelector(el);
	}
	add(el) {
		this.DOM.el.classList.add(el);
	}
	remove(el) {
		this.DOM.el.classList.remove(el);
	}
	toggle(el) {
		this.DOM.el.classList.toggle(el);
	}
	contain(el) {
		this.DOM.el.classList.contain(el);
	}
}