-- SCHEMA: AndyBot Historia + Misión + Skills
-- Proyecto: andybot-memory (lddkqfgpjjuxkccjfjud)
-- Generado: 2026-06-22

-- ═══════════════════════════════════════
-- BLOQUE 1 — TABLA HISTORIA
-- ═══════════════════════════════════════

CREATE TABLE IF NOT EXISTS historia (
  id uuid default gen_random_uuid() primary key,
  fecha date,
  hito text not null,
  contexto text,
  aprendizaje text,
  proyecto text default 'MSDS-CRM',
  categoria text
);

INSERT INTO historia (fecha, hito, contexto, aprendizaje, categoria) VALUES

('2026-05-01','Inicio del proyecto MSDS-CRM',
'Cliente: Multiseguros del Sur. Intermediario de seguros en Neiva. Stack inicial: Airtable + n8n + Telegram. Objetivo: reemplazar AIS/Celer con solución propia mobile-first con AI.',
'El diferenciador vs Celer es mobile-first + AI + Telegram. No competir en features sino en experiencia.','origen'),

('2026-05-15','Decisión de arquitectura: OpenAI sobre Claude API',
'GPT-4o-mini para agentes operativos por costo. Claude/Fable queda como cerebro estratégico. Codex para código pesado. CC para operaciones de archivo.',
'Separar cerebros por función reduce costos sin sacrificar calidad.','decision'),

('2026-06-10','Demo con gerente de MSDS',
'Primera validación real del MVP. Stack: Airtable + n8n + HTML. P4 operativo. El cliente validó la dirección.',
'La demo fue el punto de inflexión. Validar antes de construir todo.','cliente'),

('2026-06-15','Migración de Airtable a Supabase',
'523 de 531 clientes migrados via Python. Schema 7 tablas diseñado analizando 13 screenshots del sistema Celer. Todo en español.',
'Supabase da control total y costo cero. La migración Python fue la forma más limpia.','tecnico'),

('2026-06-19','Separación de bots: AndyBot vs SCMSDS_bot',
'SCMSDS_bot (cliente) tenía el system prompt de AndyBot (personal). Riesgo operativo y de seguridad. Se separaron con credenciales distintas en n8n.',
'Nunca mezclar contexto personal con contexto de cliente en el mismo bot.','decision'),

('2026-06-20','P4 Asistente Urgencias operativo end-to-end',
'Flujo: siniestro → Supabase → Telegram gerente. JWTs hardcodeados eliminados. Credenciales en n8n nativo.',
'n8n 2.8.3 bloquea $env en nodos Code. Solución: nodos HTTP Request nativos con credencial httpHeaderAuth.','tecnico'),

('2026-06-21','AndyBot conectado a Supabase como cerebro',
'Migrado contexto de GitHub (fallido por tamaño) a Supabase personal andybot-memory. 4 tablas: proyectos, tareas, decisiones, glosario.',
'GitHub no es para inyectar contexto dinámico. Supabase es la solución correcta para memoria operativa de bots.','tecnico');

INSERT INTO historia (fecha, hito, contexto, aprendizaje, proyecto, categoria) VALUES

('2026-06-17','Onboarding cliente Modutriplex',
'Maderas y paneles CNC en Bogotá. Landing page estilo Magnific.com con cotizador dinámico. Mascota Triplo (castor). Fase 2: optimizador corte 2D. Fase 3: agente de voz.',
'El cotizador es el diferenciador. Sin precio visible hasta completar el flujo.','Modutriplex','cliente'),

('2026-06-10','Proyecto IMASAS — laboratorio ambiental Neiva',
'WordPress en Hostinger VPS. Problema principal: imágenes base64 como LCP issue. Bloqueador: posicionamiento ONAC/IDEAM sin resolver.',
'La certificación es el diferenciador pero era un bloqueador no resuelto al momento del brief.','IMASAS','cliente');

-- ═══════════════════════════════════════
-- BLOQUE 2 — TABLA MISION
-- ═══════════════════════════════════════

CREATE TABLE IF NOT EXISTS mision (
  id uuid default gen_random_uuid() primary key,
  categoria text not null,
  titulo text not null,
  contenido text not null
);

INSERT INTO mision (categoria, titulo, contenido) VALUES

('empresa','Nombre y marca',
'7Lilies Consulting Solutions (7LCS). Consultoría de marketing y automatización AI para pymes en Colombia. Fundador: Andrés Palomares. Base: Neiva, Huila. Web: 7liliescs.com'),

('empresa','Propuesta de valor',
'Construimos CRMs, automatizaciones y agentes AI para pequeñas y medianas empresas colombianas que no pueden pagar soluciones enterprise. Stack ligero, costo bajo, resultados reales. Posicionamiento: mobile-first + AI + Telegram vs. sistemas legacy como Celer/AIS.'),

('empresa','Modelo de negocio',
'Contratos de implementación (proyecto) + contratos anuales de mantenimiento. Clientes actuales: MSDS (seguros), Modutriplex (maderas CNC), IMASAS (laboratorio ambiental). Pipeline: SMBs en Neiva y Colombia con procesos manuales repetitivos.'),

