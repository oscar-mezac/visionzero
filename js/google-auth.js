/**
 * google-auth.js
 * Inicializa el botón "Continuar con Google" usando Google Identity Services.
 * Requiere que window.SBE_CONFIG.GOOGLE_CLIENT_ID esté configurado y que el
 * dominio del sitio esté autorizado en Google Cloud Console.
 */
(function () {
  function decodeJwt(token) {
    const payload = token.split(".")[1];
    const json = decodeURIComponent(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  }

  async function handleCredentialResponse(response) {
    try {
      const data = decodeJwt(response.credential);
      const profile = await SBEAuth.loginWithGoogle({
        email: data.email,
        name: data.name,
        sub: data.sub
      });
      SBEToast.show(`Bienvenido, ${profile.nombre || profile.email}`);
      SBEAuthUI.closeModal();
    } catch (err) {
      SBEToast.show(err.message, true);
    }
  }

  function init() {
    const clientId = window.SBE_CONFIG.GOOGLE_CLIENT_ID;
    const buttons = document.querySelectorAll(".sbe-google-btn");
    if (!clientId || clientId.startsWith("PEGA_AQUI")) {
      buttons.forEach((el) => {
        el.innerHTML =
          '<p class="sbe-google-disabled">Inicio con Google no configurado aún.</p>';
      });
      return;
    }
    if (!window.google || !window.google.accounts) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse
    });

    buttons.forEach((el) => {
      window.google.accounts.id.renderButton(el, {
        theme: "outline",
        size: "large",
        width: 320,
        text: "continue_with"
      });
    });
  }

  window.addEventListener("load", init);
})();
