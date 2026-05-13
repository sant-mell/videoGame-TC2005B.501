// mainmenu.js - aqui se hace el login y manda a la pagina de registro
(function(){
  // agarramos los inputs del formulario
  const usernameInput = document.querySelector('input[name="username"]');
  const passwordInput = document.querySelector('input[name="password"]');
  // agarramos los dos botones de arriba
  const buttons = document.querySelectorAll('.buttons button');
  if (!buttons || buttons.length < 2) return;

  const loginBtn = buttons[0];
  const createBtn = buttons[1];

  loginBtn.addEventListener('click', async () => {
    // leer lo que escribio el user
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if (!username || !password) { alert('Enter username and password'); return; }

    try {
      // mandamos la info al server para ver si entra
      const res = await fetch(`/api/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
      const data = await res.json();
      if (data.success) {
        // guardamos el usuario pa despues
        localStorage.setItem('username', data.username);
        window.location.href = `/menu?username=${encodeURIComponent(data.username)}`;
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (e) {
      console.error(e);
      alert('Network error');
    }
  });

  createBtn.addEventListener('click', () => {
    // si le da create, se va a la otra pagina
    window.location.href = 'createaccount.html';
  });

})();
