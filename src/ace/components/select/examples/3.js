import {EVENTS} from '/ace/components/select/select.js';

document.addEventListener('DOMContentLoaded', () => {
  const selectEl = document.getElementById('custom-events-select');
  const selectListEl = selectEl.querySelector('ul');

  const updateOptions = () => selectEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_OPTIONS));

  document.getElementById('add-option').addEventListener('click', () => {
    const optionEl = document.createElement('li');
    optionEl.textContent = 'New Option';
    selectListEl.appendChild(optionEl);
    updateOptions();
  });

  document.getElementById('remove-option').addEventListener('click', () => {
    const lastOptionEl = selectListEl.querySelector('li:last-child');
    if (!lastOptionEl) {
      return;
    }
    selectListEl.removeChild(lastOptionEl);
    updateOptions();
  });
});
