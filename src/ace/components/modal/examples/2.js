import {ATTRS, EVENTS} from '/ace/components/modal/modal.js';

document.addEventListener('DOMContentLoaded', () => {
  const OTHER_MODAL_ID = 'modal-1';
  const modalEl = document.getElementById('modal-from-modal');
  let otherModalTriggerClicked;

  // If other Modal is shown using trigger in this Modal, show this Modal when other Modal is hidden
  const otherModalTrigger = modalEl.querySelector(`[ace-modal-trigger-for="${OTHER_MODAL_ID}"]`);
  otherModalTrigger.addEventListener('click', () => otherModalTriggerClicked = true);

  window.addEventListener(EVENTS.OUT.CHANGED, (e) => {
    if (!e.detail || e.detail.id !== OTHER_MODAL_ID || e.detail.visible || !otherModalTriggerClicked) {
      return;
    }
    otherModalTriggerClicked = false;
    modalEl.setAttribute(ATTRS.VISIBLE, '');
  });
});
