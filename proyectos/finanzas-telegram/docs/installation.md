# Manual de instalación — finanzas-telegram

Orden obligatorio: **Sheet → credenciales → workflows → webhook → prueba**. Saltarse un paso deja el siguiente sin cómo verificarse.

Tiempo total: ~90 minutos la primera vez.

---

## Estado del entorno de prueba

| Pieza | Estado | Nota |
|---|---|---|
| Instancia n8n | ✅ viva | `https://no-26feb-n8n.ydlmwq.easypanel.host` |
| Versión de n8n | ❌ sin confirmar | bloquea el paso 4 (DEC-014) |
| Bot de Telegram | ✅ creado | `@Tefa0898bot`, id `8998869043` |
| Webhook del bot | ⬜ sin registrar | paso 5 |
| `TELEGRAM_WEBHOOK_SECRET` | ✅ generado | en `.env` local, permisos 600, fuera de git |
| Google Sheet | ⬜ pendiente | paso 1 |
| Credenciales n8n | ⬜ pendientes | paso 3 |
| `user_id` autorizados | ❌ pendiente | sin esto el bot rechaza a todos |

> ⚠️ **Deuda de seguridad abierta.** El token del bot de prueba se compartió por un canal no seguro. Antes de operar con datos reales: `@BotFather → /revoke`, token nuevo solo en n8n Credentials + Bitwarden, y volver a correr el paso 5. Registrar la rotación en `operations.md`.

---

## Paso 1 — Google Sheet

Seguir [`sheets/setup-guide.md`](../sheets/setup-guide.md) completo (12 pasos).

Resultado esperado: 8 hojas, formatos aplicados, datos DEMO cargados, aritmética verificada (presupuestos = 4.000.000, gastado = 1.290.750), `Compartir = Restringido`.

Anotar el `GOOGLE_SHEETS_DOCUMENT_ID` en `.env`.

## Paso 2 — Obtener los `user_id` autorizados

Cada persona que vaya a usar el bot:

1. Abre Telegram, busca `@userinfobot`, le manda cualquier mensaje.
2. Copia el número que responde en `Id`.

Alternativa sin bots de terceros, si el webhook aún no está puesto:

```bash
# Mándale /start a @Tefa0898bot y luego:
curl -s "https://api.telegram.org/bot<TOKEN>/getUpdates" \
  | python3 -c "import json,sys; [print(u['message']['from']['id'], u['message']['from'].get('username')) for u in json.load(sys.stdin)['result'] if 'message' in u]"
```

`getUpdates` **solo funciona mientras no haya webhook registrado**. Después del paso 5 deja de servir.

Poner los IDs en:

- `Configuracion!autorizados_user_ids` (fuente de verdad, separados por coma)
- `Configuracion!admin_chat_id` (quien recibe alertas técnicas)
- `.env → TELEGRAM_ALLOWED_USER_IDS` (fallback de arranque en frío)

Mientras `autorizados_user_ids` esté vacío el bot rechaza a todo el mundo. Es a propósito (fail-closed).

## Paso 3 — Credenciales en n8n

Seguir [`n8n/credentials-reference.md`](../n8n/credentials-reference.md). Cuatro credenciales, con los nombres **exactos**:

```
FIN — Telegram Bot      (Telegram API)
FIN — Google Sheets     (Service Account recomendada)
FIN — Google Drive      (opcional, solo si guardar_adjuntos_drive = TRUE)
FIN — AI Gateway        (HTTP Header Auth)
```

Los workflows las referencian por nombre. Un nombre distinto = nodo sin credencial.

Verificar antes de seguir:

- Telegram: el nodo `getMe` devuelve `Tefa0898bot`
- Sheets: un nodo de lectura sobre `Configuracion` devuelve 24 filas
- AI Gateway: una llamada de prueba devuelve 200

## Paso 4 — Importar los workflows

> ⛔ **Bloqueado.** Los JSON de `n8n/workflows/` aún no existen. No se generan hasta confirmar la versión de n8n y los `typeVersion` disponibles (DEC-014, regla 28: prohibido inventar parámetros de nodo).
>
> Para desbloquear, cualquiera de las dos:
> - n8n → `Configuración → API → Crear API key` → pegar en `.env` como `N8N_API_KEY`
> - n8n → `Ayuda → Acerca de` → pasar el número de versión

Cuando existan, hay dos vías:

**Vía UI** — `Workflows → ⋯ → Import from File`, uno por uno, en orden 01→08. Al abrir cada uno, reasignar las credenciales (n8n no las trae en el import).

**Vía API** — desde tu máquina:

```bash
source .env
for f in n8n/workflows/*.json; do
  echo "Importando $f"
  curl -s -X POST "$N8N_API_URL/workflows" \
    -H "X-N8N-API-KEY: $N8N_API_KEY" \
    -H "Content-Type: application/json" \
    --data-binary "@$f" | python3 -c "import json,sys; d=json.load(sys.stdin); print(' ->', d.get('name'), d.get('id'))"
done
```

