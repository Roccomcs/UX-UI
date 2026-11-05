// Search only filters the local collection; app screens remain static.
const search = document.querySelector('#buscar');
const cards = [...document.querySelectorAll('.screen-card')];
const groups = [...document.querySelectorAll('.gallery-section')];
const noResults = document.querySelector('#no-results');
const status = document.querySelector('#search-status');
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

if (search) search.addEventListener('input', () => {
  const query = normalize(search.value.trim());
  let count = 0;
  for (const card of cards) {
    const matches = normalize(card.dataset.search).includes(query);
    card.hidden = !matches;
    if (matches) count++;
  }
  for (const group of groups) group.hidden = !group.querySelector('.screen-card:not([hidden])');
  if (status) status.textContent = query ? `${count} ${count === 1 ? 'pantalla encontrada.' : 'pantallas encontradas.'}` : '';
  if (noResults) noResults.hidden = count !== 0 || !query;
});
