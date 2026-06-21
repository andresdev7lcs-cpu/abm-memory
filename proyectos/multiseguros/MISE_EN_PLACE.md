# MISE EN PLACE — Multiseguros del Sur

> Todo lo que CC y Codex necesitan saber para operar, SIN claves (esas van en Bitwarden).
> "Mise en place" = todo listo y a la mano antes de cocinar.

---

## Apps y servicios (qué es cada cosa)

| Servicio | Para qué | Dónde |
|----------|----------|-------|
| Airtable | Base de datos actual (migrar a Supabase pendiente) | base `app1UXLmLSjLDL5Mu` |
| Supabase | Base de datos objetivo + auth + permisos | `https://pcplqwvwuwqehtzjhmkd.supabase.co` |
| n8n | Automatizaciones (workflows) | `https://no-26feb-n8n.ydlmwq.easypanel.host/` |
| VPS Hostinger | Servidor donde corre n8n | IP `76.13.28.7`, Easypanel puerto 3000, Ubuntu 24.04 |
| Telegram bot | Notificaciones y recepción | `SCMSDS_bot` (ID 8889541466) |
| OpenAI API | Agentes IA (GPT-4o-mini) y Whisper | platform.openai.com |

## IDs y referencias técnicas (NO son secretos, son direcciones)

```
Airtable base:        app1UXLmLSjLDL5Mu
Tabla Clientes_Auto:  tblYb9IY2HOg3eFLI
Tabla Polizas_Auto:   tblwPDtCWNDJ4utZ2
Tabla Siniestros:     tblCUcr4Xbt8vmGCC
Tabla Cotizaciones:   tblAqdDmsV0L4F7J3
Tabla Log_Workflows:  tblyIIlhti0otFBjC
Telegram gerente:     chat ID 8695082898
Supabase (sprint tracker viejo): https://pcplqwvwuwqehtzjhmkd.supabase.co
Supabase (CRM nuevo MSDS-CRM):   https://ekarbxdoaoqrtlmfzgyj.supabase.co
```

## Workflows en n8n

| Workflow | Función | Estado |
|----------|---------|--------|
| P2 | Pólizas por vencer, cron 8am diario | ❌ falta importar (JSON en Downloads) |
| P3 | Cotizador vía API | ✅ ON |
| P4 | Siniestro urgente: Telegram → n8n → datos → notifica | ✅ ON |
| Bot recepción | Alta de clientes por Telegram | 🔄 en desarrollo |

## Archivos del proyecto (en el Mac de Andrés, mover a repo)

```
~/Downloads/airtable_client.py        (único punto de acceso a Airtable en Python)
~/Downloads/ajustar_fechas_demo.py
~/Downloads/migrar_clientes_500.py
~/Downloads/crear_tablas_airtable.py
~/Downloads/generar_datos_demo.py
~/Downloads/P2_polizas_por_vencer_v10.json  (listo para importar)
~/Downloads/.env                       (claves — NO subir al repo, mover a Bitwarden)
demo_completa_seguros.html
gerencia.html
base_styles.css
```

## Reglas técnicas aprendidas (no repetir errores)

- Las credenciales NO se guardan en los JSON de n8n: hay que reasignarlas manualmente tras cada import.
- Airtable "Map Automatically" da error 422 (intenta escribir el campo `id` interno) → usar mapeo manual.
- No se puede convertir un campo de texto con datos a tipo link directamente: hay que borrar y recrear.
- Crear tablas vía API de Airtable requiere el scope `schema.bases:write`.

## Qué falta para producción

1. Mover claves del .env a Bitwarden.
2. Sacar el token de Airtable del HTML (riesgo de seguridad).
3. Decidir e implementar Supabase.
4. Conectar UI a datos reales vía backend.
