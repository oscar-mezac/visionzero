# Visión Zero — sitio con acceso por niveles

## Estructura
```
index.html          Página pública (catálogo + registro/login)
admin.html           Panel de administración (solo para ti)
css/styles.css        Estilos
js/config.js           Configuración (URL backend, Google Client ID)
js/crypto-utils.js     Hash de contraseñas (SHA-256, Web Crypto API)
js/api.js               Cliente HTTP hacia el backend
js/content-data.js       Catálogo de artículos/cursos
js/auth.js                Sesión, registro, login, Google
js/auth-ui.js               Modal de registro/login
js/google-auth.js             Botón "Continuar con Google"
js/content.js                  Render del catálogo con bloqueo de contenido
js/admin.js                     Lógica del panel de administración
js/toast.js                      Notificaciones
js/main.js                        Arranque de la página pública
apps-script/Code.gs                 Backend (Google Apps Script + Sheets)
```

## Pasos para dejarlo funcionando

### 1. Backend (Google Apps Script)
1. Crea una hoja de cálculo nueva en Google Sheets.
2. Extensiones → Apps Script → pega el contenido de `apps-script/Code.gs`.
3. Implementar → Nueva implementación → tipo **Aplicación web**.
   - Ejecutar como: tu cuenta.
   - Acceso: cualquier usuario.
4. Copia la URL que termina en `/exec`.
5. Pégala en `js/config.js`, en `APPS_SCRIPT_URL`.

La hoja "Usuarios" y "Solicitudes" se crean solas la primera vez que alguien
se registra o pide acceso.

### 2. Convertirte en administrador
1. Regístrate una vez en el sitio con tu propio correo.
2. Abre la hoja de cálculo → pestaña "Usuarios" → busca tu fila.
3. Pon `TRUE` en la columna `IsAdmin`.
4. Cierra sesión y vuelve a entrar en el sitio: ya verás el enlace
   "Panel admin" en el encabezado.

Ese control queda enteramente en tus manos: nadie puede volverse
administrador desde la web, solo editando la hoja directamente.

### 3. Inicio de sesión con Google (opcional)
1. En [Google Cloud Console](https://console.cloud.google.com/), crea un
   proyecto y un **ID de cliente OAuth 2.0** de tipo "Aplicación web".
2. Agrega el dominio donde publiques el sitio en "Orígenes autorizados de
   JavaScript".
3. Copia el Client ID en `js/config.js`, en `GOOGLE_CLIENT_ID`.

Si no lo configuras, el botón de Google se muestra deshabilitado y el resto
del sitio (registro con correo/contraseña) sigue funcionando normalmente.

### 4. Publicar los archivos
Sube la carpeta completa a cualquier hosting estático (GitHub Pages, un
servidor propio, etc.). No requiere Node ni proceso de build.

## Cómo funciona el flujo de compra
1. Un usuario sin acceso ve el contenido bloqueado con un botón
   "Comprar acceso" / "Solicitar acceso".
2. Al hacer clic, se crea una solicitud pendiente (no se cobra nada
   automáticamente: no hay pasarela de pago integrada).
3. Tú revisas el pago por el medio que uses normalmente y luego, desde
   `admin.html`, apruebas la solicitud o cambias el nivel de acceso del
   usuario directamente.
4. La próxima vez que el usuario entre, el sitio revalida su sesión contra
   el backend y desbloquea el contenido correspondiente.

## Notas de seguridad
- Las contraseñas nunca viajan en texto plano: se hashean en el navegador
  con SHA-256 antes de enviarse.
- Este esquema es adecuado para un catálogo de contenido de pago con
  aprobación manual. Si más adelante necesitas cobros automáticos o datos
  más sensibles, conviene migrar el backend a un servicio dedicado
  (Firebase Auth, un backend propio, etc.) en vez de Apps Script + Sheets.
