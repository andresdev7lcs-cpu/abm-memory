/**
 * INF-002 — Session identity and role resolution.
 * Uses the active Google account email, then resolves the role from the
 * Users tab seeded by INF-001.
 */

function getSession() {
  var email = getActiveUserEmail_();
  if (!email) {
    return { ok: false, status: 403, error: 'Sesión no autenticada' };
  }

  var user = findUserByEmail_(email);
  if (!user || !user.active) {
    return { ok: false, status: 403, error: 'Usuario no autorizado', email: email };
  }

  return {
    ok: true,
    email: email,
    role: user.role,
    fullName: user.full_name,
    user: user
  };
}

function getActiveUserEmail_() {
  var activeUser = Session.getActiveUser();
  if (!activeUser) {
    return '';
  }
  return String(activeUser.getEmail ? activeUser.getEmail() : '').trim().toLowerCase();
}

function findUserByEmail_(email) {
  var rows = db.read('Users', function (row) {
    return String(row.email || '').trim().toLowerCase() === String(email || '').trim().toLowerCase();
  });
  return rows.length ? rows[0] : null;
}

function requireRole_(session, allowedRoles) {
  if (!session || !session.ok) {
    return { ok: false, status: 403, error: 'Sesión no autenticada' };
  }
  if (!allowedRoles || allowedRoles.length === 0) {
    return { ok: true };
  }
  if (allowedRoles.indexOf(session.role) === -1) {
    return { ok: false, status: 403, error: 'Rol no autorizado', allowed: allowedRoles };
  }
  return { ok: true };
}
