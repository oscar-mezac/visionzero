/**
 * content.js
 * Pinta el catálogo de SBE_CONTENT en el DOM y decide, para cada elemento,
 * si el usuario actual puede verlo completo o solo una vista previa
 * bloqueada con opción de solicitar compra.
 */
window.SBEContentView = (function () {
  const LEVELS = window.SBE_CONFIG.ACCESS_LEVELS; // ["free","basic","premium"]

  function levelIndex(level) {
    const i = LEVELS.indexOf(level);
    return i === -1 ? 0 : i;
  }

  function hasAccess(session, item) {
    if (item.nivel === "free") return true;
    if (!session) return false;
    if (session.isAdmin) return true;
    if (session.extraContentIds && session.extraContentIds.includes(item.id)) return true;
    return levelIndex(session.accessLevel) >= levelIndex(item.nivel);
  }

  function excerptOf(html, chars) {
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return text.slice(0, chars) + "…";
  }

  function cardTemplate(item, unlocked) {
    const badge = item.nivel === "free" ? "Gratis" : `Nivel ${item.nivel}`;
    const body = unlocked
      ? item.cuerpo
      : `<p class="sbe-locked-preview">${excerptOf(item.cuerpo, 160)}</p>`;

    const cta = unlocked
      ? ""
      : `<div class="sbe-locked-cta">
           <span class="sbe-price">${item.precio || "Incluido en tu plan"}</span>
           <button class="sbe-btn sbe-btn-accent" data-buy="${item.id}">
             ${item.precio ? "Comprar acceso" : "Solicitar acceso"}
           </button>
         </div>`;

    return `
      <article class="sbe-card ${unlocked ? "" : "sbe-card-locked"}" data-content-id="${item.id}">
        <div class="sbe-card-meta">
          <span class="sbe-card-tipo">${item.tipo}</span>
          <span class="sbe-card-badge">${unlocked ? "" : "🔒 "}${badge}</span>
        </div>
        <h3>${item.titulo}</h3>
        <p class="sbe-card-resumen">${item.resumen}</p>
        <div class="sbe-card-body">${body}</div>
        ${cta}
      </article>
    `;
  }

  function render(session) {
    const grid = document.getElementById("sbe-content-grid");
    if (!grid) return;

    grid.innerHTML = window.SBE_CONTENT.map((item) => {
      const unlocked = hasAccess(session, item);
      return cardTemplate(item, unlocked);
    }).join("");

    grid.querySelectorAll("[data-buy]").forEach((btn) => {
      btn.addEventListener("click", () => onBuyClick(btn.dataset.buy));
    });
  }

  async function onBuyClick(contentId) {
    const session = SBEAuth.getSession();
    if (!session) {
      document.dispatchEvent(new CustomEvent("sbe:require-login"));
      return;
    }
    try {
      await SBEApi.requestPurchase(session.token, contentId);
      window.SBEToast.show(
        "Solicitud enviada. Te habilitaremos el acceso cuando se confirme el pago."
      );
    } catch (err) {
      window.SBEToast.show(err.message, true);
    }
  }

  document.addEventListener("sbe:session-changed", (e) => render(e.detail));

  return { render, hasAccess };
})();
