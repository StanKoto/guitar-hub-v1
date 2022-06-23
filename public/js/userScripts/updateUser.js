const detailsForm = document.getElementById('details-form');
const passwordForm = document.getElementById('password-form');

const usernameError = document.querySelector('.username.error');
const emailError = document.querySelector('.email.error');
const matchPasswordError = document.querySelector('.match.password.error');
const validatePasswordError = document.querySelector('.validate.password.error');

const userId = window.location.pathname.split('/')[2];

detailsForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  usernameError.textContent = '';
  emailError.textContent = '';

  const body = {};

  const username = detailsForm.username.value;
  if (username.length !== 0) body.username = username
  const email = detailsForm.email.value;
  if (email.length !== 0) body.email = email
  body.role = detailsForm.role.value;

  try {
    const res = await fetch(`/users/${ userId }/update-details`, {
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
      if (data.selfUpdate && data.user.role === 'user') return location.assign('/auth/update-details')
      location.assign(`/users/${data.user._id}/${data.user.slug}`);
    }
  } catch (err) {
    location.assign('/server-error');
  }
});

passwordForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  matchPasswordError.textContent = '';
  validatePasswordError.textContent = '';

  const adminPassword = passwordForm.adminPassword.value;
  const newPassword = passwordForm.newPassword.value;

  try {
    const res = await fetch(`/users/${userId}/update-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminPassword, newPassword })
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
      location.assign(`/users/${data.user._id}/${data.user.slug}`);
    }
  } catch (err) {
    location.assign('/server-error');
  }
});