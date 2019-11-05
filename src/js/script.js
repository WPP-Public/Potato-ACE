import { Disclosure as A11yDisclosure, CONSTS as A11Y_DISCLOSURE_CONSTS } from './components/disclosure/disclosure';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll(`[${A11Y_DISCLOSURE_CONSTS.ELEM}]`).forEach(A11yDisclosure.attachTo);

  document.getElementById('dummy-button')
    .addEventListener('click', (e) => {
      const disclosureId = 'disclosure2';
      document.getElementById(disclosureId)
        .dispatchEvent(new CustomEvent(
          A11Y_DISCLOSURE_CONSTS.TOGGLE_EVENT,
          { detail: { id: disclosureId, trigger: e.target} }
        )
      )
    });
});

// window.onload = () => {
//   console.log('page loaded');
// }
