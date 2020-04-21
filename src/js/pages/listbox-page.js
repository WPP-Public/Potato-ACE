/* eslint-disable no-unused-vars */
import Listbox, {EVENTS} from '../../asce/components/listbox/listbox.js';


document.addEventListener('DOMContentLoaded', () => {
  const listboxId = 'dynamic-listbox';
  const listboxListEl = document.querySelector(`#${listboxId} ul`);

  document.getElementById('populate-listbox')
    .addEventListener('click', () => {
      listboxListEl.innerHTML = `
        <li>Iron Man</li>
        <li>Nick Fury</li>
        <li>Hulk</li>
        <li>Thor</li>
        <li>Captain America</li>
        <li>Black Widow</li>`;
    });

  document.getElementById('add-option')
    .addEventListener('click', () => {
      const newOption = document.createElement('li');
      newOption.id = 'new-option';
      newOption.textContent = 'New Option';
      listboxListEl.appendChild(newOption);
    });

  document.getElementById('update-options')
    .addEventListener('click', () => {
      window.dispatchEvent(
        new CustomEvent(
          EVENTS.UPDATE_OPTIONS,
          {
            'detail': {
              'id': listboxId,
            }
          },
        )
      );
    });
});
