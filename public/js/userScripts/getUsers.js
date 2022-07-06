import { adjustUrl, setupSorting } from '../modules/helpers.js';

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const searchText = form.searchText.value;
  if (searchText.length === 0) return location.reload()

  const url = adjustUrl('textSearch', searchText);
  location.assign(url);
});

setupSorting('username-asc', 'username');
setupSorting('username-desc', '-username');
setupSorting('postcount-asc', 'postCount');
setupSorting('postcount-desc', '-postCount');
setupSorting('status-asc', 'status');
setupSorting('status-desc', '-status');
setupSorting('role-asc', 'role');
setupSorting('role-desc', '-role');
setupSorting('created-asc', 'createdAt');
setupSorting('created-desc', '-createdAt');
