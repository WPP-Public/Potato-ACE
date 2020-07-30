import {EVENTS} from '/ace/components/disclosure/disclosure.js';

document.addEventListener('DOMContentLoaded', () => {
  const disclosureEl = document.getElementById('custom-event-triggered-disclosure');
  window.addEventListener('click', (e) => {
    const customEventHideBtnClicked = e.target.closest('#custom-event-hide-btn');
    const customEventShowBtnClicked = e.target.closest('#custom-event-show-btn');
    const customEventToggleBtnClicked = e.target.closest('#custom-event-toggle-btn');

    if (!customEventToggleBtnClicked && !customEventShowBtnClicked && !customEventHideBtnClicked) {
      return;
    }

    let eventType = EVENTS.IN.TOGGLE;
    if (customEventShowBtnClicked) {
      eventType = EVENTS.IN.SHOW;
    }
    if (customEventHideBtnClicked) {
      eventType = EVENTS.IN.HIDE;
    }

    disclosureEl.dispatchEvent(new CustomEvent(eventType));
  });
});
