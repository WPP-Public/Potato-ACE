import {ATTRS, EVENTS} from '/ace/components/combobox/combobox.js';
import {KEYS} from '../../../common/constants.js';
import {keyPressedMatches} from '../../../common/functions.js';

export const fakeDelay = 3000;

const comboboxId = 'search-combobox';

document.addEventListener('DOMContentLoaded', () => {
  let optionChosen, searching = false;
  const comboboxEl = document.getElementById(comboboxId);
  const comboboxInputEl = comboboxEl.querySelector(`[${ATTRS.INPUT}]`);
  const comboboxStatusEl = comboboxEl.querySelector('[aria-live="polite"]');
  const comboboxListEl = comboboxEl.querySelector(`[${ATTRS.LIST}]`);
  const chosenResultEl = document.getElementById('chosen-search-result');

  // Search when ENTER key pressed
  comboboxInputEl.addEventListener('keydown', async (e) => {
    const keyPressed = e.key || e.which || e.keyCode;
    if (!keyPressedMatches(keyPressed, KEYS.ENTER)) {
      return;
    }

    // If option selected when ENTER pressed prevent search
    if (optionChosen) {
      optionChosen = false;
      return;
    }

    // Fake search
    if (searching) {
      return;
    }
    searching = true;
    // Update status element to inform user there will be a delay
    comboboxStatusEl.textContent = 'Searching...';
    // Simulate an API reponse delay
    const results = await new Promise(resolve => setTimeout(() => {
      const data = [];
      for (let i=1; i < 6; i++) {
        data.push({id: `result-${i}`, text: `Result ${i}`});
      }
      resolve(data);
    }, fakeDelay));

    // Add results to DOM
    comboboxStatusEl.textContent = `${results.length} result${results.length === 1 ? '' : 's' } found`;
    comboboxListEl.innerHTML = '';
    results.forEach((result) => {
      const resultOption = document.createElement('li');
      resultOption.textContent = result.text;
      resultOption.id = result.id;
      comboboxListEl.appendChild(resultOption);
    });
    // Update combobox options
    comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_OPTIONS));
    searching = false;
  });

  // Show list when clicking on input if list has options
  comboboxInputEl.addEventListener('click', () => {
    if (comboboxListEl.childNodes.length === 0) {
      return;
    }
    comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.SHOW_LIST));
  });

  // Show results list when options intialised
  window.addEventListener(EVENTS.OUT.OPTIONS_UPDATED, (e) => {
    const detail = e['detail'];
    if (!detail || !detail['id'] || detail['id'] !== comboboxId) {
      return;
    }
    comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.SHOW_LIST));
  });

  // Listen for chosen options
  window.addEventListener(EVENTS.OUT.OPTION_CHOSEN, (e) => {
    const detail = e['detail'];
    if (!detail || !detail['id'] || detail['id'] !== comboboxId) {
      return;
    }
    optionChosen = true;
    chosenResultEl.textContent = `Option with ID '${detail['chosenOptionId']}' chosen.`;

    // Hide list
    comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.HIDE_LIST));
  });
});
