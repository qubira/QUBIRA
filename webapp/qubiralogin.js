'use strict';

/* ============================================================
   QUBIRA — Login
   Llama a la API Node.js y guarda el JWT en localStorage
   ============================================================ */

/* API base — en producción cambia por tu dominio */
const API_BASE = window.location.origin;

/* Si hay un token guardado, se verifica con el servidor antes de redirigir.
   Un token viejo/inválido (sesión expirada o revocada) ya no debe mandar
   directo a /control: eso provoca un loop de redirects con requireWebAuth,
   que a su vez manda de vuelta a /login. Si no es válido, se limpia. */
(function checkExistingSession() {
  const existingToken = localStorage.getItem('qubira_token');
  if (!existingToken) return;

  fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: 'Bearer ' + existingToken },
  })
    .then((res) => {
      if (res.ok) {
        window.location.href = '/control';
      } else {
        localStorage.removeItem('qubira_token');
        localStorage.removeItem('qubira_user');
      }
    })
    .catch(() => { /* sin conexión — deja el formulario disponible */ });
})();

const form     = document.getElementById('loginForm');
const userInput = document.getElementById('user');
const passInput = document.getElementById('password');
const toggle   = document.getElementById('togglePassword');
const message  = document.getElementById('message');
const submitBtn = form.querySelector('.submit');

toggle.addEventListener('click', () => {
  const hidden = passInput.type === 'password';
  passInput.type   = hidden ? 'text' : 'password';
  toggle.textContent = hidden ? 'OCULTAR' : 'VER';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = userInput.value.trim();
  const password = passInput.value.trim();

  if (!username || !password) {
    showMessage('Completa usuario y contraseña.', false);
    return;
  }

  setLoading(true);
  showMessage('Verificando credenciales...', null);

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      showMessage(data.error || 'Credenciales incorrectas.', false);
      setLoading(false);
      return;
    }

    /* Guardar token y datos del usuario */
    localStorage.setItem('qubira_token', data.token);
    localStorage.setItem('qubira_user',  JSON.stringify(data.user));

    showMessage('¡Acceso concedido! Redirigiendo...', true);

    setTimeout(() => {
      window.location.href = '/control';
    }, 600);

  } catch (err) {
    console.error('[LOGIN] Error de red:', err);
    showMessage('No se pudo conectar al servidor. ¿Está corriendo el backend?', false);
    setLoading(false);
  }
});

function showMessage(text, success) {
  message.textContent = text;
  message.className   = 'message' + (success === true ? ' success' : success === false ? ' error' : '');
}

function setLoading(loading) {
  submitBtn.disabled   = loading;
  submitBtn.textContent = loading ? 'Verificando...' : 'Ingresar';
}
