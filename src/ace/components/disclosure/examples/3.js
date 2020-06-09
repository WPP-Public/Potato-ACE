import {EVENTS} from '../../ace/components/disclosure/disclosure.js';

document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('click', (e) => {
    const customEventHideBtnClicked = e.target.closest('#custom-event-hide-btn');
    const customEventShowBtnClicked = e.target.closest('#custom-event-show-btn');
    const customEventToggleBtnClicked = e.target.closest('#custom-event-toggle-btn');

    if (!customEventToggleBtnClicked && !customEventShowBtnClicked && !customEventHideBtnClicked) {
      return;
    }

    let eventType = EVENTS.TOGGLE;

    if (customEventShowBtnClicked) {
      eventType = EVENTS.SHOW;
    }

    if (customEventHideBtnClicked) {
      eventType = EVENTS.HIDE;
    }

    window.dispatchEvent(new CustomEvent(
      eventType,
      {
        'detail': {
          'id': 'custom-event-triggered-disclosure',
        }
      },
    ));
  });
});
