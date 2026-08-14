# IMPORTAR P5 COMUNICACIONES EN N8N — Guía Paso-a-Paso (AP)

**Objetivo:** Importar workflow P5 a n8n, configurar credenciales, activar webhook.

**Duración:** 15 minutos

---

## PASO 1: Preparar archivo

✅ **CC completó:** Archivo P5_Comunicaciones_Inbox.json está listo en:
```
/Users/work945/Documents/Proyectos/ABM/proyectos/multiseguros/workflows/P5_Comunicaciones_Inbox.json
```

📝 **Requisitos previos (SOLO PRIMERA VEZ):**
- n8n running: https://no-26feb-n8n.ydlmwq.easypanel.host
- Acceso admin n8n
- Telegram credential: "MSDS Bot — Gerencia N" (token Fabio)
- Supabase API key (service_role o anon)

---

## PASO 2: Importar workflow en n8n UI

1. **Abrir n8n**
   ```
   https://no-26feb-n8n.ydlmwq.easypanel.host/workflows
   ```

2. **Click "New" o buscar "Import"**
   - Workflows → Import from File

3. **Seleccionar archivo**
   ```
   /Users/work945/Documents/Proyectos/ABM/proyectos/multiseguros/workflows/P5_Comunicaciones_Inbox.json
   ```

4. **Verificar import OK**
   - Debería mostrar "P5 - Comunicaciones Inbox (Supabase)"
   - Nodos visibles: Webhook → Normalizar → Insertar → Telegram → Respuesta

---

## PASO 3: Configurar Credenciales

### 3.1 HTTP Request (Supabase)

Nodo: **"Insertar Comunicacion (Supabase)"**

**Problema actual:** Headers tienen placeholders
```
apikey: SUPABASE_ANON_KEY_AQUI
Authorization: Bearer SUPABASE_ANON_KEY_AQUI
```

**Solución:**

Opción A (Recomendada): Usar Credential

1. En nodo HTTP Request, click "Authenticate"
2. Seleccionar o crear:
   - Type: "HTTP Header Auth"
   - Name: "Supabase MSDS"
   - Headers:
     ```
     apikey: [COPY FROM BITWARDEN: "MSDS Supabase anon key"]
     Authorization: Bearer [COPY FROM BITWARDEN]
     ```

Opción B (Rápido): Reemplazar texto

1. Click en campo `apikey` header
2. Cambiar:
   ```
   SUPABASE_ANON_KEY_AQUI
   ```
   Por valor actual de Bitwarden (buscar "MSDS Supabase").

### 3.2 Telegram Bot

Nodo: **"Notificar Gerencia"**

1. Click en dropdown "Telegram" credential
2. Buscar o crear:
   - Name: "MSDS Bot — Gerencia N"
   - Bot Token: [COPY FROM BITWARDEN: "SCMSDS_bot token"]
   - Chat ID: 8695082898 (Fabio test)

**O usar existing:** Si ya existe credential, solo seleccionar del dropdown.

---

## PASO 4: Activar Webhook

1. **Panel superior derecho:** Toggle ON (acticar workflow)
2. **Esperar confirmación verde:** "Workflow is active"
3. **Copiar webhook URL:**
   - Debe aparecer en panel derecho o notificación
   - URL parecida a:
     ```
     https://no-26feb-n8n.ydlmwq.easypanel.host/webhook/msds-comunicaciones
     ```

4. **Documentar URL:**
   - Copiar en CHECKPOINT_ACTUAL.md sección P5
   - Guardar en Bitwarden (carpeta "MSDS Secrets")

---

## PASO 5: Verificar Import

✅ Checklist:

- [ ] Workflow importado sin errores
- [ ] Nodos visibles (5 total): Webhook, Normalizar, Insertar, Telegram, Respuesta
- [ ] Credenciales configuradas (Supabase + Telegram)
- [ ] Workflow estado: "Active" (toggle ON)
- [ ] Webhook URL copiada

---

## ⏭️ SIGUIENTE: Fase 2 (CC ejecuta)

Una vez AP confirma **"Workflow activo + webhook URL guardada"**, CC ejecutará:

1. INSERT test en Supabase
2. Verificar notificación Telegram llega a Fabio
3. Validar dashboard tab "Comunicaciones"

---

## 🆘 Si falla import:

**Error:** "Invalid JSON"
- Verificar archivo no tiene caracteres especiales
- Re-descargar desde `/Downloads/P5_Comunicaciones_Inbox.json`

**Error:** Nodos dicen "Missing credential"
- Click nodo rojo → "Add credential" → llenar campos Supabase/Telegram
- Usar valores de Bitwarden

**Error:** Webhook no se activa
- Verificar toggle estado "Off" → click → "On"
- Esperar 5 seg, recargar página n8n

---

## 📋 Entregar a CC cuando completes:

```
✅ P5 Importado + Activo [HH:MM UTC]

Webhook URL: https://no-26feb-n8n.ydlmwq.easypanel.host/webhook/...
Credenciales: ✅ Supabase + ✅ Telegram
Estado: ACTIVE

Listo para fase 2 (CC testea)
```

---

**Última actualización:** 2026-07-27

