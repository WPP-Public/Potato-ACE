import {EVENTS} from '/ace/components/tabs/tabs.js';

document.addEventListener('DOMContentLoaded', () => {
  const TABS_ID = 'ace-tabs-custom';

  const setTabForm = document.getElementById('set-tab-form');

  window.addEventListener('click', (e) => {
    if (e.target.id === 'prev-tab-btn') {
      window.dispatchEvent(new CustomEvent(EVENTS.SET_PREV_TAB, {detail: {id: TABS_ID}}));
    } else if (e.target.id === 'next-tab-btn') {
      window.dispatchEvent(new CustomEvent(EVENTS.SET_NEXT_TAB, {detail: {id: TABS_ID}}));
    }
  });

  setTabForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    window.dispatchEvent(new CustomEvent(EVENTS.SET_TAB, {detail: {
      id: TABS_ID,
      tab: +formData.get('tab-number')
    }}));
  });
});