('empresa','Stack estándar de delivery',
'Supabase (base de datos), n8n self-hosted en Easypanel/Hostinger VPS (automatización), Telegram (notificaciones y bots de cliente), OpenAI GPT-4o-mini (AI agentes), HTML/CSS/JS vanilla (frontends), Python (scripts de migración y datos), GitHub privado (control de versiones).'),

('metodologia','Sistema ABM',
'AndyBot Memory — sistema de archivos markdown en /Users/work945/Documents/Proyectos/ABM/ con estructura estándar por proyecto: ESTADO.md, DECISIONES.md, DUDAS.md, BITACORA.md, MISE_EN_PLACE.md, CREDENCIALES.md. Versionado en GitHub privado: andresdev7lcs-cpu/abm-memory.'),

('metodologia','Sistema de cerebros AI',
'Tres cerebros: (1) Claude/Fable — estrategia, arquitectura, decisiones complejas. (2) CC/Claude Code en VSCode — operaciones de archivo, deploy, n8n UI via terminal. (3) Codex — código pesado aislado, JSONs de workflows, scripts. Regla: cada cerebro tiene su rol, no se mezclan.'),

('metodologia','Flujo de onboarding de cliente',
'1. Pre-meeting brief con CC. 2. Propuesta comercial en 3 tiers. 3. Análisis del stack existente del cliente. 4. Diseño de schema Supabase. 5. Migración de datos. 6. Construcción de workflows n8n. 7. Demo con cliente. 8. Contrato anual de mantenimiento.'),

('metodologia','Principios de arquitectura',
'(1) Credenciales nunca hardcodeadas en JSONs — siempre en n8n credentials o Bitwarden. (2) Sin portal de clientes — asesor gestiona todo. (3) Dashboard polling cada 60s sin websockets. (4) Nombres de tablas y columnas en español. (5) UI: dark mode, Inter font, accent #3d8ef0, sin emojis ni gradientes, max 3 acciones visibles por pantalla.'),

('posicionamiento','Competencia y diferenciación',
'Competencia directa: Celer/AIS Cloud (legacy, desktop, sin AI, cara). Nuestra ventaja: mobile-first, Telegram nativo, AI integrada, costo 10x menor, personalización total, soporte cercano en Neiva. No competimos en features — competimos en experiencia y velocidad.'),

('posicionamiento','Clientes objetivo',
'Pymes colombianas con 5-50 empleados, procesos manuales repetitivos, sin departamento de IT, que usan WhatsApp como CRM. Sectores prioritarios: seguros, salud, servicios profesionales, manufactura local.'),

('metodologia','Sistema de skills — Biblioteca USB',
'Skills disponibles en /Volumes/Samsung USB/.claude-global/skills/. Categorías: WEB (web-rebuilder, seo-optimizer, scroll-video), N8N (7 skills vía plugin n8n-mcp-skills), MARKETING (email-sequences-copy, landing-page-copy, social-media-copy + 8 por crear). El director.md orquesta cuál activar por contexto.'),

('metodologia','Skill nuevo-proyecto',
'Intake en 2 intercambios: nombre, tipo (web/n8n/app/mixto), integraciones, objetivo, stack BD. Despliega recursos desde biblioteca USB según tipo. Finaliza con plan de 5 puntos y primer paso concreto.'),

('metodologia','Skill nuevo-cliente',
'5 preguntas: nombre, tipo, integraciones, objetivo, stack BD. Crea estructura en /Volumes/Samsung USB/Clientes/[Nombre]/ con memory/ (8 archivos), .claude/settings.json, CLAUDE.md por tipo de proyecto.'),

('metodologia','Flujo ABM — capacidades y límites de AndyBot',
'Andy SÍ puede: consulta por voz/texto vía Telegram, recordar estado proyectos, listar tareas, traducir términos, interpretar imágenes, primeras ideas para prospectos, sugerir flujos reutilizables. Andy NO puede: escribir código complejo (CC), depurar n8n (Codex/Fable), decidir arquitectura (Fable), auto-mejorarse. La biblioteca crece manualmente, Andy la lee.');

-- ═══════════════════════════════════════
-- BLOQUE 3 — TABLA SKILLS
-- ═══════════════════════════════════════

CREATE TABLE IF NOT EXISTS skills (
  id uuid default gen_random_uuid() primary key,
  area text not null,
  skill text not null,
  nivel text default 'operativo',
  notas text,
  fuente text
);

INSERT INTO skills (area, skill, nivel, notas, fuente) VALUES

('n8n','Workflows HTTP Request nativos','experto',
'Usar nodos HTTP Request en lugar de Code para llamadas API. Evita $env bloqueado en 2.8.3. Credencial httpHeaderAuth con header apikey adicional para Supabase.','MSDS sesión 2026-06-20'),

('n8n','Nodo Aggregate para arrays','experto',
'Reemplaza Set node para consolidar items de HTTP Response en array real. Parámetro: aggregateAllItemData con destinationFieldName.','MSDS sesión 2026-06-20'),

