import {EVENTS} from '/ace/components/select/select.js';

document.addEventListener('DOMContentLoaded', () => {
  const selectEl = document.getElementById('custom-events-select');
  const selectListEl = selectEl.querySelector('ul');

  const updateOptions = () => selectEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_OPTIONS));

  document.getElementById('add-option')
    .addEventListener('click', () => {
      selectListEl.innerHTML += '<li>New Option</li>';
      updateOptions();
    });

  document.getElementById('remove-option')
    .addEventListener('click', () => {
      const fistOptionEl = selectListEl.querySelector('li');
      if (!fistOptionEl) {
        return;
      }
      selectListEl.removeChild(fistOptionEl);
      updateOptions();
    });
});
