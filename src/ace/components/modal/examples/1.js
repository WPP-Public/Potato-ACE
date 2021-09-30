import {EVENTS} from '/ace/components/modal/modal.js';

document.addEventListener('DOMContentLoaded', () => {
	const MODAL_ID = 'simple-modal';
  const modalEl = document.getElementById(MODAL_ID);
  const disabledBtn = document.getElementById('disabled-btn');

  modalEl.addEventListener('click', (e) => {
    const targetId = e.target.id;
    const toggleDisabledBtnBtnClicked = targetId === 'toggle-disabled-btn-btn';
    if (toggleDisabledBtnBtnClicked) {
      disabledBtn.disabled = !disabledBtn.disabled;
      return;
    }

    const addLinkBtnClicked = targetId === 'add-link-btn';
    if (addLinkBtnClicked) {
      const linkEl = document.createElement('a');
      linkEl.href = '#';
      linkEl.textContent = 'Dummy link';
      const pEl = document.createElement('p');
      pEl.appendChild(linkEl);
      modalEl.appendChild(pEl);
    }

    const removeLinkBtnClicked = targetId === 'remove-link-btn';
    if (removeLinkBtnClicked) {
      const linkEl = modalEl.querySelector('a');
      if (linkEl) {
        linkEl.remove();
      }
    }
    window.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_FOCUS_TRAP, {
			'detail': {
				'id': MODAL_ID,
			}
		}));
  });
});
