import {EVENTS} from '/ace/components/listbox/listbox.js';

document.addEventListener('DOMContentLoaded', () => {
  const listboxEl = document.getElementById('dynamic-listbox');
  const listboxListEl = listboxEl.querySelector('ul');

  const updateOptions = () => listboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_OPTIONS));

  document.getElementById('add-option')
    .addEventListener('click', () => {
      listboxListEl.innerHTML += '<li>New Option</li>';
      updateOptions();
    });

  document.getElementById('remove-option')
    .addEventListener('click', () => {
      const fistOptionEl = listboxListEl.querySelector('li');
      if (!fistOptionEl) {
        return;
      }
      listboxListEl.removeChild(fistOptionEl);
      updateOptions();
    });
});
