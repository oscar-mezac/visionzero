/**
 * toast.js
 * Notificaciones breves no bloqueantes. Un único módulo pequeño para no
 * repetir "alert()" por todo el código.
 */
window.SBEToast = (function () {
  function ensureContainer() {
    let el = document.getElementById("sbe-toast-container");
    if (!el) {
      el = document.createElement("div");
      el.id = "sbe-toast-container";
      document.body.appendChild(el);
    }
    return el;
  }

  function show(message, isError = false) {
    const container = ensureContainer();
    const toast = document.createElement("div");
    toast.className = "sbe-toast" + (isError ? " sbe-toast-error" : "");
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("sbe-toast-visible"));
    setTimeout(() => {
      toast.classList.remove("sbe-toast-visible");
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  return { show };
})();
