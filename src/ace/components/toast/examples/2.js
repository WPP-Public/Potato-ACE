import { ATTRS } from '/ace/components/toast/toast.js';

document.addEventListener('DOMContentLoaded', () => {
	const firstToastId = 'ace-toast-3';
	const secondToastId = 'ace-toast-4';
	const thirdToastId = 'ace-toast-5';
	const firstToastEl = document.getElementById(firstToastId);
	const secondToastEl = document.getElementById(secondToastId);
	const thirdToastEl = document.getElementById(thirdToastId);

	const positionToast = (toastEl) => {
		const TOAST_GAP = 10;
		let offsetTopOfHighestToast;
		const visibleToasts = document.querySelectorAll(`[${ATTRS.VISIBLE}]`);

		visibleToasts.forEach((visibleToast, index) => {
			const visibleToastOffsetTop = visibleToast.offsetTop;

			if (index === 0) {
				offsetTopOfHighestToast = visibleToastOffsetTop;
				return;
			}

			if (visibleToastOffsetTop < offsetTopOfHighestToast) {
				offsetTopOfHighestToast = visibleToastOffsetTop;
			}
		});
		toastEl.style.bottom = visibleToasts.length ? `${window.innerHeight - offsetTopOfHighestToast + TOAST_GAP}px` : '';
	};

	window.addEventListener('click', (e) => {
		const targetId = e.target.id;
		let toastEl;
		toastEl = targetId === 'show-1st-toast-btn' ? firstToastEl : toastEl;
		toastEl = targetId === 'show-2nd-toast-btn' ? secondToastEl : toastEl;
		toastEl = targetId === 'show-3rd-toast-btn' ? thirdToastEl : toastEl;

		if (!toastEl) {
			return;
		}

		positionToast(toastEl);
		toastEl.setAttribute(ATTRS.VISIBLE, '');
	});
});
