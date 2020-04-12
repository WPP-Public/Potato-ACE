/* eslint-disable no-unused-vars */
import Disclosure, {EVENTS} from '../../asce/components/disclosure/disclosure.js';


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('dynamic-disclosure-btn')
    .addEventListener('click', () => {
      const disclosureId = 'custom-event-triggered-disclosure';

      window.dispatchEvent(
        new CustomEvent(
          EVENTS.TOGGLE,
          {
            'detail': {
              'id': disclosureId,
            }
          },
        )
      );
    });
});
