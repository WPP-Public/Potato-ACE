/* eslint-disable no-unused-vars */
import Disclosure, {EVENTS} from '../../asce/components/disclosure/disclosure.js';


document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('click', (e) => {
    const customEventToggleBtnClicked = e.target.closest('#custom-event-toggle-btn');
    const customEventShowBtnClicked = e.target.closest('#custom-event-show-btn');
    const customEventHideBtnClicked = e.target.closest('#custom-event-hide-btn');
    let showDisclosure = null;

    if (!customEventToggleBtnClicked && !customEventShowBtnClicked && !customEventHideBtnClicked) {
      return;
    }

    if (customEventShowBtnClicked) {
      showDisclosure = true;
    }

    if (customEventHideBtnClicked) {
      showDisclosure = false;
    }

    window.dispatchEvent(
      new CustomEvent(
        EVENTS.TOGGLE,
        {
          'detail': {
            'id': 'custom-event-triggered-disclosure',
            'showDisclosure': showDisclosure,
          }
        },
      )
    );
  });

});
