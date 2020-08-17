import {ATTRS, EVENTS} from '/ace/components/combobox/combobox.js';

document.addEventListener('DOMContentLoaded', () => {
  const comboboxEl = document.getElementById('custom-events-combobox');
  const comboboxListEl = comboboxEl.querySelector(`[${ATTRS.LIST}]`);
  const selectOptionForm = document.getElementById('select-option-form');

  window.addEventListener('click', (e) => {
    switch (e.target.id) {
      case 'add-options-btn':
        for (let i = 0; i < 3; i++) {
          const newOption = document.createElement('li');
          newOption.textContent = 'New Option';
          comboboxListEl.appendChild(newOption);
        }
        comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_OPTIONS));
        break;
      case 'show-list-btn':
        comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.SHOW_LIST));
        break;
      case 'hide-list-btn':
        comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.HIDE_LIST));
        break;
    }
  });

  selectOptionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const optionNumber = +new FormData(e.target).get('option-number');
    const option = comboboxEl.querySelectorAll('li')[optionNumber - 1];
    if (!option) {
      return;
    }
    comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.SELECT_OPTION, {
      detail: {
        optionId: option.id,
      }
    }));
  });
});
