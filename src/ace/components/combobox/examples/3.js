import {ATTRS, EVENTS} from '/ace/components/combobox/combobox.js';

document.addEventListener('DOMContentLoaded', () => {
  const comboboxEl = document.getElementById('ace-combobox-custom-events');
  const comboboxListEl = comboboxEl.querySelector(`[${ATTRS.LIST}]`);
  const optionNumberEl = document.getElementById('select-option-number-input');

  window.addEventListener('click', (e) => {
    switch (e.target.id) {
      case 'add-options-btn':
        comboboxListEl.innerHTML = `
          <li>New Option 1</li>
          <li>New Option 2</li>
          <li>New Option 3</li>`;
        comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_OPTIONS));
        break;

      case 'show-list-btn':
        comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.SHOW_LIST));
        break;

      case 'hide-list-btn':
        comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.HIDE_LIST));
        break;

      case 'select-option-btn': {
        const optionNumber = parseInt(optionNumberEl.value);
        const option = comboboxEl.querySelectorAll('li')[optionNumber-1];
        if (!option) {
          return;
        }
        comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.SELECT_OPTION, {
          'detail': {
            'optionId': option.id
          }
        }));
        break;
      }
    }
  });
});
