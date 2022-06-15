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
  const role = form.role.value;

  try {
    const res = await fetch('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role })
    });

    const data = await res.json();

    if (data.errors) {
      usernameError.textContent = data.errors.username;
      emailError.textContent = data.errors.email;
      passwordError.textContent = data.errors.password;
    } else {
      location.assign(`/users/${data.user._id}/${data.user.slug}`);
    }
  } catch (err) {
    location.assign('/server-error');
  }
})