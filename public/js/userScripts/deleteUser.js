document.getElementById('delete-user').addEventListener('click', async (e) => {
  e.preventDefault();

  const userId = window.location.pathname.split('/')[2];

  try {
    const res = await fetch(`/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();
    
    if (data.user) location.assign('/users')
  } catch (err) {
    location.assign('/server-error');
  }
});