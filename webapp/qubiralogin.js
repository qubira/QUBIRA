'use strict';

/* ============================================================
   QUBIRA — Login Ejecutivo
   Llama a la API Node.js y maneja autenticación 2FA (TOTP)
   ============================================================ */

/* API base con fallback inteligente para entornos locales o de archivo */
const API_BASE = (window.location.protocol === 'file:' || (window.location.hostname === 'localhost' && window.location.port !== '3000'))
  ? 'https://qubira.vercel.app'
  : window.location.origin;

/* ============================================================
   VERIFICACIÓN DE SESIÓN EXISTENTE
   ============================================================ */
(function checkExistingSession() {
  const existingToken = localStorage.getItem('qubira_token');
  if (!existingToken) return;

  fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: 'Bearer ' + existingToken },
    credentials: 'include',
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

/* ============================================================
   ELEMENTOS DEL DOM
   ============================================================ */
const form      = document.getElementById('loginForm');
const userInput = document.getElementById('user');
const passInput = document.getElementById('password');
const toggle    = document.getElementById('togglePassword');
const message   = document.getElementById('message');
const submitBtn = form ? form.querySelector('.submit') : null;

/* Asegurar que el formulario principal siempre esté visible inicialmente */
if (form) form.style.display = 'block';

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

/* ============================================================
   TOGGLE CONTRASEÑA
   ============================================================ */
if (toggle && passInput) {
  toggle.addEventListener('click', () => {
    const hidden = passInput.type === 'password';
    passInput.type   = hidden ? 'text' : 'password';
    toggle.textContent = hidden ? 'OCULTAR' : 'VER';
  });
}

/* ============================================================
   ENVÍO DEL FORMULARIO PRINCIPAL
   ============================================================ */
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = (userInput?.value || '').trim();
    const password = (passInput?.value || '').trim();

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
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        showMessage(data.error || 'Credenciales incorrectas.', false);
        setLoading(false);
        return;
      }

      /* Si se requiere 2FA (TOTP) */
      if (data.totp_required) {
        showMessage('', null);
        setLoading(false);
        showTotpPanel(data.pre_token);
        return;
      }

      /* Login directo sin 2FA: guardar token y datos del usuario */
      localStorage.setItem('qubira_token', data.token);
      localStorage.setItem('qubira_user',  JSON.stringify(data.user));

      showMessage('¡Acceso concedido! Redirigiendo...', true);

      setTimeout(() => {
        window.location.href = '/control';
      }, 500);

    } catch (err) {
      console.error('[LOGIN] Error de red:', err);
      showMessage('No se pudo conectar al servidor. Intenta nuevamente.', false);
      setLoading(false);
    }
  });
}

function showMessage(text, success) {
  if (!message) return;
  message.textContent = text;
  message.className   = 'message' + (success === true ? ' success' : success === false ? ' error' : '');
}

function setLoading(loading) {
  if (!submitBtn) return;
  submitBtn.disabled    = loading;
  submitBtn.textContent = loading ? 'Verificando...' : 'Ingresar';
}

/* ============================================================
   SEGUNDO PASO: VERIFICACIÓN 2FA (TOTP)
   ============================================================ */
let pendingPreToken = null;

/* Garantiza que el panel TOTP siempre exista en el DOM (resuelve HTMLs cacheados) */
function ensureTotpPanel() {
  let panel = document.getElementById('totp-panel');
  if (panel) return panel;

  panel = document.createElement('div');
  panel.id = 'totp-panel';
  panel.style.display = 'none';
  panel.innerHTML = `
    <div style="background:rgba(31, 122, 224, 0.15); border:1px solid rgba(79, 176, 255, 0.35); border-radius:14px; padding:14px 16px; margin-bottom:20px; font-size:12.5px; color:#dbeafe; display:flex; align-items:flex-start; gap:12px; line-height:1.5;">
      <span style="font-size:22px; line-height:1;">🔐</span>
      <div>
        <strong style="color:#ffffff; font-size:13px; display:block; margin-bottom:2px;">Verificación 2FA requerida</strong>
        <span style="color:var(--muted); font-size:12px;">Ingresa el código de 6 dígitos generado por tu aplicación autenticadora (Google Authenticator, Authy, etc.).</span>
      </div>
    </div>

    <div class="field">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 1 1 6 0v3H9Z"/>
      </svg>
      <input
        type="text"
        id="totpCode"
        inputmode="numeric"
        pattern="[0-9]*"
        maxlength="6"
        placeholder="Código de 6 dígitos"
        autocomplete="one-time-code"
        style="padding-left:48px; letter-spacing:0.35em; font-weight:700; text-align:center; font-size:18px;"
      />
    </div>

    <button class="submit" type="button" id="totpSubmitBtn">Verificar Código</button>
    <button class="submit" type="button" id="totpCancelBtn" style="background:rgba(255,255,255,0.06); color:var(--text); border:1px solid var(--line); box-shadow:none; margin-top:10px;">Volver</button>
    <div id="totpMessage" class="message"></div>
  `;

  const formCard = document.querySelector('.form-card');
  const footNote = formCard ? formCard.querySelector('.foot-note') : null;
  if (footNote) {
    formCard.insertBefore(panel, footNote);
  } else if (formCard) {
    formCard.appendChild(panel);
  }

  bindTotpEvents();
  return panel;
}

