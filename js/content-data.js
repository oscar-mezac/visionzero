/**
 * content-data.js
 * Catálogo de contenidos. Cada elemento define qué nivel de acceso necesita
 * ("free", "basic" o "premium") y, si es de pago, su precio de referencia.
 * Separar los datos de la lógica de renderizado es lo que evita el
 * "código espagueti": content.js no sabe nada de artículos concretos.
 */
window.SBE_CONTENT = [
  {
    id: "fundamentos-sbe",
    tipo: "Artículo",
    nivel: "free",
    titulo: "Fundamentos de la Seguridad Basada en el Comportamiento",
    resumen:
      "Qué es la SBE, de dónde viene y por qué observar conductas cambia los resultados de seguridad más que solo medir incidentes.",
    cuerpo: `
      <p>La Seguridad Basada en el Comportamiento (SBE) parte de una idea simple: la mayoría de los accidentes laborales no ocurren por falta de procedimientos, sino por la brecha entre lo que las personas saben y lo que realmente hacen bajo presión, cansancio o costumbre.</p>
      <p>Un programa de SBE típico se apoya en tres pilares: observación entre pares, retroalimentación inmediata y no punitiva, y datos que permiten ver patrones antes de que se conviertan en incidentes. No reemplaza la gestión de riesgos tradicional; la complementa, poniendo el foco en el comportamiento observable en terreno.</p>
      <p>El objetivo final no es "cazar" errores, sino construir un lenguaje común entre supervisión y operarios para hablar de seguridad sin miedo a la sanción.</p>
    `
  },
  {
    id: "cultura-seguridad",
    tipo: "Artículo",
    nivel: "basic",
    precio: "S/ 19",
    titulo: "Cultura de seguridad: del cumplimiento al compromiso",
    resumen:
      "Las etapas por las que atraviesa una organización hasta que la seguridad deja de ser una norma impuesta y se vuelve un valor compartido.",
    cuerpo: `
      <p>Las organizaciones maduran su cultura de seguridad en etapas reconocibles: reactiva, dependiente, independiente e interdependiente. En la etapa reactiva, la seguridad es responsabilidad del área de SSOMA y se activa después del incidente. En la etapa interdependiente, cualquier trabajador se siente responsable de la seguridad de su equipo, no solo de la propia.</p>
      <p>El salto más difícil no es técnico sino relacional: pasar de "cumplir la norma porque me la exigen" a "cumplirla porque me importa el compañero de al lado". Ese cambio se construye con liderazgo visible, consistencia entre lo que se dice y lo que se premia, y espacios reales de participación.</p>
      <p>Este artículo desarrolla indicadores prácticos para diagnosticar en qué etapa está tu equipo y qué palancas mover en cada una.</p>
    `
  },
  {
    id: "sesgos-riesgo",
    tipo: "Artículo",
    nivel: "premium",
    precio: "S/ 39",
    titulo: "Psicología del riesgo: sesgos cognitivos en el trabajo",
    resumen:
      "Por qué personas experimentadas se saltan controles: normalización del riesgo, exceso de confianza y la ilusión de control explicadas para terreno.",
    cuerpo: `
      <p>La normalización de la desviación ocurre cuando una práctica insegura se repite sin consecuencias visibles y termina percibiéndose como normal. El exceso de confianza aparece con la experiencia: cuanto más tiempo lleva una persona haciendo una tarea sin incidentes, más subestima su probabilidad de sufrir uno.</p>
      <p>Otro sesgo clave es la ilusión de control: sobreestimar la capacidad propia de reaccionar ante un evento inesperado, lo que lleva a omitir barreras "porque de todas formas yo lo hubiera evitado". Reconocer estos patrones en el discurso de terreno permite diseñar observaciones y retroalimentación que apunten a la causa real, no solo al síntoma.</p>
      <p>Este contenido incluye una guía de preguntas para detectar cada sesgo durante una observación conductual y ejemplos de frases típicas que los delatan.</p>
    `
  },
  {
    id: "liderazgo-visible",
    tipo: "Artículo",
    nivel: "premium",
    precio: "S/ 39",
    titulo: "Liderazgo visible y observaciones conductuales",
    resumen:
      "Cómo estructurar una observación conductual efectiva: qué mirar, qué preguntar y cómo cerrar la conversación sin generar rechazo.",
    cuerpo: `
      <p>Una observación conductual efectiva no es una lista de chequeo silenciosa; es una conversación breve y específica. Empieza reconociendo algo que la persona hace bien, describe con precisión la conducta observada (no una etiqueta como "eres descuidado"), pregunta por el porqué y cierra con un acuerdo concreto.</p>
      <p>El error más común de un líder nuevo en SBE es convertir la observación en una inspección disfrazada. La diferencia se nota en el tono: preguntar "¿qué te llevó a hacerlo así?" en vez de "¿por qué no usaste el procedimiento?".</p>
      <p>Incluye una estructura de conversación en cuatro pasos y ejemplos de cierre para distintos escenarios de terreno.</p>
    `
  },
  {
    id: "fatiga-carga-mental",
    tipo: "Artículo",
    nivel: "premium",
    precio: "S/ 39",
    titulo: "Fatiga, estrés y carga mental en operaciones de alto riesgo",
    resumen:
      "Cómo la fatiga acumulada y la carga mental afectan la toma de decisiones en turnos largos, y qué señales tempranas vigilar.",
    cuerpo: `
      <p>La fatiga no es solo sueño: es una reducción medible de la capacidad de atención sostenida, memoria de trabajo y velocidad de reacción. En operaciones de alto riesgo, los errores por fatiga se concentran en las últimas horas de turno y en los primeros días tras un cambio de rotación.</p>
      <p>La carga mental se suma cuando una tarea exige monitorear múltiples fuentes de información a la vez, algo frecuente en supervisión y operación de equipos. El resultado combinado es una atención en túnel: la persona sigue "viendo" pero deja de procesar señales periféricas de riesgo.</p>
      <p>Se desarrollan aquí señales tempranas observables por un supervisor y ajustes operativos de bajo costo para mitigarlas.</p>
    `
  },
  {
    id: "curso-observacion-retro",
    tipo: "Curso",
    nivel: "premium",
    precio: "S/ 129",
    titulo: "Programa de Observación y Retroalimentación Conductual",
    resumen:
      "Curso completo con módulos, casos de terreno y plantillas descargables para implementar un programa de SBE en tu proyecto.",
    cuerpo: `
      <p>Curso estructurado en cinco módulos: fundamentos de SBE, diseño de un programa de observación, conversaciones de retroalimentación, análisis de datos conductuales y sostenibilidad del programa en el tiempo.</p>
      <p>Incluye casos reales de proyectos de construcción e infraestructura, plantillas de formularios de observación y una guía para capacitar observadores pares.</p>
      <p>Acceso completo tras la compra, incluyendo actualizaciones futuras del curso.</p>
    `
  }
];