Después del import:

1. En cada workflow, `Settings → Error Workflow` → `SYS — Manejador de Errores`.
2. Activar solo WF1 y WF7. Los demás son subworkflows: se ejecutan por `Execute Workflow` y **no** deben activarse.
3. Copiar la URL de producción del webhook de WF1.

## Paso 5 — Registrar el webhook de Telegram

```bash
source .env
curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -d "url=$WEBHOOK_URL/webhook/fin-telegram" \
  -d "secret_token=$TELEGRAM_WEBHOOK_SECRET" \
  -d "allowed_updates=[\"message\",\"callback_query\"]" \
  -d "drop_pending_updates=true" | python3 -m json.tool
```

Verificar:

```bash
curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getWebhookInfo" | python3 -m json.tool
```

Debe mostrar:

- `url` = la de tu instancia, terminada en `/webhook/fin-telegram`
- `pending_update_count` bajo
- `last_error_message` **ausente**. Si aparece, es la pista más directa del problema (ver `troubleshooting.md`).

`drop_pending_updates=true` descarta lo que se haya acumulado durante la instalación: evita que el bot procese mensajes viejos al arrancar.

## Paso 6 — Comandos del bot

`@BotFather → /setcommands → @Tefa0898bot`, pegar tal cual:

```
start - Iniciar y ver el menu
help - Ayuda y comandos disponibles
gasto - Registrar un gasto
ingreso - Registrar un ingreso
estado - Estado del presupuesto
categorias - Presupuesto por categoria
presupuesto - Ver o ajustar presupuestos
hoy - Gastos de hoy
semana - Gastos de la semana
mes - Gastos del mes
ciclo - Estado del ciclo actual
recientes - Ultimos movimientos
buscar - Buscar movimientos
corregir - Corregir un movimiento
anular - Anular un movimiento
deshacer - Deshacer el ultimo movimiento
pendientes - Confirmaciones pendientes
proximo_pago - Proximo ingreso esperado
configuracion - Ajustes del sistema
```

También `@BotFather → /setprivacy → Enabled`, por si algún día entra a un grupo.

## Paso 7 — Prueba de humo

En orden. Si uno falla, no seguir al siguiente.

| # | Acción | Esperado |
|---|---|---|
| 1 | Escribir al bot desde un `user_id` **no** autorizado | "No autorizado." + fila en `Auditoria` con `resultado=warn` |
| 2 | `/start` desde un `user_id` autorizado | Menú con botones |
| 3 | `gasté 35.000 en gasolina` | ✅ + saldo de Transporte + fila nueva en `Transacciones` |
| 4 | Revisar `Transacciones` en el Sheet | `estado=activo`, `ciclo_id` correcto, `categoria_id=CAT-005` |
| 5 | Revisar `Categorias!CAT-005` | `gastado` subió 35.000, `disponible` bajó igual |
| 6 | `/estado` | Presupuesto, gastado, disponible, días restantes, próximo ingreso |
| 7 | `pagué el recibo de la luz` | Pregunta el monto + fila en `Pendientes` |
| 8 | Foto de una factura | Ficha extraída + botones de confirmación |
| 9 | `POST` al webhook sin el header del secret | HTTP 401, nada procesado |
| 10 | Reenviar el mismo `update_id` | Una sola fila en `Transacciones` |

Los 10 en verde = instalación correcta. Corresponden a TC-39, TC-01, TC-34, TC-05, TC-16, TC-40 y TC-41 de `tests/test-cases.md`.

## Paso 8 — Activar lo programado

Solo después de que la prueba de humo pase completa:

1. WF7 activo.
2. `Configuracion!resumen_semanal_activo = TRUE` (ya viene así).
3. `resumen_diario_activo` en `FALSE` la primera semana. Súbelo a `TRUE` cuando confirmes que el resumen semanal sale bien.
4. Verificar en n8n → `Executions` que el cron de barrido de pendientes corre cada 15 min sin errores.

---

## Checklist de instalación

- [ ] Sheet creado, formateado, con demo cargada y aritmética verificada
- [ ] Sheet `Restringido`, compartido solo con la service account
- [ ] `GOOGLE_SHEETS_DOCUMENT_ID` en `.env`
- [ ] `user_id` reales en `Configuracion!autorizados_user_ids`
- [ ] `admin_chat_id` puesto
- [ ] 4 credenciales creadas con los nombres exactos y probadas una por una
- [ ] Versión de n8n confirmada (desbloquea el paso 4)
- [ ] 8 workflows importados con las credenciales reasignadas
- [ ] `Error Workflow` apuntando a WF8 en los 7 restantes
- [ ] Solo WF1 y WF7 activos
- [ ] Webhook registrado con `secret_token` y `getWebhookInfo` sin error
- [ ] Comandos cargados en BotFather
- [ ] Prueba de humo: 10/10
- [ ] Checklist de seguridad de `security.md` §9 completo
- [ ] **Token del bot de prueba revocado y reemplazado** antes de datos reales
