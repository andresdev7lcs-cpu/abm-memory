# Referencia de credenciales — finanzas-telegram

**Este archivo no contiene secretos y nunca debe contenerlos.** Describe qué credenciales hay que crear en n8n, con qué nombre exacto y con qué alcance. Los valores viven en n8n Credentials y en Bitwarden (colección `finanzas-telegram`).

Instancia n8n: `https://no-26feb-n8n.ydlmwq.easypanel.host` (compartida con otros proyectos ABM).
Regla de aislamiento: **credenciales nuevas y exclusivas**. No se reutiliza ninguna de MSDS, Modutriplex ni AndyBot.

---

## Inventario

| Nombre exacto en n8n | Tipo de credencial | Usada por | Alcance |
|---|---|---|---|
| `FIN — Telegram Bot` | Telegram API | WF1, WF3, WF4, WF5, WF6, WF7, WF8 | Bot dedicado del proyecto |
| `FIN — Google Sheets` | Google Sheets OAuth2 API *(o Service Account)* | WF2…WF8 | Un único documento |
| `FIN — Google Drive` *(opcional)* | Google Drive OAuth2 API | WF3, WF7 | Una única carpeta privada |
| `FIN — AI Gateway` | HTTP Header Auth | WF2, WF3 | Proveedor de IA (GPT-5) |

---

## 1. `FIN — Telegram Bot`

**Crear el bot**

1. Hablar con `@BotFather` → `/newbot`.
2. Nombre sugerido: `Finanzas AP`. Usuario: algo poco adivinable, no `@finanzas_bot`.
3. Guardar el token que entrega BotFather → Bitwarden.
4. `/setprivacy` → **Enabled** (el bot solo ve mensajes dirigidos a él; relevante si algún día entra a un grupo).
5. `/setcommands` con la lista de `docs/installation.md`.

**Crear la credencial en n8n**

- Tipo: `Telegram API`. Campo `Access Token` = token de BotFather.

**Registrar el webhook** (una sola vez, desde tu máquina, nunca desde un workflow):

```bash
# TELEGRAM_WEBHOOK_SECRET: mínimo 32 bytes aleatorios
#   openssl rand -hex 32
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=https://no-26feb-n8n.ydlmwq.easypanel.host/webhook/fin-telegram" \
  -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>" \
  -d "allowed_updates=[\"message\",\"callback_query\"]" \
  -d "drop_pending_updates=true"
```

Verificar: `curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"` → `url` correcta, `has_custom_certificate=false`, `pending_update_count` bajo, `last_error_message` vacío.

`allowed_updates` restringido a `message` y `callback_query` reduce ruido y superficie.

**El secret token no va en la credencial de n8n.** Va como variable de entorno de la instancia (`TELEGRAM_WEBHOOK_SECRET`), porque el primer nodo de WF1 lo compara contra el header `X-Telegram-Bot-Api-Secret-Token`.

---

## 2. `FIN — Google Sheets`

Dos caminos. **Service Account** es la recomendada para automatización desatendida: no expira por inactividad ni depende de una sesión de navegador.

### Opción A — Service Account (recomendada)

1. Google Cloud Console → proyecto nuevo `finanzas-telegram`.
2. Habilitar **Google Sheets API** (y **Drive API** solo si se activan adjuntos).
3. `IAM y administración → Cuentas de servicio` → crear cuenta → generar clave JSON.
4. En n8n: credencial `Google Sheets API` → método `Service Account` → pegar el `client_email` y la `private key` del JSON.
5. **Compartir el Sheet** con el `client_email` de la service account, permiso *Editor*.
6. Borrar el JSON descargado de la máquina local tras cargarlo (queda en Bitwarden como adjunto).

Scope: `https://www.googleapis.com/auth/spreadsheets`. **No** usar `auth/drive` completo.

### Opción B — OAuth2

