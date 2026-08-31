/**
 * content.js
 * Pinta las tarjetas resumen de Artículos y Cursos en la página principal:
 * solo título y un botón que lleva a articulo.html con el detalle completo.
 * La decisión de bloquear o no el contenido vive en la página de detalle
 * (ver articulo.js + content-access.js), no aquí.
 */
window.SBEContentView = (function () {
  const BUTTON_LABEL_BY_TYPE = {
    "Artículo": "Leer artículo",
    "Curso": "Ver curso"
  };

  function cardTemplate(item) {
    const label = BUTTON_LABEL_BY_TYPE[item.tipo] || "Ver más";
    return `
      <article class="sbe-card sbe-card-summary" data-content-id="${item.id}">
        <h3>${item.titulo}</h3>
        <a class="sbe-btn sbe-btn-solid" href="articulo.html?id=${encodeURIComponent(item.id)}">${label}</a>
      </article>
    `;
  }

  function renderGrid(gridId, items) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = items.map(cardTemplate).join("");
  }

  function render() {
    const articulos = window.SBE_CONTENT.filter((item) => item.tipo === "Artículo");
    const cursos = window.SBE_CONTENT.filter((item) => item.tipo === "Curso");
    renderGrid("sbe-articulos-grid", articulos);
    renderGrid("sbe-cursos-grid", cursos);
  }

  return { render };
})();
