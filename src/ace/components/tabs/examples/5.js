import {ATTRS, EVENTS} from '/ace/components/tabs/tabs.js';

document.addEventListener('DOMContentLoaded', () => {
  const TABS_ID = 'ace-tabs-update';
  const TABS_EL = document.getElementById(TABS_ID);
  const TABSLIST_EL = TABS_EL.querySelector(`[${ATTRS.TABLIST}]`);

  const addTab = () => {
    const tabNumber = TABSLIST_EL.children.length + 1;

    TABSLIST_EL.insertAdjacentHTML('beforeend', `
      <button>Tab ${tabNumber}</button>
    `);

    TABS_EL.insertAdjacentHTML('beforeend', `
      <div>
        <h3>Panel ${tabNumber}</h3>
        <p>Created dynamically</p>
      </div>
    `);
  };

  const removeTab = () => {
    TABSLIST_EL.removeChild(TABSLIST_EL.lastElementChild);
    TABS_EL.removeChild(TABS_EL.lastElementChild);
  };

  window.addEventListener('click', (e) => {
    const id = e.target.id;
    if (id === 'add-tab-btn') {
      addTab();
    } else if (id === 'remove-tab-btn') {
      removeTab();
    }

    window.dispatchEvent(new CustomEvent(EVENTS.UPDATE_TABS, {detail: {
      id: TABS_ID,
    }}));
  });
});
