/* eslint-disable no-unused-vars */
import Listbox, {EVENTS} from '../../asce/components/listbox/listbox.js';


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('dynamic-listbox-btn')
    .addEventListener('click', () => {
      const selectId = 'dynamic-listbox';
      const listboxListEl = document.querySelector(`#${selectId} ul`);
      listboxListEl.innerHTML = `
        <li>Iron Man</li>
        <li>Nick Fury</li>
        <li>Hulk</li>
        <li>Black Widow</li>
        <li>Thor</li>
        <li>Captain America</li>
        <li>Scarlet Witch</li>
        <li>Ant-Man</li>
        <li>Spider-man</li>
        <li>Black Panther</li>
        <li>Doctor Strange</li>
        <li>Captain Marvel</li>`;

      window.dispatchEvent(
        new CustomEvent(
          EVENTS.UPDATE_OPTIONS,
          {
            'detail': {
              'id': selectId,
            }
          },
        )
      );
    });
});
