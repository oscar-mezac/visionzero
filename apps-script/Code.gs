/**
 * Code.gs — Backend del sitio "Visión Zero".
 *
 * Cómo desplegar:
 * 1. Crea una hoja de cálculo de Google Sheets nueva.
 * 2. Extensiones > Apps Script, pega este archivo completo.
 * 3. Implementar > Nueva implementación > Tipo "Aplicación web".
 *    - Ejecutar como: Yo (tu cuenta)
 *    - Quién tiene acceso: Cualquier usuario
 * 4. Copia la URL /exec resultante en js/config.js (APPS_SCRIPT_URL).
 * 5. En la hoja "Usuarios" que se crea automáticamente, pon TRUE en la
 *    columna IsAdmin para tu propia cuenta después de registrarte una vez.
 *    Ese es el único lugar donde se otorgan permisos de administrador:
 *    tú tienes control total porque tú controlas la hoja de cálculo.
 */

const USERS_SHEET = "Usuarios";
const REQUESTS_SHEET = "Solicitudes";

const USER_HEADERS = [
  "Email", "PasswordHash", "Nombre", "Proveedor", "GoogleSub",
  "AccessLevel", "ExtraContentIds", "IsAdmin", "Token", "FechaRegistro"
];
const REQUEST_HEADERS = ["ID", "Email", "ContentId", "Estado", "Fecha"];

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOut({ ok: false, error: "Solicitud inválida." });
  }

  const handlers = {
    register: handleRegister,
    login: handleLogin,
    googleAuth: handleGoogleAuth,
    getProfile: handleGetProfile,
    requestPurchase: handleRequestPurchase,
    adminListUsers: handleAdminListUsers,
    adminListRequests: handleAdminListRequests,
    adminUpdateAccess: handleAdminUpdateAccess,
    adminResolveRequest: handleAdminResolveRequest
  };

  const handler = handlers[body.action];
  if (!handler) return jsonOut({ ok: false, error: "Acción no reconocida." });

  try {
    const data = handler(body);
    return jsonOut({ ok: true, data });
  } catch (err) {
    return jsonOut({ ok: false, error: err.message });
  }
}

/* ---------------- Handlers ---------------- */

function handleRegister({ email, passwordHash, nombre }) {
  email = normalizeEmail_(email);
  if (!email || !passwordHash) throw new Error("Correo y contraseña son obligatorios.");
  if (findUserRow_(email)) throw new Error("Ya existe una cuenta con ese correo.");

  const token = makeToken_();
  appendUserRow_({
    email, passwordHash, nombre, proveedor: "local", googleSub: "",
    accessLevel: "free", extraContentIds: "", isAdmin: false, token
  });
  return profileFromRow_(getUserByEmail_(email));
}

function handleLogin({ email, passwordHash }) {
  email = normalizeEmail_(email);
  const row = getUserByEmail_(email);
  if (!row || row.passwordHash !== passwordHash) {
    throw new Error("Correo o contraseña incorrectos.");
  }
  const token = makeToken_();
  updateUserField_(email, "Token", token);
  row.token = token;
  return profileFromRow_(row);
}

function handleGoogleAuth({ email, nombre, googleSub }) {
  email = normalizeEmail_(email);
  if (!email) throw new Error("Google no devolvió un correo válido.");

  let row = getUserByEmail_(email);
  const token = makeToken_();

  if (!row) {
    appendUserRow_({
      email, passwordHash: "", nombre, proveedor: "google", googleSub,
      accessLevel: "free", extraContentIds: "", isAdmin: false, token
    });
    row = getUserByEmail_(email);
  } else {
    updateUserField_(email, "Token", token);
    updateUserField_(email, "GoogleSub", googleSub);
    row.token = token;
  }
  return profileFromRow_(row);
}

function handleGetProfile({ token }) {
  const row = getUserByToken_(token);
  if (!row) throw new Error("Sesión no válida. Inicia sesión de nuevo.");
  return profileFromRow_(row);
}

function handleRequestPurchase({ token, contentId }) {
  const row = getUserByToken_(token);
  if (!row) throw new Error("Sesión no válida.");
  const sheet = getSheet_(REQUESTS_SHEET, REQUEST_HEADERS);
  const id = Utilities.getUuid();
  sheet.appendRow([id, row.email, contentId, "pendiente", new Date().toISOString()]);
  return { id };
}

