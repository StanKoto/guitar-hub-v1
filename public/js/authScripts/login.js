const form = document.querySelector('form');
const emailError = document.querySelector('.email.error');
const passwordError = document.querySelector('.password.error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  emailError.textContent = '';
  passwordError.textContent = '';

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
      emailError.textContent = data.errors.email;
      passwordError.textContent = data.errors.password;
    } else {
      location.assign('/');
    }
  } catch (err) {
    console.error(err);
    location.assign('/server-error');
  }
});