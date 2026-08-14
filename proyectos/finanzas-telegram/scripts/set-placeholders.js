#!/usr/bin/env node
'use strict';

/**
 * Reemplaza los marcadores de los workflows antes de importarlos a n8n.
 *
 * Los JSON versionados llevan marcadores en vez de IDs reales, para que el
 * repo sea portable entre instancias y no arrastre nada de un entorno a otro.
 *
 * Marcadores:
 *   __GOOGLE_SHEETS_DOCUMENT_ID__   <- .env GOOGLE_SHEETS_DOCUMENT_ID
 *   __WF02_ID__ … __WF07_ID__       <- IDs que n8n asigna al importar
 *
 * Uso:
 *   node scripts/set-placeholders.js                 # escribe en n8n/dist/
 *   node scripts/set-placeholders.js --check         # solo reporta, no escribe
 *
 * Los IDs de subworkflow se resuelven consultando la API de n8n por nombre.
 * Si un workflow aun no existe alla, su marcador se deja intacto y se avisa.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'n8n', 'workflows');
const OUT = path.join(ROOT, 'n8n', 'dist');
const CHECK_ONLY = process.argv.includes('--check');

// Marcador -> nombre exacto del workflow en n8n.
const WF_NAMES = {
  __WF02_ID__: 'FIN — Interpretar Movimiento',
  __WF03_ID__: 'FIN — Procesar Factura',
  __WF04_ID__: 'FIN — Registrar Movimiento',
  __WF05_ID__: 'FIN — Consultas',
  __WF06_ID__: 'FIN — Correcciones',
  __WF07_ID__: 'FIN — Programados',
};

/** Lee .env sin dependencias. Ignora comentarios y lineas vacias. */
function loadEnv() {
  const f = path.join(ROOT, '.env');
  if (!fs.existsSync(f)) return {};
  const env = {};
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return env;
}

function getJson(url, apiKey) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const lib = u.protocol === 'http:' ? http : https;
    const req = lib.request(
      {
        hostname: u.hostname,
        port: u.port || (u.protocol === 'http:' ? 80 : 443),
        path: u.pathname + u.search,
        method: 'GET',
        headers: { 'X-N8N-API-KEY': apiKey, Accept: 'application/json' },
        timeout: 60000,
      },
      (res) => {
        let d = '';
        res.on('data', (c) => (d += c));
        res.on('end', () => {
          if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
          try { resolve(JSON.parse(d)); } catch (e) { reject(e); }
        });
      }
    );
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    req.end();
  });
}

async function resolveWorkflowIds(env) {
  const ids = {};
  if (!env.N8N_API_KEY || !env.N8N_API_URL) {
    console.log('  (sin N8N_API_KEY/N8N_API_URL: no se resuelven IDs de subworkflow)');
    return ids;
  }
  try {
    const res = await getJson(`${env.N8N_API_URL}/workflows?limit=250`, env.N8N_API_KEY);
    const byName = new Map((res.data || []).map((w) => [w.name, w.id]));
    for (const [marker, name] of Object.entries(WF_NAMES)) {
      if (byName.has(name)) ids[marker] = byName.get(name);
    }
  } catch (e) {
    console.log(`  (no se pudo consultar la API de n8n: ${e.message})`);
  }
  return ids;
}

async function main() {
  if (!fs.existsSync(SRC)) {
    console.log('No existe n8n/workflows/ — nada que hacer.');
    process.exit(0);
  }

  const env = loadEnv();
  const sheetId = env.GOOGLE_SHEETS_DOCUMENT_ID || '';

  console.log('Resolviendo marcadores…');
  if (!sheetId) {
    console.log('  AVISO: GOOGLE_SHEETS_DOCUMENT_ID vacio en .env — el marcador queda sin resolver');
  }
  const wfIds = await resolveWorkflowIds(env);
  for (const [m, id] of Object.entries(wfIds)) console.log(`  ${m} -> ${id}`);

  const replacements = { ...wfIds };
  if (sheetId) replacements.__GOOGLE_SHEETS_DOCUMENT_ID__ = sheetId;

  const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.json')).sort();
  if (!CHECK_ONLY) fs.mkdirSync(OUT, { recursive: true });

  let pendientes = 0;
  console.log('');

  for (const f of files) {
    let raw = fs.readFileSync(path.join(SRC, f), 'utf8');
    let hechos = 0;
    for (const [marker, value] of Object.entries(replacements)) {
      const n = raw.split(marker).length - 1;
      if (n > 0) {
        raw = raw.split(marker).join(value);
        hechos += n;
      }
    }
    const restantes = (raw.match(/__[A-Z0-9_]+__/g) || []);
    pendientes += restantes.length;

    if (!CHECK_ONLY) fs.writeFileSync(path.join(OUT, f), raw);

    const aviso = restantes.length
      ? `  PENDIENTES: ${[...new Set(restantes)].join(', ')}`
      : '';
    console.log(`  ${f.padEnd(34)} ${String(hechos).padStart(2)} reemplazos${aviso}`);
  }

  console.log('');
  if (CHECK_ONLY) {
    console.log(`Modo --check: no se escribio nada. Marcadores sin resolver: ${pendientes}`);
  } else {
    console.log(`Escritos en n8n/dist/ — importar DESDE AHI, no desde n8n/workflows/.`);
    console.log(`Marcadores sin resolver: ${pendientes}`);
  }
  if (pendientes > 0) {
    console.log('\nLos marcadores de subworkflow se resuelven despues de importar');
    console.log('esos workflows: n8n asigna el ID en ese momento. Volve a correr esto.');
  }
  process.exit(0);
}

main();
