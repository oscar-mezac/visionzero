/**
 * riesgos-psicosociales.js
 * Maneja el envío del cuestionario. Por ahora solo valida y confirma en
 * pantalla: como el cuestionario completo tendrá más preguntas, conviene
 * conectar el backend (Apps Script + Sheets, igual que el resto del sitio)
 * cuando esté la versión final con todas las preguntas.
 */
(function () {
  const form = document.getElementById("sbe-riesgos-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    // TODO: reemplazar este console.log por un SBEApi.submitRiesgosPsicosociales(data)
    // apuntando a una hoja de cálculo, cuando el cuestionario esté completo.
    console.log("Respuestas del cuestionario:", data);

    SBEToast.show("Respuestas registradas. Gracias por completar el cuestionario.");
    form.reset();
  });
})();
