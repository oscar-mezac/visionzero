/**
 * api.js
 * Toda la comunicación con el backend (Apps Script) pasa por aquí.
 * Mantener este archivo como única puerta de entrada a la red facilita
 * cambiar de backend en el futuro sin tocar el resto del sitio.
 */
window.SBEApi = (function () {
  const { APPS_SCRIPT_URL } = window.SBE_CONFIG;

  async function call(action, payload) {
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.startsWith("PEGA_AQUI")) {
      throw new Error(
        "El backend todavía no está configurado. Define APPS_SCRIPT_URL en js/config.js."
      );
    }

    // text/plain evita el preflight CORS que Apps Script no maneja bien.
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, ...payload })
    });

    if (!response.ok) {
      throw new Error(`Error de red (${response.status})`);
    }

    const result = await response.json();
    if (!result.ok) {
      throw new Error(result.error || "Error desconocido del servidor.");
    }
    return result.data;
  }

  return {
    register: (email, passwordHash, nombre) =>
      call("register", { email, passwordHash, nombre }),

    login: (email, passwordHash) => call("login", { email, passwordHash }),

    googleAuth: (email, nombre, googleSub) =>
      call("googleAuth", { email, nombre, googleSub }),

    getProfile: (token) => call("getProfile", { token }),

    requestPurchase: (token, contentId) =>
      call("requestPurchase", { token, contentId }),

    // --- Solo funcionan si el token pertenece a un administrador ---
    adminListUsers: (token) => call("adminListUsers", { token }),
    adminListRequests: (token) => call("adminListRequests", { token }),
    adminUpdateAccess: (token, targetEmail, accessLevel, extraContentIds) =>
      call("adminUpdateAccess", {
        token,
        targetEmail,
        accessLevel,
        extraContentIds
      }),
    adminResolveRequest: (token, requestId, approve) =>
      call("adminResolveRequest", { token, requestId, approve })
  };
})();
