import { Listbox as A11yListbox, CONSTS as A11Y_LISTBOX_CONSTS } from './components/listbox/listbox';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[a11y-listbox]').forEach(A11yListbox.attachTo);

  // For testing only
  document.getElementById('dynamic-listbox-btn')
    .addEventListener('click', () => {
      const selectId = 'dynamic-listbox';
      const listbox = document.getElementById(selectId);
      listbox.innerHTML = `
        <li>Iron Man</li>
        <li>Hulk</li>
        <li>Captain America</li>
        <li>Scarlet Witch</li>
        <li>Black Panther</li>
        <li>Black Widow</li>
        <li>Ant-Man</li>
        <li>Thor</li>
        <li>Captain Marvel</li>
        <li>Dr Strange</li>
        <li>Spider-man</li>
        <li>War Machine</li>`;

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
