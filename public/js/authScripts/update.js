const detailsForm = document.getElementById('details-form');
const passwordForm = document.getElementById('password-form');

const usernameError = document.querySelector('.username.error');
const emailError = document.querySelector('.email.error');
const matchPasswordError = document.querySelector('.match.password.error');
const validatePasswordError = document.querySelector('.validate.password.error');

detailsForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  usernameError.textContent = '';
  emailError.textContent = '';

  const body = {}
  const username = detailsForm.username.value;
  if (username.length !== 0) body.username = username
  const email = detailsForm.email.value;
  if (email.length !== 0) body.email = email

  try {
    const res = await fetch('/auth/update-details', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (data.errors) {
      usernameError.textContent = data.errors.username;
      emailError.textContent = data.errors.email;
    } else if (data.otherErrors) {
      switch (res.status) {
        case 401:
          location.assign(`/unauthorized?message=${data.message}`);
          break;
        case 404:
          location.assign(`/bad-request?message=${data.message}`);
          break;
        default:
          location.assign('/server-error');
      }
    } else {
      location.assign('/auth/update');
    }
  } catch (err) {
    location.assign('/server-error');
  }
});

passwordForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  matchPasswordError.textContent = '';
  validatePasswordError.textContent = '';

  const currentPassword = passwordForm.currentPassword.value;
  const newPassword = passwordForm.newPassword.value;

  try {
    const res = await fetch('/auth/update-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await res.json();

    if (data.errors) {
      matchPasswordError.textContent = data.errors.credentials;
      validatePasswordError.textContent = data.errors.password;
    } else if (data.otherErrors) {
      switch (res.status) {
        case 401:
          location.assign(`/unauthorized?message=${data.message}`);
          break;
        case 404:
          location.assign(`/bad-request?message=${data.message}`);
          break;
        default:
          location.assign('/server-error');
      }
    } else {
      location.assign('/auth/update');
    }
  } catch (err) {
    location.assign('/server-error');
  }
});