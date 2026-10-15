'use strict';

const crypto = require('crypto');

const DEFAULT_KEY_B64 = 'gx+XUd+3xpjSLHPdiQktbokBOvq1/8RWMXW/sotAN9E=';

function getKey() {
  const raw = process.env.ENCRYPTION_KEY || DEFAULT_KEY_B64;
  return Buffer.from(raw, 'base64');
}

/* Descifra el totp_secret cifrado con AES-256-GCM */
function decryptTotpSecret(blob) {
  if (!blob) return null;
  try {
    const key = getKey();
    const buf = Buffer.from(blob, 'base64');
    if (buf.length < 28) return blob; // Posible texto plano base32
    const iv = buf.subarray(0, 12);
    const authTag = buf.subarray(12, 28);
    const ciphertext = buf.subarray(28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    return decipher.update(ciphertext, undefined, 'utf8') + decipher.final('utf8');
  } catch {
    return blob;
  }
}

/* Decodifica string Base32 a Buffer */
function base32Decode(base32) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  const output = [];

  for (const char of String(base32).toUpperCase()) {
    const val = alphabet.indexOf(char);
    if (val === -1) continue;
    value = (value << 5) | val;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(output);
}

/* Verifica código TOTP RFC 6238 con ventana de tolerancia ±1 paso (±30s) */
function verifyTOTP(token, secret, window = 1) {
  if (!token || !secret) return false;
  const key = base32Decode(secret);
  if (!key.length) return false;

  const epoch = Math.floor(Date.now() / 1000);
  const timeStep = 30;
  const currentCounter = Math.floor(epoch / timeStep);

  for (let offset = -window; offset <= window; offset++) {
    const counter = currentCounter + offset;
    const buf = Buffer.alloc(8);
    buf.writeBigInt64BE(BigInt(counter));
    const hmac = crypto.createHmac('sha1', key).update(buf).digest();
    const offsetHmac = hmac[hmac.length - 1] & 0x0f;
    const code = ((hmac[offsetHmac] & 0x7f) << 24 |
                  (hmac[offsetHmac + 1] & 0xff) << 16 |
                  (hmac[offsetHmac + 2] & 0xff) << 8 |
                  (hmac[offsetHmac + 3] & 0xff)) % 1000000;
    if (String(code).padStart(6, '0') === String(token).trim()) {
      return true;
    }
  }

  return false;
}

module.exports = {
  decryptTotpSecret,
  verifyTOTP,
};
