/**
 * header-ui.js
 * Sincroniza el encabezado (botones de sesión, nombre de usuario, enlace de
 * admin) con el estado de sesión. Es el mismo encabezado en todas las
 * páginas que lo incluyen (index.html, articulo.html), así que vive en un
 * único archivo en vez de repetirse en cada bootstrap de página.
 */
(function () {
  const loggedOutActions = document.getElementById("sbe-actions-logged-out");
  const loggedInActions = document.getElementById("sbe-actions-logged-in");
  const userLabel = document.getElementById("sbe-user-label");
  const logoutBtn = document.getElementById("sbe-logout-btn");
  const adminLink = document.getElementById("sbe-admin-link");

  // Si la página no tiene encabezado con sesión (ej. la herramienta), no hace nada.
  if (!loggedOutActions || !loggedInActions) return;

  const LEVEL_LABELS = { free: "Gratis", basic: "Básico", premium: "Premium" };

  function paint(session) {
    const isLoggedIn = !!session;
    loggedOutActions.classList.toggle("sbe-hidden", isLoggedIn);
    loggedInActions.classList.toggle("sbe-hidden", !isLoggedIn);
    if (isLoggedIn) {
      const levelLabel = LEVEL_LABELS[session.accessLevel] || session.accessLevel;
      userLabel.textContent = `${session.nombre || session.email} · ${levelLabel}`;
      adminLink.classList.toggle("sbe-hidden", !session.isAdmin);
    }
  }

  logoutBtn.addEventListener("click", () => {
    SBEAuth.logout();
    SBEToast.show("Sesión cerrada.");
  });

  document.addEventListener("sbe:session-changed", (e) => paint(e.detail));

  async function init() {
    const cached = SBEAuth.getSession();
    paint(cached);
    if (cached) await SBEAuth.refreshSession();
  }

  init();
})();
