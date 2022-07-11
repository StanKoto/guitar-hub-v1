import { adjustUrl, setupSorting } from '../modules/helpers.js';

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const searchText = form.searchText.value;
  if (searchText.length === 0) return location.reload()

  const url = adjustUrl('textSearch', searchText);

  location.assign(url);
});

setupSorting('title-asc', 'title');
setupSorting('title-desc', '-title');
setupSorting('rating-asc', 'averageRating');
setupSorting('rating-desc', '-averageRating');
setupSorting('updated-asc', 'updatedAt');
setupSorting('updated-desc', '-updatedAt');