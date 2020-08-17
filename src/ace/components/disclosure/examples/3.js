import {EVENTS} from '/ace/components/disclosure/disclosure.js';

document.addEventListener('DOMContentLoaded', () => {
  const DISCLOSURE_ID = 'user-animated-disclosure';
  const disclosureEl = document.getElementById(DISCLOSURE_ID);

  window.addEventListener(EVENTS.OUT.START_ANIMATING, async (e) => {
    if (e.detail.id === DISCLOSURE_ID) {
      // TODO: remove this fake delay after it has been reviewed
      await new Promise(resolve => setTimeout(resolve, 2000));
      disclosureEl.dispatchEvent(new CustomEvent(EVENTS.IN.DONE_ANIMATING, {'detail': {'show': e.detail.show}}));
    }
  });
});
