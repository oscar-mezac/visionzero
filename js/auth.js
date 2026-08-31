/**
 * auth.js
 * Maneja registro, inicio de sesión, sesión en localStorage y Google Sign-In.
 * No sabe nada de cómo se pinta el contenido (eso es tarea de content.js);
 * solo expone el estado de sesión y dispara un evento cuando cambia.
 */
window.SBEAuth = (function () {
  const SESSION_KEY = "sbe_session";

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch {
      return null;
    }
  }

  function setSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    document.dispatchEvent(new CustomEvent("sbe:session-changed", { detail: session }));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    document.dispatchEvent(new CustomEvent("sbe:session-changed", { detail: null }));
  }

  async function register(email, password, nombre) {
    const passwordHash = await SBECrypto.hashPassword(email, password);
    const profile = await SBEApi.register(email, passwordHash, nombre);
    setSession(profile); // { token, email, nombre, accessLevel, extraContentIds, isAdmin }
    return profile;
  }

  async function login(email, password) {
    const passwordHash = await SBECrypto.hashPassword(email, password);
    const profile = await SBEApi.login(email, passwordHash);
    setSession(profile);
    return profile;
  }

  async function loginWithGoogle(googleUser) {
    // googleUser: { email, name, sub } decodificado del JWT de Google Identity Services
    const profile = await SBEApi.googleAuth(googleUser.email, googleUser.name, googleUser.sub);
    setSession(profile);
    return profile;
  }

  function logout() {
    clearSession();
  }

  // Verifica contra el backend que la sesión guardada localmente siga vigente
  // y refresca su nivel de acceso (por si un admin lo cambió recientemente).
  async function refreshSession() {
    const session = getSession();
    if (!session) return null;
    try {
      const profile = await SBEApi.getProfile(session.token);
      setSession(profile);
      return profile;
    } catch (err) {
      clearSession();
      return null;
    }
  }

  return { getSession, setSession, clearSession, register, login, loginWithGoogle, logout, refreshSession };
})();
