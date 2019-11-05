import { Listbox as A11yListbox, CONSTS as A11Y_LISTBOX_CONSTS } from './components/listbox/listbox';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[a11y-listbox]').forEach(A11yListbox.attachTo);

  document.getElementById('dummy-button').addEventListener('click', clickHandler);
});

// window.onload = () => {
//   console.log('page loaded');
// }




// Just for testing
const clickHandler = () => {
  const listbox = document.getElementById('select1');

  listbox.innerHTML = "";

  listbox.innerHTML = `
    <li>Starlord</li>
    <li>Rocket</li>
    <li>Drax</li>
    <li>Gamora</li>
    <li>Nebula</li>
    <li>Groot</li>
  `

  listbox.dispatchEvent(
    new CustomEvent(
      `${A11Y_LISTBOX_CONSTS.UPDATE_OPTIONS_EVENT}`,
      { detail: { id: 'select1' } },
    )
  );
}