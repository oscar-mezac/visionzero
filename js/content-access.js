/**
 * content-access.js
 * Reglas de acceso a contenido, compartidas entre la página principal
 * (para saber qué mostrar) y la página de detalle de artículo/curso
 * (para decidir si se muestra completo o en vista previa bloqueada).
 */
window.SBEContentAccess = (function () {
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
    return text.length > chars ? text.slice(0, chars) + "…" : text;
  }

  return { hasAccess, excerptOf, levelIndex };
})();
