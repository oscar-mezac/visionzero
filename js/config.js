/**
 * config.js
 * Punto único de configuración. Edita estos valores antes de publicar el sitio.
 */
window.SBE_CONFIG = {
  // URL del Web App de Google Apps Script (ver apps-script/Code.gs).
  // Se obtiene al hacer "Implementar > Nueva implementación > Aplicación web".
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbwOqHZjPJun5duQIdufjYT9wqs_fzuEluFJbc6l734vZ9kajLrojfJwDIcHH3Nt5TOk/exec",

  // Client ID de Google OAuth (Google Cloud Console > Credenciales > ID de cliente OAuth 2.0).
  GOOGLE_CLIENT_ID: "PEGA_AQUI_TU_GOOGLE_CLIENT_ID.apps.googleusercontent.com",

  // Niveles de acceso disponibles, ordenados de menor a mayor.
  ACCESS_LEVELS: ["free", "basic", "premium"],

  // Correo(s) que el backend reconoce como administradores.
  // (El control real vive en la hoja de cálculo; esto solo es referencia visual).
  ADMIN_HINT_EMAILS: []
};
