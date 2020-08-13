import {EVENTS} from '/ace/components/tabs/tabs.js';

document.addEventListener('DOMContentLoaded', () => {
  const tabsEl = document.getElementById('custom-events-tabs');
  const setTabForm = document.getElementById('set-tab-form');

  window.addEventListener('click', (e) => {
    if (e.target.id === 'prev-tab-btn') {
      tabsEl.dispatchEvent(new CustomEvent(EVENTS.IN.SET_PREV_TAB));
    } else if (e.target.id === 'next-tab-btn') {
      tabsEl.dispatchEvent(new CustomEvent(EVENTS.IN.SET_NEXT_TAB));
    }
  });

  setTabForm.addEventListener('submit', (e) => {
    e.preventDefault();
    tabsEl.dispatchEvent(new CustomEvent(EVENTS.IN.SET_TAB, {
      detail: {
        tab: +new FormData(e.target).get('tab-number')
      }
    }));
  });
});