function showTotpPanel(preToken) {
  pendingPreToken = preToken;
  const panel = ensureTotpPanel();

  if (form) form.style.display = 'none';
  if (verifiedBanner) verifiedBanner.style.display = 'none';
  if (centralNotice)  centralNotice.style.display  = 'none';

  panel.style.display = 'block';

  const codeInput = document.getElementById('totpCode');
  const msgEl     = document.getElementById('totpMessage');

  if (codeInput) {
    codeInput.value = '';
    codeInput.disabled = false;
    setTimeout(() => codeInput.focus(), 150);
  }
  if (msgEl) {
    msgEl.textContent = '';
    msgEl.className = 'message';
  }
}

function showTotpMessage(text, success) {
  const totpMessage = document.getElementById('totpMessage');
  if (!totpMessage) return;
  totpMessage.textContent = text;
  totpMessage.className   = 'message' + (success === true ? ' success' : success === false ? ' error' : '');
}

function setTotpLoading(loading) {
  const totpSubmitBtn = document.getElementById('totpSubmitBtn');
  const totpCodeInput = document.getElementById('totpCode');
  if (totpSubmitBtn) {
    totpSubmitBtn.disabled    = loading;
    totpSubmitBtn.textContent = loading ? 'Verificando...' : 'Verificar Código';
  }
  if (totpCodeInput) {
    totpCodeInput.disabled = loading;
  }
}

function bindTotpEvents() {
  const totpCancelBtn = document.getElementById('totpCancelBtn');
  const totpCodeInput = document.getElementById('totpCode');
  const totpSubmitBtn = document.getElementById('totpSubmitBtn');

  if (totpCancelBtn && !totpCancelBtn._hasBind) {
    totpCancelBtn._hasBind = true;
    totpCancelBtn.addEventListener('click', () => {
      pendingPreToken = null;
      const panel = document.getElementById('totp-panel');
      if (panel) panel.style.display = 'none';
      if (form)  form.style.display  = 'block';
      if (isVerified && verifiedBanner) verifiedBanner.style.display = 'flex';
      showMessage('', null);
      setLoading(false);
      if (passInput) setTimeout(() => passInput.focus(), 100);
    });
  }

  if (totpCodeInput && !totpCodeInput._hasBind) {
    totpCodeInput._hasBind = true;
    totpCodeInput.addEventListener('input', () => {
      totpCodeInput.value = totpCodeInput.value.replace(/\D/g, '').slice(0, 6);
      /* Envío automático al completar los 6 dígitos */
      if (totpCodeInput.value.length === 6) {
        submitTotp();
      }
    });

    totpCodeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitTotp();
    });
  }

  if (totpSubmitBtn && !totpSubmitBtn._hasBind) {
    totpSubmitBtn._hasBind = true;
    totpSubmitBtn.addEventListener('click', submitTotp);
  }
}

/* Vincular eventos si ya existe en el HTML */
bindTotpEvents();

async function submitTotp() {
  const totpCodeInput = document.getElementById('totpCode');
  const code = (totpCodeInput?.value || '').trim();

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
      credentials: 'include',
      body: JSON.stringify({ pre_token: pendingPreToken, code }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      showTotpMessage(data.error || 'Código 2FA incorrecto.', false);
      setTotpLoading(false);
      if (totpCodeInput) {
        totpCodeInput.value = '';
        totpCodeInput.focus();
      }
      return;
    }

    localStorage.setItem('qubira_token', data.token);
    localStorage.setItem('qubira_user', JSON.stringify(data.user));

    showTotpMessage('¡Código verificado! Redirigiendo a Control...', true);
    setTimeout(() => {
      window.location.href = '/control';
    }, 400);

  } catch (err) {
    console.error('[2FA] Error de red:', err);
    showTotpMessage('Error de conexión al verificar 2FA.', false);
    setTotpLoading(false);
  }
}
