import { makeRequest } from '../modules/helpers.js';

document.getElementById('delete-user').addEventListener('click', async (e) => {
  e.preventDefault();

  const userId = window.location.pathname.split('/')[2];

  const url = `/users/${userId}`;
  const method = 'DELETE';
  const redirectUrl = '/users';

  await makeRequest(url, method, redirectUrl);
});