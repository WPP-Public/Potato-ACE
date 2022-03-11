import { ATTRS } from '/ace/components/toast/toast.js';

document.addEventListener('DOMContentLoaded', () => {
	const toastEl = document.getElementById('ace-toast-1');
	const secondToastEl = document.getElementById('ace-toast-2');
	const showToastBtn = document.getElementById('simple-toast-btn');
	const showSecondToastBtn = document.getElementById('short-show-time-toast-btn');

	showToastBtn.addEventListener('click', () => toastEl.setAttribute(ATTRS.VISIBLE, ''));
	showSecondToastBtn.addEventListener('click', () => secondToastEl.setAttribute(ATTRS.VISIBLE, ''));
});
