import { Listbox as A11yListbox, CONSTS as A11Y_LISTBOX_CONSTS } from './components/listbox/listbox';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[a11y-listbox]').forEach(A11yListbox.attachTo);

  // For testing only
  document.getElementById('dummy-button')
    .addEventListener('click', () => {
      const selectId = 'select1';
      const listbox = document.getElementById(selectId);
      listbox.innerHTML = `
        <li>Starlord</li>
        <li>Rocket</li>
        <li>Drax</li>
        <li>Gamora</li>
        <li>Nebula</li>
        <li>Groot</li>`

      listbox.dispatchEvent(
        new CustomEvent(
          `${A11Y_LISTBOX_CONSTS.UPDATE_OPTIONS_EVENT}`,
          { detail: { id: selectId } },
        )
      );
    });
});

// window.onload = () => {
//   console.log('page loaded');
// }
