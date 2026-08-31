/**
 * admin.js
 * Lógica del panel de administración. Solo se ejecuta en admin.html.
 * Todo intento de listar/editar usuarios pasa por el backend, que valida
 * de nuevo (server-side) que el token pertenezca a un administrador:
 * este archivo NO es el mecanismo de seguridad, solo la interfaz.
 */
(function () {
  const gate = document.getElementById("sbe-admin-gate");
  const panel = document.getElementById("sbe-admin-panel");
  const usersBody = document.getElementById("sbe-admin-users-body");
  const requestsBody = document.getElementById("sbe-admin-requests-body");
  const contentIds = window.SBE_CONTENT.map((c) => c.id);

  function renderGate(message) {
    gate.classList.remove("sbe-hidden");
    panel.classList.add("sbe-hidden");
    gate.querySelector("p").textContent = message;
  }

  function extraCheckboxes(userEmail, selectedIds) {
    return contentIds
      .map((id) => {
        const checked = selectedIds.includes(id) ? "checked" : "";
        return `<label class="sbe-extra-check">
                  <input type="checkbox" data-extra="${userEmail}" value="${id}" ${checked} />
                  ${id}
                </label>`;
      })
      .join("");
  }

  function renderUsers(users, token) {
    usersBody.innerHTML = users
      .map((u) => {
        const options = window.SBE_CONFIG.ACCESS_LEVELS.map(
          (lvl) =>
            `<option value="${lvl}" ${u.accessLevel === lvl ? "selected" : ""}>${lvl}</option>`
        ).join("");
        return `
          <tr data-email="${u.email}">
            <td>${u.nombre || "—"}</td>
            <td>${u.email}</td>
            <td>${u.proveedor}</td>
            <td><select class="sbe-level-select" data-email="${u.email}">${options}</select></td>
            <td class="sbe-extra-cell">${extraCheckboxes(u.email, u.extraContentIds || [])}</td>
            <td><button class="sbe-btn sbe-btn-solid sbe-save-user" data-email="${u.email}">Guardar</button></td>
          </tr>
        `;
      })
      .join("");

    usersBody.querySelectorAll(".sbe-save-user").forEach((btn) => {
      btn.addEventListener("click", () => saveUser(btn.dataset.email, token));
    });
  }

  function renderRequests(requests, token) {
    if (!requests.length) {
      requestsBody.innerHTML = `<tr><td colspan="5">No hay solicitudes pendientes.</td></tr>`;
      return;
    }
    requestsBody.innerHTML = requests
      .map(
        (r) => `
          <tr data-id="${r.id}">
            <td>${r.email}</td>
            <td>${r.contentId}</td>
            <td>${r.fecha}</td>
            <td>${r.estado}</td>
            <td>
              ${
                r.estado === "pendiente"
                  ? `<button class="sbe-btn sbe-btn-solid" data-approve="${r.id}">Aprobar</button>
                     <button class="sbe-btn" data-reject="${r.id}">Rechazar</button>`
                  : "—"
              }
            </td>
          </tr>
        `
      )
      .join("");

    requestsBody.querySelectorAll("[data-approve]").forEach((btn) => {
      btn.addEventListener("click", () => resolveRequest(btn.dataset.approve, true, token));
    });
    requestsBody.querySelectorAll("[data-reject]").forEach((btn) => {
      btn.addEventListener("click", () => resolveRequest(btn.dataset.reject, false, token));
    });
  }

  async function saveUser(email, token) {
    const row = usersBody.querySelector(`tr[data-email="${CSS.escape(email)}"]`);
    const level = row.querySelector(".sbe-level-select").value;
    const extras = Array.from(row.querySelectorAll("[data-extra]:checked")).map((cb) => cb.value);
    try {
      await SBEApi.adminUpdateAccess(token, email, level, extras);
      SBEToast.show(`Acceso actualizado para ${email}`);
    } catch (err) {
      SBEToast.show(err.message, true);
    }
  }

  async function resolveRequest(requestId, approve, token) {
    try {
      await SBEApi.adminResolveRequest(token, requestId, approve);
      await loadAll(token);
      SBEToast.show(approve ? "Solicitud aprobada." : "Solicitud rechazada.");
    } catch (err) {
      SBEToast.show(err.message, true);
    }
  }

  async function loadAll(token) {
    const [users, requests] = await Promise.all([
      SBEApi.adminListUsers(token),
      SBEApi.adminListRequests(token)
    ]);
    renderUsers(users, token);
    renderRequests(requests, token);
  }

  async function bootstrap() {
    const session = SBEAuth.getSession();
    if (!session) {
      renderGate("Inicia sesión desde la página principal con una cuenta de administrador.");
      return;
    }
    try {
      const profile = await SBEAuth.refreshSession();
      if (!profile || !profile.isAdmin) {
        renderGate("Esta cuenta no tiene permisos de administrador.");
        return;
      }
      gate.classList.add("sbe-hidden");
      panel.classList.remove("sbe-hidden");
      await loadAll(profile.token);
    } catch (err) {
      renderGate(err.message);
    }
  }

  bootstrap();
})();
