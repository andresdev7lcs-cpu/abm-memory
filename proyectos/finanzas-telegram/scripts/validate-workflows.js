#!/usr/bin/env node
'use strict';

/**
 * Valida los workflows exportados de n8n antes de versionarlos.
 *
 * Falla (exit 1) si encuentra un secreto o una fuga de credencial.
 * Advierte (exit 0) si encuentra un nodo fuera de la lista blanca.
 *
 * Uso:  node scripts/validate-workflows.js [carpeta]
 * Por defecto revisa n8n/workflows/ relativo a la raiz del proyecto.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGET_DIR = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.join(ROOT, 'n8n', 'workflows');

// --- Patrones de secreto. NUNCA se imprime el valor completo. ---
const SECRET_PATTERNS = [
  { name: 'token de bot de Telegram', re: /[0-9]{8,10}:AA[A-Za-z0-9_-]{33}/g },
  { name: 'API key estilo OpenAI', re: /\bsk-[A-Za-z0-9_-]{20,}/g },
  { name: 'API key de Google', re: /\bAIza[A-Za-z0-9_-]{35}/g },
  { name: 'clave privada PEM', re: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/g },
  { name: 'client_secret de Google', re: /\bGOCSPX-[A-Za-z0-9_-]{20,}/g },
];

// Nodos oficiales permitidos (DEC-015: sin nodos de comunidad).
const ALLOWED_NODES = new Set([
  'webhook', 'httpRequest', 'code', 'switch', 'if', 'set', 'merge',
  'googleSheets', 'googleDrive', 'telegram', 'executeWorkflow',
  'scheduleTrigger', 'errorTrigger', 'crypto', 'wait', 'noOp',
  'stickyNote', 'executeWorkflowTrigger', 'respondToWebhook', 'filter',
  'splitInBatches', 'dateTime', 'itemLists', 'removeDuplicates', 'sort',
  'aggregate', 'splitOut', 'limit',
]);

const NAME_PREFIXES = ['FIN — ', 'SYS — '];

const errors = [];
const warnings = [];

/** Enmascara un hallazgo: solo prefijo y longitud, jamas el valor. */
function mask(value) {
  return `${value.slice(0, 4)}…(${value.length} chars)`;
}

/** Numero de linea 1-indexado de un offset dentro del texto. */
function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

function scanSecrets(file, raw) {
  for (const { name, re } of SECRET_PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(raw)) !== null) {
      errors.push(
        `${file}:${lineOf(raw, m.index)} — posible ${name}: ${mask(m[0])}`
      );
    }
  }
}

/**
 * Una credencial exportada solo debe traer { id, name }.
 * Cualquier clave extra significa que el export arrastro el valor real.
 */
function scanCredentialLeaks(file, wf) {
  for (const node of wf.nodes || []) {
    if (!node.credentials) continue;
    for (const [credType, cred] of Object.entries(node.credentials)) {
      if (cred === null || typeof cred !== 'object') continue;
      const extra = Object.keys(cred).filter((k) => k !== 'id' && k !== 'name');
      if (extra.length > 0) {
        errors.push(
          `${file} — nodo "${node.name}" credencial "${credType}" trae claves ` +
          `no permitidas: ${extra.join(', ')} (fuga de credencial)`
        );
      }
    }
  }
}

function scanNodeTypes(file, wf) {
  for (const node of wf.nodes || []) {
    const type = node.type || '';
    if (type.startsWith('n8n-nodes-base.')) {
      const short = type.slice('n8n-nodes-base.'.length);
      if (!ALLOWED_NODES.has(short)) {
        warnings.push(`${file} — nodo "${node.name}" usa "${type}" (fuera de la lista blanca)`);
      }
    } else if (type.startsWith('@n8n/')) {
      warnings.push(`${file} — nodo "${node.name}" usa "${type}" (paquete extra, revisar)`);
    } else if (type) {
      errors.push(`${file} — nodo "${node.name}" usa "${type}" (nodo de comunidad, prohibido por DEC-015)`);
    }
  }
}

