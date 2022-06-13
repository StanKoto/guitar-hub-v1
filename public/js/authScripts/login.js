const form = document.querySelector('form');
const emailError = document.querySelector('.email.error');
const credentialsError = document.querySelector('.credentials.error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  credentialsError.textContent = '';

  const email = form.email.value;
  const password = form.password.value;
  try {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.errors) {
      credentialsError.textContent = data.errors.credentials;
    } else {
      location.assign('/');
    }
  } catch (err) {
    location.assign('/server-error');
  }
});