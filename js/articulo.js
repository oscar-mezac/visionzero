/**
 * articulo.js
 * Lee el parámetro ?id= de la URL, busca el elemento en SBE_CONTENT y
 * renderiza el detalle completo o una vista previa bloqueada, según
 * SBEContentAccess.hasAccess. Se vuelve a renderizar cada vez que cambia
 * la sesión (por ejemplo, si el usuario inicia sesión desde este modal).
 */
(function () {
  const container = document.getElementById("sbe-article-content");
  if (!container) return;

  const id = new URLSearchParams(location.search).get("id");
  const item = window.SBE_CONTENT.find((c) => c.id === id);

  function badgeLabel(item) {
    return item.nivel === "free" ? "Gratis" : `Nivel ${item.nivel}`;
  }

  function renderNotFound() {
    container.innerHTML = `
      <p>No encontramos ese contenido. <a href="index.html">Vuelve al catálogo</a>.</p>
    `;
  }

  function render(session) {
    if (!item) {
      renderNotFound();
      return;
    }

    const unlocked = SBEContentAccess.hasAccess(session, item);
    document.title = `${item.titulo} — Visión Zero`;

    const body = unlocked
      ? item.cuerpo
      : `<p>${SBEContentAccess.excerptOf(item.cuerpo, 220)}</p>`;

    const cta = unlocked
      ? ""
      : `<div class="sbe-locked-cta">
           <span class="sbe-price">${item.precio || "Incluido en tu plan"}</span>
           <button class="sbe-btn sbe-btn-accent" id="sbe-buy-btn">
             ${item.precio ? "Comprar acceso" : "Solicitar acceso"}
           </button>
         </div>`;

    container.innerHTML = `
      <div class="sbe-card-meta">
        <span class="sbe-card-tipo">${item.tipo}</span>
        <span class="sbe-card-badge">${unlocked ? "" : "🔒 "}${badgeLabel(item)}</span>
      </div>
      <h1 class="sbe-article-title">${item.titulo}</h1>
      <p class="sbe-article-resumen">${item.resumen}</p>
      <div class="sbe-article-body ${unlocked ? "" : "sbe-locked"}">${body}</div>
      ${cta}
    `;

    const buyBtn = document.getElementById("sbe-buy-btn");
    if (buyBtn) buyBtn.addEventListener("click", onBuyClick);
  }

  async function onBuyClick() {
    const session = SBEAuth.getSession();
    if (!session) {
      document.dispatchEvent(new CustomEvent("sbe:require-login"));
      return;
    }
    try {
      await SBEApi.requestPurchase(session.token, item.id);
      SBEToast.show(
        "Solicitud enviada. Te habilitaremos el acceso cuando se confirme el pago."
      );
    } catch (err) {
      SBEToast.show(err.message, true);
    }
  }

  document.addEventListener("sbe:session-changed", (e) => render(e.detail));

  render(SBEAuth.getSession());
})();
