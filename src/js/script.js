import { Listbox as A11yListbox, CONSTS as A11Y_LISTBOX_CONSTS } from './components/listbox/listbox';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll(`[${A11Y_LISTBOX_CONSTS.ELEM}]`).forEach(A11yListbox.attachTo);
});

// window.onload = () => {
//   console.log('page loaded');
// }
