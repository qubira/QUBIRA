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

/* ============================================================
   VERIFICACIÓN PREVIA DE UBICACIÓN DESDE ACCESO CENTRAL
   ============================================================ */
const urlParams = new URLSearchParams(window.location.search);
const isVerified = urlParams.get('verified') === '1';
const prefillUser = urlParams.get('user');

const verifiedBanner = document.getElementById('verifiedBanner');
const centralNotice  = document.getElementById('centralNotice');
const goToCentralBtn = document.getElementById('goToCentralBtn');

if (isVerified) {
  if (verifiedBanner) verifiedBanner.style.display = 'flex';
  if (centralNotice)  centralNotice.style.display  = 'none';
  if (prefillUser && userInput) {
    userInput.value = prefillUser;
    if (passInput) setTimeout(() => passInput.focus(), 150);
  }
} else {
  if (verifiedBanner) verifiedBanner.style.display = 'none';
  if (centralNotice) {
    centralNotice.style.display = 'flex';
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const centralLoginBase = isLocal
      ? 'http://localhost:5500/login.html'
      : 'https://qubira-login.vercel.app/login.html';
    if (goToCentralBtn) {
      goToCentralBtn.href = `${centralLoginBase}?redirect=${encodeURIComponent(window.location.href)}`;
    }
  }
}

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

    /* Si se requiere 2FA (TOTP) */
    if (data.totp_required) {
      pendingPreToken = data.pre_token;
      showMessage('', null);
      setLoading(false);
      showTotpPanel();
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

/* ============================================================
   SEGUNDO PASO: VERIFICACIÓN 2FA (TOTP)
   ============================================================ */
let pendingPreToken = null;
const totpPanel     = document.getElementById('totp-panel');
const totpCodeInput = document.getElementById('totpCode');
const totpSubmitBtn = document.getElementById('totpSubmitBtn');
const totpCancelBtn = document.getElementById('totpCancelBtn');
const totpMessage   = document.getElementById('totpMessage');

function showTotpPanel() {
  form.style.display = 'none';
  if (verifiedBanner) verifiedBanner.style.display = 'none';
  if (centralNotice)  centralNotice.style.display  = 'none';
  totpPanel.style.display = 'block';
  totpCodeInput.value = '';
  totpMessage.textContent = '';
  totpMessage.className = 'message';
  setTimeout(() => totpCodeInput.focus(), 100);
}

function showTotpMessage(text, success) {
  totpMessage.textContent = text;
  totpMessage.className   = 'message' + (success === true ? ' success' : success === false ? ' error' : '');
}

function setTotpLoading(loading) {
  totpSubmitBtn.disabled    = loading;
  totpCodeInput.disabled    = loading;
  totpSubmitBtn.textContent = loading ? 'Verificando...' : 'Verificar Código';
}

totpCancelBtn.addEventListener('click', () => {
  pendingPreToken = null;
  totpPanel.style.display = 'none';
  form.style.display = 'block';
  if (isVerified && verifiedBanner) verifiedBanner.style.display = 'flex';
  showMessage('', null);
  setLoading(false);
});

totpCodeInput.addEventListener('input', () => {
  totpCodeInput.value = totpCodeInput.value.replace(/\D/g, '').slice(0, 6);
});

totpCodeInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitTotp();
});

totpSubmitBtn.addEventListener('click', submitTotp);

async function submitTotp() {
  const code = totpCodeInput.value.trim();
  if (!pendingPreToken) {
    showTotpMessage('La sesión expiró. Vuelve a ingresar tu contraseña.', false);
    return;
  }
  if (code.length !== 6) {
    showTotpMessage('Ingresa los 6 dígitos del código 2FA.', false);
    return;
  }

  setTotpLoading(true);
  showTotpMessage('Verificando código 2FA...', null);

  try {
    const res = await fetch(`${API_BASE}/api/auth/login/totp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pre_token: pendingPreToken, code }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      showTotpMessage(data.error || 'Código 2FA incorrecto.', false);
      setTotpLoading(false);
      totpCodeInput.value = '';
      totpCodeInput.focus();
      return;
    }

    localStorage.setItem('qubira_token', data.token);
    localStorage.setItem('qubira_user', JSON.stringify(data.user));

    showTotpMessage('¡Código verificado! Redirigiendo a Control...', true);
    setTimeout(() => {
      window.location.href = '/control';
    }, 500);

  } catch (err) {
    console.error('[2FA] Error de red:', err);
    showTotpMessage('Error de conexión al verificar 2FA.', false);
    setTotpLoading(false);
  }
}
