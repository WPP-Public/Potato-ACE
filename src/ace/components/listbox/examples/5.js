import Listbox, {EVENTS} from '../../../ace/components/listbox/listbox.js';

document.addEventListener('DOMContentLoaded', () => {
  const listboxId = 'dynamic-listbox';
  const listboxListEl = document.querySelector(`#${listboxId} ul`);

  const updateOptions = () => {
    window.dispatchEvent(new CustomEvent(
      EVENTS.UPDATE_OPTIONS,
      {
        'detail': {
          'id': listboxId,
        }
      },
    ));
  };

  document.getElementById('add-option')
    .addEventListener('click', () => {
      listboxListEl.innerHTML += '<li>Iron Man</li>';
      updateOptions();
    });

  document.getElementById('remove-option')
    .addEventListener('click', () => {
      const fistOptionEl = listboxListEl.querySelector('li');
      if (!fistOptionEl) {
        return;
      }
      listboxListEl.removeChild(fistOptionEl);
      updateOptions();
    });
});
