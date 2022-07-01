import { emptyErrors, makeRequest } from '../modules/helpers.js';

const detailsForm = document.getElementById('details-form');
const passwordForm = document.getElementById('password-form');

const usernameError = { element: document.querySelector('.username.error'), errorType: 'username' };
const emailError = { element: document.querySelector('.email.error'), errorType: 'email' };
const matchPasswordError = { element: document.querySelector('.match.password.error'), errorType: 'credentials' };
const validatePasswordError = { element: document.querySelector('.validate.password.error'), errorType: 'password' };

const customDetailsErrors = [ usernameError, emailError ];
const customPasswordErrors = [ matchPasswordError, validatePasswordError ];

const userId = window.location.pathname.split('/')[2];

const redirectUrl = 'user';

detailsForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  emptyErrors(customDetailsErrors);
  
  const username = detailsForm.username.value;
  const email = detailsForm.email.value;
  
  const url = `/users/${userId}/update-details`;
  const method = 'PUT';
  let body = {};
  if (username.length !== 0) body.username = username
  if (email.length !== 0) body.email = email
  body.role = detailsForm.role.value;
  body = JSON.stringify(body);
  await makeRequest(url, method, redirectUrl, body, customDetailsErrors);
});

passwordForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  emptyErrors(customPasswordErrors);

  const adminPassword = passwordForm.adminPassword.value;
  const newPassword = passwordForm.newPassword.value;

  const url = `/users/${userId}/update-password`;
  const method = 'PUT';
  const body = JSON.stringify({ adminPassword, newPassword });

  await makeRequest(url, method, redirectUrl, body, customPasswordErrors);
});