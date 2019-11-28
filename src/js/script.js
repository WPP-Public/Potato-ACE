/* eslint-disable no-unused-vars */
import { Listbox, CONSTS as LISTBOX_CONSTS } from '../asce/components/listbox/listbox.js';

document.addEventListener('DOMContentLoaded', () => {
  // Testing listbox dynamic
  document.getElementById('dynamic-listbox-btn')
    .addEventListener('click', () => {
      const selectId = 'dynamic-listbox';
      const listbox = document.getElementById(selectId);
      const list = listbox.querySelector('ul');
      list.innerHTML = `
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

      listbox.dispatchEvent(
        new CustomEvent(
          `${LISTBOX_CONSTS.UPDATE_OPTIONS_EVENT}`,
          { detail: { id: selectId } },
        )
      );
    });

});

// window.onload = () => {
//   console.log('page loaded');
// }
