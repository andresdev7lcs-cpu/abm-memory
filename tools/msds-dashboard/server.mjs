import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Dashboard Kanban local para MSDS-CRM. Node core puro, sin dependencias npm.
// IMPORTANTE: este server NUNCA ejecuta comandos de shell. El endpoint de
// "comando" solo devuelve un string sugerido para que el usuario lo copie
// y lo corra manualmente en su propia terminal. (Mismo patrón que
// tools/fire-pass-dashboard/server.mjs — puerto distinto para no chocar.)

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROADMAP_PATH = path.join(__dirname, 'msds-roadmap.md');
const STATUS_PATH = path.join(__dirname, 'msds-status.md');
const INDEX_HTML_PATH = path.join(__dirname, 'index.html');
const COMMENTS_DIR = path.join(__dirname, 'comments');
const LOGS_DIR = path.join(__dirname, 'logs');
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';

const PORT = 3001;
const HOST = '127.0.0.1';

function nowIso() {
  return new Date().toISOString();
}

function supabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

async function readJsonBody(req) {
  const raw = await readRequestBody(req);
  return raw ? JSON.parse(raw) : {};
}

async function supabaseRequest(table, { method = 'GET', query = '', body, extraHeaders = {} } = {}) {
  if (!supabaseConfigured()) {
    return { error: 'Supabase no configurado en el server local. Define SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.' };
  }
  const url = `${SUPABASE_URL}/rest/v1/${table}${query}`;
  const headers = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    ...extraHeaders,
  };
  const res = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json().catch(() => null) : await res.text();
  if (!res.ok) {
    const message = typeof data === 'string' ? data : data?.message || data?.error || `${res.status}`;
    return { error: message, status: res.status };
  }
  return { data, headers: res.headers };
}

