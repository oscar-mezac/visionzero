/**
 * auth-ui.js
 * Conecta los formularios de los modales de "Registrarse" e "Iniciar sesión"
 * con el módulo SBEAuth. Este archivo solo maneja DOM + eventos; toda la
 * lógica de negocio vive en auth.js.
 */
(function () {
  const modalBackdrop = document.getElementById("sbe-auth-modal");
  const loginScreen = document.getElementById("sbe-login-screen");
  const registerScreen = document.getElementById("sbe-register-screen");
  const loginForm = document.getElementById("sbe-login-form");
  const registerForm = document.getElementById("sbe-register-form");
  const switchLinks = document.querySelectorAll("[data-auth-tab]");

  function openModal(screen) {
    modalBackdrop.classList.add("sbe-modal-open");
    setScreen(screen || "login");
  }

  function closeModal() {
    modalBackdrop.classList.remove("sbe-modal-open");
  }

  // Muestra únicamente la pantalla pedida (login o register) — la otra
  // queda completamente oculta, no solo "atenuada" detrás de una pestaña.
  function setScreen(screen) {
    loginScreen.classList.toggle("sbe-hidden", screen !== "login");
    registerScreen.classList.toggle("sbe-hidden", screen !== "register");
    const focusTarget = (screen === "login" ? loginForm : registerForm).querySelector("input");
    if (focusTarget) setTimeout(() => focusTarget.focus(), 50);
  }

  switchLinks.forEach((link) => link.addEventListener("click", () => setScreen(link.dataset.authTab)));

  document.querySelectorAll("[data-open-auth]").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.dataset.openAuth));
  });

  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener("sbe:require-login", () => openModal("login"));

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;
    const submitBtn = loginForm.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    try {
      const profile = await SBEAuth.login(email, password);
      SBEToast.show(`Bienvenido, ${profile.nombre || profile.email}`);
      closeModal();
      loginForm.reset();
    } catch (err) {
      SBEToast.show(err.message, true);
    } finally {
      submitBtn.disabled = false;
    }
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = registerForm.nombre.value.trim();
    const email = registerForm.email.value.trim();
    const password = registerForm.password.value;
    const passwordConfirm = registerForm.passwordConfirm.value;

    if (password !== passwordConfirm) {
      SBEToast.show("Las contraseñas no coinciden.", true);
      return;
    }
    if (password.length < 8) {
      SBEToast.show("La contraseña debe tener al menos 8 caracteres.", true);
      return;
    }

    const submitBtn = registerForm.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    try {
      const profile = await SBEAuth.register(email, password, nombre);
      SBEToast.show(`Cuenta creada. Bienvenido, ${profile.nombre || profile.email}`);
      closeModal();
      registerForm.reset();
    } catch (err) {
      SBEToast.show(err.message, true);
    } finally {
      submitBtn.disabled = false;
    }
  });

  window.SBEAuthUI = { openModal, closeModal };
})();