function scanStructure(file, wf) {
  for (const key of ['name', 'nodes', 'connections']) {
    if (!(key in wf)) {
      errors.push(`${file} — falta la clave obligatoria "${key}"`);
    }
  }
  if (wf.name && !NAME_PREFIXES.some((p) => wf.name.startsWith(p))) {
    errors.push(
      `${file} — el nombre "${wf.name}" no empieza por "FIN — " ni "SYS — " ` +
      `(DEC-013: aislamiento en la instancia compartida)`
    );
  }
  if (Array.isArray(wf.nodes) && wf.nodes.length === 0) {
    warnings.push(`${file} — workflow sin nodos`);
  }
  // Los IDs de nodo deben ser unicos: n8n los usa en connections.
  const seen = new Set();
  for (const node of wf.nodes || []) {
    if (node.id && seen.has(node.id)) {
      errors.push(`${file} — id de nodo duplicado: ${node.id}`);
    }
    if (node.id) seen.add(node.id);
  }

  // connections referencia nodos POR NOMBRE. Un nombre mal escrito no da
  // error al importar: la rama simplemente no se ejecuta nunca. Es el fallo
  // mas caro de diagnosticar, asi que se verifica aqui.
  const names = new Set((wf.nodes || []).map((n) => n.name));
  const conectados = new Set();
  for (const [origen, salidas] of Object.entries(wf.connections || {})) {
    if (!names.has(origen)) {
      errors.push(`${file} — connections tiene un origen inexistente: "${origen}"`);
    }
    for (const rama of Object.values(salidas || {})) {
      for (const salida of rama || []) {
        for (const destino of salida || []) {
          if (!names.has(destino.node)) {
            errors.push(
              `${file} — "${origen}" conecta a un nodo inexistente: "${destino.node}"`
            );
          }
          conectados.add(destino.node);
        }
      }
    }
  }

  // Un nodo sin entradas ni salidas casi siempre es un olvido.
  const TRIGGERS = /(trigger|webhook|stickyNote)/i;
  for (const node of wf.nodes || []) {
    const esTrigger = TRIGGERS.test(node.type || '');
    const tieneSalida = Object.prototype.hasOwnProperty.call(wf.connections || {}, node.name);
    if (!esTrigger && !conectados.has(node.name) && !tieneSalida) {
      warnings.push(`${file} — nodo "${node.name}" esta suelto (sin entradas ni salidas)`);
    }
  }
}

function main() {
  if (!fs.existsSync(TARGET_DIR)) {
    console.log(`sin workflows aun — no existe ${path.relative(ROOT, TARGET_DIR)}`);
    process.exit(0);
  }

  const files = fs.readdirSync(TARGET_DIR).filter((f) => f.endsWith('.json')).sort();

  if (files.length === 0) {
    console.log('sin workflows aun — la carpeta esta vacia');
    process.exit(0);
  }

  console.log(`Revisando ${files.length} workflow(s) en ${path.relative(ROOT, TARGET_DIR)}/\n`);

  for (const f of files) {
    const full = path.join(TARGET_DIR, f);
    const raw = fs.readFileSync(full, 'utf8');

    // El scan de secretos corre sobre el texto crudo: atrapa tambien
    // lo que este dentro de expresiones o de nodos Code.
    scanSecrets(f, raw);

    let wf;
    try {
      wf = JSON.parse(raw);
    } catch (e) {
      errors.push(`${f} — JSON invalido: ${e.message}`);
      continue;
    }

    scanStructure(f, wf);
    scanCredentialLeaks(f, wf);
    scanNodeTypes(f, wf);

    const nodeCount = (wf.nodes || []).length;
    console.log(`  ${f.padEnd(34)} ${String(nodeCount).padStart(3)} nodos  ${wf.name || '(sin nombre)'}`);
  }

  console.log('');
  for (const w of warnings) console.log(`  ADVERTENCIA  ${w}`);
  for (const e of errors) console.log(`  ERROR        ${e}`);

  console.log(
    `\nArchivos: ${files.length}  |  Errores: ${errors.length}  |  Advertencias: ${warnings.length}`
  );

  if (errors.length > 0) {
    console.log('\nNO versionar estos archivos hasta corregir los errores.');
    process.exit(1);
  }
  console.log('\nOK — sin secretos ni fugas de credencial.');
  process.exit(0);
}

main();
