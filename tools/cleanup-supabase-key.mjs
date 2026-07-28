#!/usr/bin/env node
/**
 * Buscar key Supabase vieja en código
 * Key vieja: revocada en Supabase (2026-07).
 * Pasa el valor a buscar por env: OLD_KEY=... node cleanup-supabase-key.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OLD_KEY = process.env.OLD_KEY;
if (!OLD_KEY) {
  console.error('Define OLD_KEY en el entorno. Ej: OLD_KEY=sb_secret_xxx node tools/cleanup-supabase-key.mjs');
  process.exit(1);
}
const SEARCH_DIRS = [
  path.resolve(__dirname, '../proyectos/multiseguros'),
  path.resolve(__dirname, '../herramientas'),
  path.resolve(__dirname, '../tools')
];

const EXTENSIONS = ['.md', '.js', '.html', '.ts', '.json'];

console.log(`🔍 Buscando key vieja: ${OLD_KEY.substring(0, 20)}...\n`);

function searchDirectory(dir) {
  let found = [];

  try {
    const files = fs.readdirSync(dir, { recursive: true });

    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isFile()) {
        const ext = path.extname(file);
        if (!EXTENSIONS.includes(ext)) return;

        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes(OLD_KEY)) {
            found.push({
              file: fullPath.replace(process.env.HOME || '', '~'),
              lines: content.split('\n').reduce((acc, line, idx) => {
                if (line.includes(OLD_KEY)) acc.push(idx + 1);
                return acc;
              }, [])
            });
          }
        } catch (e) {
          // skip unreadable
        }
      }
    });
  } catch (e) {
    console.warn(`⚠️ Error reading ${dir}: ${e.message}`);
  }

  return found;
}

console.log(`[1/3] Buscando en directorios...\n`);
let allFound = [];
SEARCH_DIRS.forEach(dir => {
  allFound = allFound.concat(searchDirectory(dir));
});

if (allFound.length === 0) {
  console.log(`✅ NO encontrada key vieja en código local.\n`);
} else {
  console.log(`⚠️ ENCONTRADA en ${allFound.length} archivo(s):\n`);
  allFound.forEach(item => {
    console.log(`  📄 ${item.file}`);
    console.log(`     Líneas: ${item.lines.join(', ')}`);
    console.log(``);
  });
}

console.log(`[2/3] Estado Supabase:`);
console.log(`  • Key vieja: REVOCADA (no intentes usar)`);
console.log(`  • Dashboard: https://supabase.com/dashboard/project/ejaxtfqwhgppgdglxmkt/settings/api\n`);

console.log(`[3/3] Próximos pasos:`);
console.log(`  1. Obtener nueva key de Supabase dashboard (Settings → API → service_role)`);
console.log(`  2. Guardar en Bitwarden: "MSDS Supabase service_role — ACTIVA [date]"`);
console.log(`  3. Actualizar gerencia.html línea 981 con nueva key`);
console.log(`  4. Actualizar n8n workflows (todos HTTP Request nodes con apikey header)`);
console.log(`  5. Verificar: curl -H "apikey: [NEW_KEY]" https://ejaxtfqwhgppgdglxmkt.supabase.co/rest/v1/asesores?limit=1\n`);

console.log(`✅ Script complete.`);