1. Pantalla de consentimiento (tipo Externo, en modo Prueba con tu propia cuenta como usuario de prueba).
2. Credencial `ID de cliente de OAuth` tipo *Aplicación web*.
3. URI de redirección: `https://no-26feb-n8n.ydlmwq.easypanel.host/rest/oauth2-credential/callback`
4. En n8n: `Google Sheets OAuth2 API` → pegar Client ID y Secret → `Connect my account`.

Contra de esta opción: en modo Prueba el refresh token caduca a los 7 días. Si se elige OAuth2, hay que publicar la app o aceptar reconectar periódicamente.

---

## 3. `FIN — Google Drive` (opcional)

Solo si `Configuracion.guardar_adjuntos_drive = TRUE`.

- Scope: `https://www.googleapis.com/auth/drive.file` (solo archivos creados por la app). Nunca `auth/drive`.
- Crear una carpeta privada dedicada; su ID va en `GOOGLE_DRIVE_FOLDER_ID`.
- Verificar que la carpeta **no** esté compartida por link.

---

## 4. `FIN — AI Gateway`

Credencial `HTTP Header Auth` genérica, para que cambiar de proveedor no obligue a cambiar el tipo de nodo (DEC-008).

| Proveedor | Nombre del header | Valor | Endpoint |
|---|---|---|---|
| OpenAI (GPT-5) | `Authorization` | `Bearer <API_KEY>` | `https://api.openai.com/v1/responses` |
| Anthropic | `x-api-key` | `<API_KEY>` | `https://api.anthropic.com/v1/messages` |
| Google | `x-goog-api-key` | `<API_KEY>` | `https://generativelanguage.googleapis.com/v1beta/...` |

El endpoint y el shape del body los resuelve el nodo `AI Gateway` según `AI_PROVIDER`. La credencial solo aporta el header de autenticación.

Recomendación: API key **dedicada** a este proyecto, con límite de gasto propio en la consola del proveedor. Así un problema aquí no afecta a los demás proyectos ni al revés.

---

## 5. n8n Public API (solo herramientas locales)

Se usa exclusivamente desde `scripts/` para importar y exportar workflows. **Ningún workflow la consume.**

- Obtener en: n8n → `Configuración → API → Crear una API key`.
- Guardar en Bitwarden. En local va en `.env` (fuera de git).
- Uso: `curl -H "X-N8N-API-KEY: $N8N_API_KEY" $N8N_API_URL/workflows`

---

## 6. Verificación

Antes de dar por lista la Fase 2:

- [ ] Los 4 nombres de credencial coinciden **exactamente** con la tabla del inventario (los workflows los referencian por nombre)
- [ ] `FIN — Telegram Bot`: `getMe` responde con el bot correcto, no con otro bot de ABM
- [ ] `getWebhookInfo` muestra la URL de `fin-telegram` y `last_error_message` vacío
- [ ] `FIN — Google Sheets`: el nodo lee la hoja `Configuracion` y devuelve filas
- [ ] El Sheet está compartido con la service account y **no** con "cualquiera con el enlace"
- [ ] `FIN — AI Gateway`: una llamada de prueba devuelve 200
- [ ] Las 4 credenciales están replicadas en Bitwarden, colección `finanzas-telegram`
- [ ] Ningún JSON de `n8n/workflows/` contiene un valor de credencial (`scripts/validate-workflows.js`)

---

## 7. Rotación

| Credencial | Cuándo rotar | Cómo |
|---|---|---|
| Token de Telegram | Sospecha de filtración, o anualmente | `@BotFather → /revoke` → actualizar en n8n → volver a hacer `setWebhook` |
| Secret del webhook | Junto con el token | Regenerar → actualizar env de n8n → `setWebhook` |
| Service Account | Anualmente | Crear clave nueva → actualizar en n8n → borrar la anterior en GCP |
| API key de IA | Sospecha de filtración, o trimestralmente | Crear nueva → actualizar credencial → revocar la anterior |
| n8n API key | Semestralmente | Crear nueva → actualizar `.env` local → revocar la anterior |

Toda rotación se anota en `docs/operations.md` con fecha y motivo. **Nunca** el valor.
