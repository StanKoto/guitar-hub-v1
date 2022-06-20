document.getElementById('delete-post').addEventListener('click', async (e) => {
  e.preventDefault();

  const postId = window.location.pathname.split('/')[2];

  try {
    const res = await fetch(`/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();

    if (data.success) location.assign('/posts')
  } catch (err) {
    location.assign('/server-error');
  }
});