('n8n','Telegram Trigger en producción','operativo',
'No se puede testear con el workflow publicado — desactivar para test, publicar para producción. Limitación conocida de n8n.','MSDS sesión 2026-06-20'),

('n8n','IF node boolean en typeVersion 2.2','experto',
'operator: boolean + operation: equals + rightValue: true. La operation: true falla silenciosamente.','MSDS sesión anterior'),

('n8n','Importar workflows y reasignar credenciales','operativo',
'Credenciales siempre se pierden al importar JSON. Hay que reasignar manualmente nodo por nodo. Nunca poner credenciales en el JSON.','MSDS múltiples sesiones'),

('n8n','Plugin n8n-mcp-skills','operativo',
'7 skills técnicas disponibles: workflow-patterns, expression-syntax, node-configuration, validation-expert, code-javascript, code-python, tools-expert. Activar en .claude/settings.json del proyecto n8n.','director.md biblioteca USB'),

('supabase','REST API con apikey dual','experto',
'Supabase requiere dos headers: Authorization: Bearer <key> Y apikey: <key>. Sin el segundo da 401 aunque el primero esté correcto.','MSDS sesión 2026-06-20'),

('supabase','Migración masiva con Python','operativo',
'Script Python con paginación de Airtable + INSERT batch a Supabase. 523 clientes migrados. Manejo de campos nulos y tipos.','MSDS sesión 2026-06-15'),

('supabase','Secret keys vs Legacy keys','operativo',
'Supabase nuevo sistema: Publishable key (antes anon) + Secret key (antes service_role). Las legacy siguen funcionando pero no se pueden revocar individualmente.','MSDS sesión 2026-06-21'),

('seguridad','Credenciales en Bitwarden','experto',
'Todo va a Bitwarden: tokens API, keys Supabase, tokens Telegram. Nunca en .env commiteado, nunca en JSONs de workflow, nunca en código.','Política 7LCS'),

('seguridad','Git y archivos sensibles','experto',
'.gitignore estándar: CREDENCIALES.md, .env, *_keys.*, *.env, .DS_Store, __pycache__/, *secret*, *password*. Workflows con keys hardcodeadas tampoco van a GitHub.','MSDS sesión 2026-06-21'),

('frontend','Estándares UI 7LCS','experto',
'Dark mode obligatorio. Inter font. Accent #3d8ef0. Sin emojis en UI de producto. Sin gradientes. Max 3 acciones visibles por pantalla. Inspirado en Linear/Vercel/Stripe.','Decisión arquitectura'),

('telegram','Separación de bots','experto',
'AndyBot = bot personal de Andrés. SCMSDS_bot = bot del cliente MSDS. Credenciales separadas en n8n. System prompts separados. Nunca mezclar contextos.','MSDS sesión 2026-06-19'),

('git','Push de repos grandes','operativo',
'HTTP 400 en push >10MB: reducir con .gitignore agresivo (node_modules, binarios, DBs). Fine-grained token de GitHub para autenticación. gh CLI no siempre disponible.','MSDS sesión 2026-06-21'),

('web','Skill web-rebuilder','operativo',
'Reconstruir web de cliente desde HTML original. Activar leyendo /Volumes/Samsung USB/.claude-global/skills/web/web-rebuilder.md. El director.md orquesta cuándo usar.','director.md biblioteca USB'),

('web','Skill seo-optimizer','operativo',
'SEO on-page: meta tags, schema, sitemap. Activar desde biblioteca USB. Se combina con humanizer para copy natural.','director.md biblioteca USB'),

('web','Skill scroll-video','operativo',
'Efecto de video controlado por scroll estilo Apple. Activar desde biblioteca USB cuando cliente quiere hero video.','director.md biblioteca USB'),

('marketing','Skills de copy disponibles','operativo',
'email-sequences-copy (3 emails bienvenida + humanizer), landing-page-copy (6 secciones + humanizer), social-media-copy (5 posts por red + humanizer). Ruta: /Volumes/Samsung USB/.claude-global/skills/marketing/','director.md biblioteca USB'),

('marketing','Skills de marketing por crear','referencia',
'whatsapp-marketing (Evolution API), email-sequences-n8n (Brevo/ActiveCampaign), ai-content-pipeline (DALL-E + copy), social-media-posting (Meta Graph API), voice-agents (ElevenLabs/Whisper/Vapi), avatar-video (HeyGen/D-ID), crm-integration (HubSpot/Pipedrive/GHL), excel-dynamic-reports (pandas).','director.md biblioteca USB'),

('flujos','Biblioteca de flujos reutilizables','operativo',
'Ruta: /ABM/biblioteca/flujos-reutilizables/INDICE.md. Andy puede sugerir qué flujo sirve para nuevos casos. Crecimiento manual: Fable resuelve → solución va a biblioteca/aprendizajes/ → Andy la lee.','capacidades.md andy-rol'),

('costos','Guía de costos para pymes','referencia',
'Referencia en /ABM/biblioteca/como-cobrar/GUIA_COSTOS_PYMES.md. Andrés no inventa tarifas — usa esta guía. Casos complejos de cobro se resuelven con Fable cuando hay datos reales.','capacidades.md andy-rol');
