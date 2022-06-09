const form = document.querySelector('form');
const usernameError = document.querySelector('.username.error');
const emailError = document.querySelector('.email.error');
const passwordError = document.querySelector('.password.error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  usernameError.textContent = '';
  emailError.textContent = '';
  passwordError.textContent = '';

  const username = form.username.value;
  const email = form.email.value;
  const password = form.password.value;
  try {
    const res = await fetch('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (data.errors) {
      usernameError.textContent = data.errors.username;
      emailError.textContent = data.errors.email;
      passwordError.textContent = data.errors.password;
    } else {
      location.assign('/')
    }
  } catch (err) {
    location.assign('/server-error');
  }
});