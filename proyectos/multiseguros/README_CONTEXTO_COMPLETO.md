# README — Contexto completo Multiseguros (APP_MSDS)

> Resumen ejecutivo de decisiones, arquitectura y estado.
> Integrado a ABM: 2026-06-15. Corrige inconsistencias de versiones previas.

## 1. PROYECTO
SegurOS CRM para Multiseguros del Sur (MSDS), comercializadora de seguros, Neiva, Colombia.
Compite contra AIS/Celer (legacy, desktop, sin IA). Enfoque: productividad + IA + recuperar control.
ESTADO: pasó de piloto/demo a PRODUCCIÓN REAL (cliente confirmó).

## 2. STACK (actualizado a la decisión del 15-jun)
- Base de datos: **Supabase** (decisión 15-jun, reemplaza Airtable). Airtable queda solo como origen de migración.
- Automatización: n8n self-hosted — https://no-26feb-n8n.ydlmwq.easypanel.host/
- VPS: Hostinger Ubuntu 24.04, IP 76.13.28.7, Easypanel
- Frontend: HTML/CSS/JS en /Users/work945/Downloads/files/
- Notificaciones: Telegram bot SCMSDS_bot (ID 8889541466), gerente chat 8695082898
- IA agentes: OpenAI API (GPT-4o-mini)
- AndyBot: GPT vía Telegram + Whisper

## 3. TABLAS AIRTABLE (origen de migración a Supabase)
- Clientes_Auto: tblYb9IY2HOg3eFLI
- Polizas_Auto: tblwPDtCWNDJ4utZ2
- Siniestros: tblCUcr4Xbt8vmGCC
- Cotizaciones: tblAqdDmsV0L4F7J3
- Trabajadores: tblyIIlhti0otFBjC
- Base: app1UXLmLSjLDL5Mu

## 4. WORKFLOWS n8n
- P3 Cotización: ON (cron 1 min, polling Cotizaciones)
- P4 Siniestros: ON (Webhook -> datos -> Telegram)
- P2 Renovaciones: falta importar (P2_polizas_por_vencer_v10.json en Downloads)
- Bot Telegram recepción: en desarrollo

## 5. DECISIONES CLAVE (ver DECISIONES.md para el detalle y el porqué)
- OpenAI API para agentes (no Claude API) — costo
- Asistentes Operativos: P2=Agenda, P4=Urgencias, P3=Cotización, Journey=Seguimiento
- Clientes sin login (asesor gestiona todo)
- Dashboard polling 60s, sin websockets
- Migrar a Supabase (15-jun)
- Campo `ramo` en pólizas (Autos/Hogar/Vida/SOAT)
- DocuSign, módulo financiero, módulo vehículos separado = backlog contrato anual

## 6. CELER (lo que el cliente ya conoce — respetar su lógica)
Ver CELER_REFERENCIA.md. Núcleo: ficha de persona con todo lo del cliente (pólizas,
vehículos, siniestros, actividades, cartera). KPIs de inicio: valor cartera, pólizas
sin renovar, pólizas a vencer.

## 7. REGLAS DE DISEÑO §2B
Dark mode default. Inter (UI) + JetBrains Mono (datos). Acento único #3d8ef0.
Sin emojis, sin gradientes. border-radius <= 12px. Máx 2 acentos. Mobile-first 375px.
Código comentado en español. Dry-run antes de migrar.

## 8. BACKLOG CONTRATO ANUAL (no tocar en sprint)
P5 DocuSign (Ley 527/99), portal cliente self-service, módulo financiero
(comisiones/pagos/contabilidad), scraping mora aseguradoras, bot gerente NLP,
broadcast nota de voz, formulario alta clientes, módulo vehículos, app asegurados.
