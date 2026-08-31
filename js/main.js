/**
 * main.js
 * Punto de entrada de la página pública. Sincroniza el encabezado con el
 * estado de sesión y lanza el primer render del catálogo.
 */
(function () {
  const loggedOutActions = document.getElementById("sbe-actions-logged-out");
  const loggedInActions = document.getElementById("sbe-actions-logged-in");
  const userLabel = document.getElementById("sbe-user-label");
  const logoutBtn = document.getElementById("sbe-logout-btn");
  const adminLink = document.getElementById("sbe-admin-link");

  function paintHeader(session) {
    const isLoggedIn = !!session;
    loggedOutActions.classList.toggle("sbe-hidden", isLoggedIn);
    loggedInActions.classList.toggle("sbe-hidden", !isLoggedIn);
    if (isLoggedIn) {
      const levelLabel = { free: "Gratis", basic: "Básico", premium: "Premium" }[
        session.accessLevel
      ] || session.accessLevel;
      userLabel.textContent = `${session.nombre || session.email} · ${levelLabel}`;
      adminLink.classList.toggle("sbe-hidden", !session.isAdmin);
    }
  }

  logoutBtn.addEventListener("click", () => {
    SBEAuth.logout();
    SBEToast.show("Sesión cerrada.");
  });

  document.addEventListener("sbe:session-changed", (e) => paintHeader(e.detail));

  async function bootstrap() {
    const cached = SBEAuth.getSession();
    paintHeader(cached);
    SBEContentView.render(cached);

    // Revalida contra el backend en segundo plano (por si un admin cambió
    // el acceso del usuario desde la última visita).
    if (cached) {
      const fresh = await SBEAuth.refreshSession();
      if (!fresh) SBEContentView.render(null);
    }
  }

  bootstrap();
})();
