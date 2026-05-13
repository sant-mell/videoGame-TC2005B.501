(function () {
  // buscar el form de registro
  const form = document.getElementById('register-form');

  if (!form) return;

  form.addEventListener('submit', async (event) => {
    // no recargar la pagina
    event.preventDefault();

    // sacamos los datos del form
    const formData = new FormData(form);
    const name = (formData.get('name') || '').toString().trim();
    const username = (formData.get('username') || '').toString().trim();
    const password = (formData.get('password') || '').toString().trim();
    const age = (formData.get('age') || '').toString().trim();
    const gender = (formData.get('gender') || '').toString().trim();
// si no tiene los campos llenos, entonces avisa que ponga contrasena
    if (!username || !password) {
      alert('Username and password are required');
      return;
    }

    try {
      // guardamos la cuenta nueva en la base de datos
      const response = await fetch(
        `/api/create-account?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&name=${encodeURIComponent(name)}&age=${encodeURIComponent(age)}&gender=${encodeURIComponent(gender)}`
      );
      const data = await response.json();

      if (!data.success) {
        // si falla, avisamos
        alert(data.message || 'Could not create account');
        return;
      }

      // si sale bien, mandamos al menu
      localStorage.setItem('username', data.username);
      window.location.href = `/menu?username=${encodeURIComponent(data.username)}`;
    } catch (error) {
      console.error(error);
      alert('Could not connect to the server');
    }
  });
})();