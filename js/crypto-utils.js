/**
 * crypto-utils.js
 * Hashing de contraseñas en el cliente con SubtleCrypto (SHA-256).
 * Nota: esto evita enviar contraseñas en texto plano por la red, pero no
 * reemplaza un backend con bcrypt/argon2. Para un sistema con datos sensibles
 * reales, migra el registro de usuarios a un backend dedicado.
 */
window.SBECrypto = (function () {
  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  // Se usa el correo (normalizado) como "sal" para que dos usuarios con la
  // misma contraseña no compartan el mismo hash.
  async function hashPassword(email, password) {
    const salt = email.trim().toLowerCase();
    return sha256Hex(`${salt}::${password}`);
  }

  return { hashPassword, sha256Hex };
})();
