import Select, {EVENTS} from '../../ace/components/select/select.js';

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  const selectId = 'dynamic-select';
  const selectListEl = document.querySelector(`#${selectId} ul`);

  const updateOptions = () => {
    window.dispatchEvent(new CustomEvent(
      EVENTS.UPDATE_OPTIONS,
      {
        'detail': {
          'id': selectId,
        }
      },
    ));
  };

  document.getElementById('add-option')
    .addEventListener('click', () => {
      selectListEl.innerHTML += '<li>New Option</li>';
      updateOptions();
    });

  document.getElementById('remove-option')
    .addEventListener('click', () => {
      const fistOptionEl = selectListEl.querySelector('li');
      if (!fistOptionEl) {
        return;
      }
      selectListEl.removeChild(fistOptionEl);
      updateOptions();
    });
});