function handleAdminListUsers({ token }) {
  requireAdmin_(token);
  const sheet = getSheet_(USERS_SHEET, USER_HEADERS);
  const rows = sheet.getDataRange().getValues();
  return rows.slice(1).map((r) => ({
    email: r[0],
    nombre: r[2],
    proveedor: r[3],
    accessLevel: r[5],
    extraContentIds: r[6] ? String(r[6]).split(",").filter(Boolean) : [],
    isAdmin: r[7] === true || r[7] === "TRUE"
  }));
}

function handleAdminListRequests({ token }) {
  requireAdmin_(token);
  const sheet = getSheet_(REQUESTS_SHEET, REQUEST_HEADERS);
  const rows = sheet.getDataRange().getValues();
  return rows
    .slice(1)
    .map((r) => ({ id: r[0], email: r[1], contentId: r[2], estado: r[3], fecha: r[4] }))
    .reverse();
}

function handleAdminUpdateAccess({ token, targetEmail, accessLevel, extraContentIds }) {
  requireAdmin_(token);
  const email = normalizeEmail_(targetEmail);
  if (!getUserByEmail_(email)) throw new Error("Usuario no encontrado.");
  updateUserField_(email, "AccessLevel", accessLevel);
  updateUserField_(email, "ExtraContentIds", (extraContentIds || []).join(","));
  return { updated: true };
}

function handleAdminResolveRequest({ token, requestId, approve }) {
  requireAdmin_(token);
  const sheet = getSheet_(REQUESTS_SHEET, REQUEST_HEADERS);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === requestId) {
      const newState = approve ? "aprobado" : "rechazado";
      sheet.getRange(i + 1, 4).setValue(newState);
      if (approve) {
        const email = rows[i][1];
        const contentId = rows[i][2];
        const user = getUserByEmail_(email);
        if (user) {
          const current = user.extraContentIds ? user.extraContentIds.split(",").filter(Boolean) : [];
          if (!current.includes(contentId)) current.push(contentId);
          updateUserField_(email, "ExtraContentIds", current.join(","));
        }
      }
      return { resolved: true };
    }
  }
  throw new Error("Solicitud no encontrada.");
}

/* ---------------- Helpers de datos ---------------- */

function getSheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  }
  return sheet;
}

function normalizeEmail_(email) {
  return (email || "").trim().toLowerCase();
}

function makeToken_() {
  return Utilities.getUuid();
}

function findUserRow_(email) {
  return getUserByEmail_(email) !== null;
}

function getUserByEmail_(email) {
  const sheet = getSheet_(USERS_SHEET, USER_HEADERS);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (normalizeEmail_(rows[i][0]) === email) {
      return rowToUser_(rows[i], i + 1);
    }
  }
  return null;
}

function getUserByToken_(token) {
  if (!token) return null;
  const sheet = getSheet_(USERS_SHEET, USER_HEADERS);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][8] === token) return rowToUser_(rows[i], i + 1);
  }
  return null;
}

function rowToUser_(r, rowIndex) {
  return {
    rowIndex,
    email: r[0],
    passwordHash: r[1],
    nombre: r[2],
    proveedor: r[3],
    googleSub: r[4],
    accessLevel: r[5] || "free",
    extraContentIds: r[6] || "",
    isAdmin: r[7] === true || r[7] === "TRUE",
    token: r[8],
    fechaRegistro: r[9]
  };
}

function appendUserRow_({ email, passwordHash, nombre, proveedor, googleSub, accessLevel, extraContentIds, isAdmin, token }) {
  const sheet = getSheet_(USERS_SHEET, USER_HEADERS);
  sheet.appendRow([
    email, passwordHash, nombre || "", proveedor, googleSub || "",
    accessLevel, extraContentIds || "", !!isAdmin, token, new Date().toISOString()
  ]);
}

function updateUserField_(email, headerName, value) {
  const sheet = getSheet_(USERS_SHEET, USER_HEADERS);
  const colIndex = USER_HEADERS.indexOf(headerName) + 1;
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (normalizeEmail_(rows[i][0]) === email) {
      sheet.getRange(i + 1, colIndex).setValue(value);
      return;
    }
  }
}

function requireAdmin_(token) {
  const user = getUserByToken_(token);
  if (!user || !user.isAdmin) throw new Error("No tienes permisos de administrador.");
  return user;
}

function profileFromRow_(row) {
  return {
    token: row.token,
    email: row.email,
    nombre: row.nombre,
    accessLevel: row.accessLevel,
    extraContentIds: row.extraContentIds ? String(row.extraContentIds).split(",").filter(Boolean) : [],
    isAdmin: row.isAdmin
  };
}

/* ---------------- Salida JSON con CORS ---------------- */

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
