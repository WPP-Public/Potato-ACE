import {ATTRS, EVENTS} from '/ace/components/combobox/combobox.js';

document.addEventListener('DOMContentLoaded', () => {
  const comboboxId = 'ace-combobox-custom-events';
  const optionNumberEl = document.getElementById('select-option-number-input');
  const comboboxListEl = document.querySelector(`#${comboboxId} [${ATTRS.LIST}]`);

  window.addEventListener('click', (e) => {
    switch (e.target.id) {
      case 'add-options-btn':
        comboboxListEl.innerHTML = `
          <li>New Option 1</li>
          <li>New Option 2</li>
          <li>New Option 3</li>`;
        window.dispatchEvent(new CustomEvent(
          EVENTS.UPDATE_OPTIONS,
          {'detail': {'id': comboboxId}},
        ));
        break;
      case 'show-list-btn':
        window.dispatchEvent(new CustomEvent(
          EVENTS.SHOW_LIST,
          {'detail': {'id': comboboxId}},
        ));
        break;
      case 'hide-list-btn':
        window.dispatchEvent(new CustomEvent(
          EVENTS.HIDE_LIST,
          {'detail': {'id': comboboxId}},
        ));
        break;
      case 'select-option-btn': {
        const optionNumber = parseInt(optionNumberEl.value);
        const option = document.querySelectorAll(`#${comboboxId} li`)[optionNumber-1];
        if (!option) {
          return;
        }
        window.dispatchEvent(new CustomEvent(
          EVENTS.SELECT_OPTION,
          {'detail': {'id': comboboxId, 'optionId': option.id}},
        ));
        break;
      }
    }
  });
});