// ---------- Roadmap parsing ----------
// msds-roadmap.md usa "## Hito X: ..." y "### T-XX: Título" con líneas
// "- **Campo:** valor" y bloques opcionales "- **Checklist:**" seguidos de
// "- [ ] item". El campo Estado en este roadmap NO usa emojis (ej:
// "Completado", "Bloqueante", "Bloqueado", "Planeado", "Futuro").
function parseRoadmap(text) {
  const lines = text.split('\n');
  const tickets = [];
  let current = null;
  let currentHito = null;
  let inVerificacion = false;
  let inChecklist = false;

  const flush = () => {
    if (current) tickets.push(current);
    current = null;
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');

    const hitoMatch = line.match(/^##\s+(Hito.+)$/);
    if (hitoMatch) {
      flush();
      currentHito = hitoMatch[1].trim();
      inVerificacion = false;
      inChecklist = false;
      continue;
    }

    const ticketMatch = line.match(/^###\s+(T-[A-Za-z0-9]+):\s*(.+)$/);
    if (ticketMatch) {
      flush();
      current = {
        id: ticketMatch[1].trim(),
        titulo: ticketMatch[2].trim(),
        hito: currentHito,
        descripcion: '',
        dependencias: [],
        estado: '',
        modelo: '',
        ejecutor: '',
        prioridad: '',
        verificacion: [],
        checklist: [],
      };
      inVerificacion = false;
      inChecklist = false;
      continue;
    }

    if (!current) continue;

    if (/^-\s+\*\*Verificaci[oó]n:\*\*/i.test(line)) {
      inVerificacion = true;
      inChecklist = false;
      continue;
    }
    if (/^-\s+\*\*Checklist:\*\*/i.test(line)) {
      inChecklist = true;
      inVerificacion = false;
      continue;
    }

    const checklistItemMatch = line.match(/^-\s+\[( |x|X)\]\s+(.+)$/);
    if (checklistItemMatch && (inChecklist || true)) {
      current.checklist.push({ done: checklistItemMatch[1].toLowerCase() === 'x', text: checklistItemMatch[2].trim() });
      continue;
    }

    const fieldMatch = line.match(/^-\s+\*\*(.+?):\*\*\s*(.*)$/);
    if (fieldMatch) {
      inVerificacion = false;
      inChecklist = false;
      const key = fieldMatch[1].trim().toLowerCase();
      const val = fieldMatch[2].trim();
      if (key === 'descripción' || key === 'descripcion') current.descripcion = val;
      else if (key === 'dependencias') {
        current.dependencias = val
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s && !/^ninguna$/i.test(s))
          .map((s) => {
            const m = s.match(/T-[A-Za-z0-9]+/);
            return m ? m[0] : s;
          });
      } else if (key === 'estado') current.estado = val;
      else if (key === 'modelo recomendado') current.modelo = val;
      else if (key === 'ejecutor') current.ejecutor = val;
      else if (key === 'prioridad') current.prioridad = val;
      continue;
    }

    if (inVerificacion) {
      const itemMatch = line.match(/^\s*-\s+(.+)$/);
      if (itemMatch) current.verificacion.push(itemMatch[1].trim());
    }
  }
  flush();
  return tickets;
}

function readRoadmapTickets() {
  const text = fs.readFileSync(ROADMAP_PATH, 'utf8');
  return parseRoadmap(text);
}

function classifyEstado(estadoStr) {
  const lower = (estadoStr || '').toLowerCase();
  if (lower.includes('completado')) return 'done';
  if (lower.includes('bloqueante') || lower.includes('bloqueado')) return 'blocked';
  if (lower.includes('curso') || lower.includes('progreso')) return 'doing';
  if (lower.includes('planeado') || lower.includes('futuro')) return 'todo';
  return 'todo';
}

function getTicketsWithDeps() {
  const tickets = readRoadmapTickets();
  const byId = new Map(tickets.map((t) => [t.id, t]));
  return tickets.map((t) => {
    const depsOk = t.dependencias.every((dep) => {
      const dep_t = byId.get(dep);
      return dep_t ? classifyEstado(dep_t.estado) === 'done' : false;
    });
    return { ...t, columna: classifyEstado(t.estado), depsOk };
  });
}

// ---------- Actualizar estado de un ticket en el roadmap ----------
function updateTicketStatus(ticketId, nuevoEstado) {
  const text = fs.readFileSync(ROADMAP_PATH, 'utf8');
  const lines = text.split('\n');
  let inTarget = false;
  let updated = false;

  const out = lines.map((line) => {
    const ticketMatch = line.match(/^###\s+(T-[A-Za-z0-9]+):/);
    if (ticketMatch) {
      inTarget = ticketMatch[1] === ticketId;
      return line;
    }
    if (inTarget) {
      const estadoMatch = line.match(/^(-\s+\*\*Estado:\*\*\s*).*/);
      if (estadoMatch) {
        updated = true;
        return `${estadoMatch[1]}${nuevoEstado}`;
      }
    }
    return line;
  });

  if (!updated) {
    throw new Error(`Ticket ${ticketId} no encontrado o sin línea de Estado en el roadmap`);
  }

  fs.writeFileSync(ROADMAP_PATH, out.join('\n'));
}

// ---------- Reescribir msds-status.md preservando su estructura de tablas por Hito ----------
function rewriteStatusFile() {
  const tickets = getTicketsWithDeps();
  const byHito = new Map();
  for (const t of tickets) {
    const hito = t.hito || 'Sin hito';
    if (!byHito.has(hito)) byHito.set(hito, []);
    byHito.get(hito).push(t);
  }

  // Intentar preservar columnas "Desde"/"Logs"/"Bloqueador" ya existentes por ticket.
  const prevRows = parseStatusRows();

  let body = `## Estado Proyecto MSDS-CRM\n**Última actualización:** ${nowIso()}\n\n`;
  for (const [hito, list] of byHito.entries()) {
    body += `### ${hito}\n`;
    body += `| Ticket | Estado | Desde | Logs | Bloqueador |\n`;
    body += `|--------|--------|-------|------|-----------|\n`;
    for (const t of list) {
      const prev = prevRows[t.id] || {};
      body += `| ${t.id} | ${t.estado} | ${prev.desde || '—'} | ${prev.logs || '—'} | ${prev.bloqueador || '—'} |\n`;
    }
    body += '\n';
  }

  fs.writeFileSync(STATUS_PATH, body.trimEnd() + '\n');
}

function parseStatusRows() {
  if (!fs.existsSync(STATUS_PATH)) return {};
  const text = fs.readFileSync(STATUS_PATH, 'utf8');
  const rows = {};
  const lineRe = /^\|\s*(T-[A-Za-z0-9]+)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|$/;
  for (const line of text.split('\n')) {
    const m = line.match(lineRe);
    if (m) rows[m[1]] = { estado: m[2], desde: m[3], logs: m[4], bloqueador: m[5] };
  }
  return rows;
}

// ---------- Comentarios ----------
function commentsFilePath(ticketId) {
  return path.join(COMMENTS_DIR, `${ticketId}.json`);
}

function readComments(ticketId) {
  const file = commentsFilePath(ticketId);
  if (!fs.existsSync(file)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function appendComment(ticketId, text) {
  const comments = readComments(ticketId);
  const entry = { timestamp: nowIso(), text };
  comments.push(entry);
  if (!fs.existsSync(COMMENTS_DIR)) fs.mkdirSync(COMMENTS_DIR, { recursive: true });
  fs.writeFileSync(commentsFilePath(ticketId), JSON.stringify(comments, null, 2));
  return entry;
}

// ---------- Logs ----------
function readLog(ticketId) {
  const file = path.join(LOGS_DIR, `${ticketId}.log`);
  if (!fs.existsSync(file)) return '';
  return fs.readFileSync(file, 'utf8');
}

function normalizeCliente(cliente) {
  return {
    id: cliente.id,
    tipo: cliente.tipo || 'natural',
    tipo_doc: cliente.tipo_doc || 'CC',
    identificacion: cliente.identificacion || '',
    nombre: cliente.nombre || '',
    primer_apellido: cliente.primer_apellido || '',
    segundo_apellido: cliente.segundo_apellido || '',
    genero: cliente.genero || '',
    estado_civil: cliente.estado_civil || '',
    fecha_nacimiento: cliente.fecha_nacimiento || '',
    telefono: cliente.telefono || '',
    celular: cliente.celular || '',
    correo: cliente.correo || '',
    direccion: cliente.direccion || '',
    municipio: cliente.municipio || '',
    profesion: cliente.profesion || '',
    ocupacion: cliente.ocupacion || '',
    estrato: cliente.estrato ?? '',
    observaciones: cliente.observaciones || '',
    creado_en: cliente.creado_en || '',
  };
}

function normalizeActividad(act) {
  return {
    id: act.id,
    asesor_id: act.asesor_id ?? '',
    cliente_id: act.cliente_id ?? '',
    poliza_id: act.poliza_id ?? '',
    siniestro_id: act.siniestro_id ?? '',
    pendiente_id: act.pendiente_id ?? '',
    clase: act.clase || '',
    descripcion: act.descripcion || '',
    estado: act.estado || 'abierta',
    fecha_inicio: act.fecha_inicio || '',
    fecha_fin: act.fecha_fin || '',
    creado_en: act.creado_en || '',
  };
}

async function listClientes() {
  const result = await supabaseRequest('clientes', {
    query: '?select=*&order=creado_en.desc.nullslast,id.desc&limit=200',
  });
  if (result.error) throw new Error(result.error);
  return Array.isArray(result.data) ? result.data.map(normalizeCliente) : [];
}

async function createCliente(payload) {
  const result = await supabaseRequest('clientes', {
    method: 'POST',
    query: '?select=*',
    body: payload,
    extraHeaders: { Prefer: 'return=representation' },
  });
  if (result.error) throw new Error(result.error);
  return Array.isArray(result.data) ? result.data[0] : result.data;
}

async function updateCliente(id, payload) {
  const result = await supabaseRequest('clientes', {
    method: 'PATCH',
    query: `?id=eq.${encodeURIComponent(id)}&select=*`,
    body: payload,
    extraHeaders: { Prefer: 'return=representation' },
  });
  if (result.error) throw new Error(result.error);
  return Array.isArray(result.data) ? result.data[0] : result.data;
}

async function deleteCliente(id) {
  const result = await supabaseRequest('clientes', {
    method: 'DELETE',
    query: `?id=eq.${encodeURIComponent(id)}`,
    extraHeaders: { Prefer: 'return=minimal' },
  });
  if (result.error) throw new Error(result.error);
  return true;
}

async function getClienteById(id) {
  const result = await supabaseRequest('clientes', {
    query: `?id=eq.${encodeURIComponent(id)}&select=*`,
  });
  if (result.error) throw new Error(result.error);
  if (!Array.isArray(result.data) || !result.data.length) return null;
  return normalizeCliente(result.data[0]);
}

async function listActividades() {
  const result = await supabaseRequest('actividades', {
    query: '?select=*&order=creado_en.desc.nullslast,id.desc&limit=200',
  });
  if (result.error) throw new Error(result.error);
  return Array.isArray(result.data) ? result.data.map(normalizeActividad) : [];
}

async function createActividad(payload) {
  const result = await supabaseRequest('actividades', {
    method: 'POST',
    query: '?select=*',
    body: payload,
    extraHeaders: { Prefer: 'return=representation' },
  });
  if (result.error) throw new Error(result.error);
  return Array.isArray(result.data) ? result.data[0] : result.data;
}

async function updateActividad(id, payload) {
  const result = await supabaseRequest('actividades', {
    method: 'PATCH',
    query: `?id=eq.${encodeURIComponent(id)}&select=*`,
    body: payload,
    extraHeaders: { Prefer: 'return=representation' },
  });
  if (result.error) throw new Error(result.error);
  return Array.isArray(result.data) ? result.data[0] : result.data;
}

async function deleteActividad(id) {
  const result = await supabaseRequest('actividades', {
    method: 'DELETE',
    query: `?id=eq.${encodeURIComponent(id)}`,
    extraHeaders: { Prefer: 'return=minimal' },
  });
  if (result.error) throw new Error(result.error);
  return true;
}

function normalizePoliza(poliza) {
  return {
    id: poliza.id,
    cliente_id: poliza.cliente_id ?? '',
    pagador_id: poliza.pagador_id ?? '',
    vehiculo_id: poliza.vehiculo_id ?? '',
    numero: poliza.numero || '',
    ramo: poliza.ramo || '',
    aseguradora: poliza.aseguradora || '',
    plan: poliza.plan || '',
    modalidad: poliza.modalidad || '',
    sucursal: poliza.sucursal || '',
    municipio_expedicion: poliza.municipio_expedicion || '',
    vigencia_inicial: poliza.vigencia_inicial || '',
    fecha_inicio: poliza.fecha_inicio || '',
    fecha_vencimiento: poliza.fecha_vencimiento || '',
    prima: poliza.prima ?? '',
    estado: poliza.estado || 'vigente',
    creado_en: poliza.creado_en || '',
  };
}

async function listPolizas() {
  const result = await supabaseRequest('polizas', {
    query: '?select=*&order=creado_en.desc.nullslast,id.desc&limit=200',
  });
  if (result.error) throw new Error(result.error);
  return Array.isArray(result.data) ? result.data.map(normalizePoliza) : [];
}

async function createPoliza(payload) {
  const result = await supabaseRequest('polizas', {
    method: 'POST',
    query: '?select=*',
    body: payload,
    extraHeaders: { Prefer: 'return=representation' },
  });
  if (result.error) throw new Error(result.error);
  return Array.isArray(result.data) ? result.data[0] : result.data;
}

async function updatePoliza(id, payload) {
  const result = await supabaseRequest('polizas', {
    method: 'PATCH',
    query: `?id=eq.${encodeURIComponent(id)}&select=*`,
    body: payload,
    extraHeaders: { Prefer: 'return=representation' },
  });
  if (result.error) throw new Error(result.error);
  return Array.isArray(result.data) ? result.data[0] : result.data;
}

async function deletePoliza(id) {
  const result = await supabaseRequest('polizas', {
    method: 'DELETE',
    query: `?id=eq.${encodeURIComponent(id)}`,
    extraHeaders: { Prefer: 'return=minimal' },
  });
  if (result.error) throw new Error(result.error);
  return true;
}

async function getPolizaById(id) {
  const result = await supabaseRequest('polizas', {
    query: `?id=eq.${encodeURIComponent(id)}&select=*`,
  });
  if (result.error) throw new Error(result.error);
  if (!Array.isArray(result.data) || !result.data.length) return null;
  return normalizePoliza(result.data[0]);
}

// ---------- SLA Siniestros ----------
// Umbrales tomados de sla_config (arquitectura/PLAN_ARQUITECTURA_MSDS.md, tipo
// 'siniestro'): alerta a los 15 min, escalar a los 30 min sin atender. La
// tabla sla_config/casos de Milestone A aún no está aplicada en Supabase, así
// que el cálculo se hace en el server contra la tabla siniestros existente.
const SLA_SINIESTRO_ALERTA_MIN = 15;
const SLA_SINIESTRO_ESCALAR_MIN = 30;
const SINIESTRO_ESTADOS_ABIERTOS = new Set(['avisado', 'definido']);

function computeSlaSiniestro(siniestro) {
  const abierto = SINIESTRO_ESTADOS_ABIERTOS.has((siniestro.estado || '').toLowerCase());
  if (!abierto) return { sla: 'cerrado', minutos_transcurridos: null };

  const referencia = siniestro.fecha_notif_asesor || siniestro.fecha_ocurrencia;
  if (!referencia) return { sla: 'sin_datos', minutos_transcurridos: null };

  const ms = Date.now() - new Date(referencia).getTime();
  if (Number.isNaN(ms)) return { sla: 'sin_datos', minutos_transcurridos: null };

  const minutos = Math.max(0, Math.round(ms / 60000));
  let sla = 'ok';
  if (minutos >= SLA_SINIESTRO_ESCALAR_MIN) sla = 'escalado';
  else if (minutos >= SLA_SINIESTRO_ALERTA_MIN) sla = 'alerta';
  return { sla, minutos_transcurridos: minutos };
}

function normalizeSiniestro(s) {
  const { sla, minutos_transcurridos } = computeSlaSiniestro(s);
  return {
    id: s.id,
    poliza_id: s.poliza_id ?? '',
    num_aseguradora: s.num_aseguradora || '',
    asegurado: s.asegurado || '',
    fecha_ocurrencia: s.fecha_ocurrencia || '',
    fecha_notif_asesor: s.fecha_notif_asesor || '',
    fecha_notif_aseguradora: s.fecha_notif_aseguradora || '',
    descripcion: s.descripcion || '',
    estado: s.estado || 'avisado',
    valor_indemnizado: s.valor_indemnizado ?? 0,
    creado_en: s.creado_en || '',
    sla,
    minutos_transcurridos,
  };
}

async function listSiniestros() {
  const result = await supabaseRequest('siniestros', {
    query: '?select=*&order=creado_en.desc.nullslast,id.desc&limit=200',
  });
  if (result.error) throw new Error(result.error);
  return Array.isArray(result.data) ? result.data.map(normalizeSiniestro) : [];
}

async function createSiniestro(payload) {
  const result = await supabaseRequest('siniestros', {
    method: 'POST',
    query: '?select=*',
    body: payload,
    extraHeaders: { Prefer: 'return=representation' },
  });
  if (result.error) throw new Error(result.error);
  const row = Array.isArray(result.data) ? result.data[0] : result.data;
  return row ? normalizeSiniestro(row) : row;
}

async function updateSiniestro(id, payload) {
  const result = await supabaseRequest('siniestros', {
    method: 'PATCH',
    query: `?id=eq.${encodeURIComponent(id)}&select=*`,
    body: payload,
    extraHeaders: { Prefer: 'return=representation' },
  });
  if (result.error) throw new Error(result.error);
  const row = Array.isArray(result.data) ? result.data[0] : result.data;
  return row ? normalizeSiniestro(row) : row;
}

async function deleteSiniestro(id) {
  const result = await supabaseRequest('siniestros', {
    method: 'DELETE',
    query: `?id=eq.${encodeURIComponent(id)}`,
    extraHeaders: { Prefer: 'return=minimal' },
  });
  if (result.error) throw new Error(result.error);
  return true;
}

async function getSiniestroById(id) {
  const result = await supabaseRequest('siniestros', {
    query: `?id=eq.${encodeURIComponent(id)}&select=*`,
  });
  if (result.error) throw new Error(result.error);
  if (!Array.isArray(result.data) || !result.data.length) return null;
  return normalizeSiniestro(result.data[0]);
}

// ---------- Comando sugerido (NO se ejecuta nunca) ----------
function buildSuggestedCommand(ticket) {
  const desc = (ticket.descripcion || ticket.titulo || '').replace(/"/g, '\\"');
  return `claude -p "Ejecutar ticket ${ticket.id} de MSDS-CRM: ${desc}. Contexto en tools/msds-dashboard/msds-roadmap.md"`;
}

// ---------- HTTP helpers ----------
function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

function sendError(res, status, message) {
  sendJson(res, status, { error: message });
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function findTicket(ticketId) {
  const tickets = getTicketsWithDeps();
  return tickets.find((t) => t.id === ticketId);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${HOST}`);
    const { pathname } = url;
    const method = req.method;

    if (method === 'GET' && (pathname === '/' || pathname === '/index.html')) {
      const html = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }

    if (method === 'GET' && pathname === '/api/tickets') {
      return sendJson(res, 200, getTicketsWithDeps());
    }

    if (pathname === '/api/clientes' && method === 'GET') {
      try {
        return sendJson(res, 200, await listClientes());
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }
    if (pathname === '/api/clientes' && method === 'POST') {
      try {
        const body = await readJsonBody(req);
        if (!body.nombre) return sendError(res, 400, 'Falta "nombre"');
        const created = await createCliente(body);
        return sendJson(res, 200, created);
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }

    if (pathname === '/api/actividades' && method === 'GET') {
      try {
        return sendJson(res, 200, await listActividades());
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }
    if (pathname === '/api/actividades' && method === 'POST') {
      try {
        const body = await readJsonBody(req);
        if (!body.cliente_id) return sendError(res, 400, 'Falta "cliente_id"');
        const created = await createActividad(body);
        return sendJson(res, 200, created);
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }

    let actividadMatch = pathname.match(/^\/api\/actividades\/([^/]+)$/);
    if (actividadMatch && method === 'GET') {
      try {
        const id = decodeURIComponent(actividadMatch[1]);
        const rows = await listActividades();
        const actividad = rows.find((a) => String(a.id) === String(id));
        if (!actividad) return sendError(res, 404, 'Actividad no encontrada');
        return sendJson(res, 200, actividad);
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }
    if (actividadMatch && method === 'PATCH') {
      try {
        const id = decodeURIComponent(actividadMatch[1]);
        const body = await readJsonBody(req);
        const updated = await updateActividad(id, body);
        return sendJson(res, 200, updated);
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }
    if (actividadMatch && method === 'DELETE') {
      try {
        await deleteActividad(decodeURIComponent(actividadMatch[1]));
        return sendJson(res, 200, { ok: true });
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }

    let clienteMatch = pathname.match(/^\/api\/clientes\/([^/]+)$/);
    if (clienteMatch && method === 'GET') {
      try {
        const cliente = await getClienteById(decodeURIComponent(clienteMatch[1]));
        if (!cliente) return sendError(res, 404, 'Cliente no encontrado');
        return sendJson(res, 200, cliente);
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }
    if (clienteMatch && method === 'PATCH') {
      try {
        const body = await readJsonBody(req);
        const updated = await updateCliente(decodeURIComponent(clienteMatch[1]), body);
        return sendJson(res, 200, updated);
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }
    if (clienteMatch && method === 'DELETE') {
      try {
        await deleteCliente(decodeURIComponent(clienteMatch[1]));
        return sendJson(res, 200, { ok: true });
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }

    if (pathname === '/api/polizas' && method === 'GET') {
      try {
        return sendJson(res, 200, await listPolizas());
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }
    if (pathname === '/api/polizas' && method === 'POST') {
      try {
        const body = await readJsonBody(req);
        if (!body.ramo) return sendError(res, 400, 'Falta "ramo"');
        const created = await createPoliza(body);
        return sendJson(res, 200, created);
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }

    let polizaMatch = pathname.match(/^\/api\/polizas\/([^/]+)$/);
    if (polizaMatch && method === 'GET') {
      try {
        const poliza = await getPolizaById(decodeURIComponent(polizaMatch[1]));
        if (!poliza) return sendError(res, 404, 'Póliza no encontrada');
        return sendJson(res, 200, poliza);
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }
    if (polizaMatch && method === 'PATCH') {
      try {
        const body = await readJsonBody(req);
        const updated = await updatePoliza(decodeURIComponent(polizaMatch[1]), body);
        return sendJson(res, 200, updated);
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }
    if (polizaMatch && method === 'DELETE') {
      try {
        await deletePoliza(decodeURIComponent(polizaMatch[1]));
        return sendJson(res, 200, { ok: true });
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }

    if (pathname === '/api/siniestros' && method === 'GET') {
      try {
        return sendJson(res, 200, await listSiniestros());
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }
    if (pathname === '/api/siniestros' && method === 'POST') {
      try {
        const body = await readJsonBody(req);
        if (!body.poliza_id) return sendError(res, 400, 'Falta "poliza_id"');
        const created = await createSiniestro(body);
        return sendJson(res, 200, created);
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }

    let siniestroMatch = pathname.match(/^\/api\/siniestros\/([^/]+)$/);
    if (siniestroMatch && method === 'GET') {
      try {
        const siniestro = await getSiniestroById(decodeURIComponent(siniestroMatch[1]));
        if (!siniestro) return sendError(res, 404, 'Siniestro no encontrado');
        return sendJson(res, 200, siniestro);
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }
    if (siniestroMatch && method === 'PATCH') {
      try {
        const body = await readJsonBody(req);
        const updated = await updateSiniestro(decodeURIComponent(siniestroMatch[1]), body);
        return sendJson(res, 200, updated);
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }
    if (siniestroMatch && method === 'DELETE') {
      try {
        await deleteSiniestro(decodeURIComponent(siniestroMatch[1]));
        return sendJson(res, 200, { ok: true });
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }

    let m = pathname.match(/^\/api\/tickets\/([^/]+)\/status$/);
    if (m && method === 'POST') {
      const ticketId = decodeURIComponent(m[1]);
      const body = JSON.parse((await readRequestBody(req)) || '{}');
      const nuevoEstado = body.estado;
      if (!nuevoEstado) return sendError(res, 400, 'Falta "estado" en el body');
      updateTicketStatus(ticketId, nuevoEstado);
      rewriteStatusFile();
      return sendJson(res, 200, { ok: true, ticketId, estado: nuevoEstado });
    }

    m = pathname.match(/^\/api\/tickets\/([^/]+)\/comments$/);
    if (m && method === 'GET') {
      const ticketId = decodeURIComponent(m[1]);
      return sendJson(res, 200, readComments(ticketId));
    }
    if (m && method === 'POST') {
      const ticketId = decodeURIComponent(m[1]);
      const body = JSON.parse((await readRequestBody(req)) || '{}');
      if (!body.text) return sendError(res, 400, 'Falta "text" en el body');
      const entry = appendComment(ticketId, body.text);
      return sendJson(res, 200, entry);
    }

    m = pathname.match(/^\/api\/tickets\/([^/]+)\/logs$/);
    if (m && method === 'GET') {
      const ticketId = decodeURIComponent(m[1]);
      return sendJson(res, 200, { text: readLog(ticketId) });
    }

    m = pathname.match(/^\/api\/tickets\/([^/]+)\/command$/);
    if (m && method === 'POST') {
      const ticketId = decodeURIComponent(m[1]);
      const ticket = findTicket(ticketId);
      if (!ticket) return sendError(res, 404, `Ticket ${ticketId} no encontrado`);
      return sendJson(res, 200, { command: buildSuggestedCommand(ticket) });
    }

    if (pathname === '/api/casos' && method === 'POST') {
      try {
        const body = await readJsonBody(req);
        const result = await supabaseRequest('casos', { method: 'POST', body });
        if (result.error) return sendError(res, 400, result.error);
        return sendJson(res, 201, result.data?.[0] || result.data || { ok: true });
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }

    if (pathname === '/api/casos' && method === 'GET') {
      try {
        const result = await supabaseRequest('casos', { query: '?select=*' });
        if (result.error) return sendError(res, 400, result.error);
        return sendJson(res, 200, result.data || []);
      } catch (err) {
        return sendError(res, 500, String((err && err.message) || err));
      }
    }

    sendError(res, 404, 'Ruta no encontrada');
  } catch (err) {
    sendError(res, 500, String((err && err.message) || err));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Dashboard corriendo en http://${HOST}:${PORT}`);
});
