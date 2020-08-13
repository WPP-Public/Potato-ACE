import {ATTRS, EVENTS} from '/ace/components/tabs/tabs.js';

document.addEventListener('DOMContentLoaded', () => {
  const tabsEl = document.getElementById('dynamic-tabs');
  const tablistEl = tabsEl.querySelector(`[${ATTRS.TABLIST}]`);

  const addTab = () => {
    const tabNumber = tablistEl.children.length + 1;
    tablistEl.insertAdjacentHTML('beforeend', `
      <button>Tab ${tabNumber}</button>
    `);

    tabsEl.insertAdjacentHTML('beforeend', `
      <div>
        <h3>Panel ${tabNumber}</h3>
        <p>Created dynamically</p>
      </div>
    `);
  };

  const removeTab = () => {
    tablistEl.removeChild(tablistEl.lastElementChild);
    tabsEl.removeChild(tabsEl.lastElementChild);
  };

  window.addEventListener('click', (e) => {
    const id = e.target.id;
    if (id === 'add-tab-btn') {
      addTab();
    } else if (id === 'remove-tab-btn') {
      removeTab();
    }

    tabsEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_TABS));
  });
});
