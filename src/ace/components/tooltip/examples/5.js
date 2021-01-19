import {EVENTS} from '/ace/components/tooltip/tooltip.js';

document.addEventListener('DOMContentLoaded', () => {
  const tooltipEl = document.getElementById('custom-events-tooltip');

  window.addEventListener('click', (e) => {
    const targetId = e.target.id;
    if (targetId === 'show-tooltip-btn' || targetId === 'hide-tooltip-btn') {
      tooltipEl.dispatchEvent(new CustomEvent(EVENTS.IN[`${targetId === 'show-tooltip-btn'? 'SHOW' : 'HIDE'}`]));
    }
  });
});
