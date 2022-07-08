import { makeRequest } from '../modules/helpers.js';

document.getElementById('delete-user').addEventListener('click', async (e) => {
  e.preventDefault();

  const url = location.pathname;
  const method = 'DELETE';
  const redirectUrl = '/users';

  await makeRequest(url, method, redirectUrl);
});