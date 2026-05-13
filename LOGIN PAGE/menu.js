// menu.js - muestra el usuario y hace logout
(function(){
  // elemento donde sale el nombre
  const display = document.getElementById('username-display');
  // boton de salir
  const logoutBtn = document.getElementById('logout');

  function getQueryParam(name) {
    // leer datos de la url
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  // agarrar usuario de la url o del navegador
  let username = getQueryParam('username') || localStorage.getItem('username');
  if (!username) {
    // si no hay user, regresamos al inicio
    window.location.href = '/';
  }

  async function fetchUser(u) {
    try {
      // pedimos la info del usuario al server
      const res = await fetch(`/api/user?username=${encodeURIComponent(u)}`);
      const data = await res.json();
      if (data.success && data.user) {
        display.textContent = data.user.name ? `${data.user.name} (${data.user.username})` : data.user.username;
      } else {
        display.textContent = u;
      }
    } catch (e) {
      console.error(e);
      display.textContent = u;
    }
  }

  fetchUser(username);

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      // borramos el user guardado
      localStorage.removeItem('username');
      window.location.href = '/';
    });
  }

  // los otros botones no hacen nada en esta demo
  const buttons = document.querySelectorAll('.buttons button');
  buttons.forEach((btn) => {
    if (btn.id === 'logout') return;
    btn.disabled = true;
    btn.style.opacity = '0.8';
    btn.style.cursor = 'default';
  });

})();
