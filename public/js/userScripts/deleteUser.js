document.getElementById('delete-user').addEventListener('click', async (e) => {
  e.preventDefault();

  const userId = window.location.pathname.split('/')[2];

  try {
    const res = await fetch(`/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();
    
   if (data.otherErrors) {
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
      location.assign('/users');
    }
  } catch (err) {
    location.assign('/server-error');
  }
});