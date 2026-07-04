# SEGUROS CRM — PILOTO DEMO v1.0
> **Para Claude Code:** Lee este archivo COMPLETO antes de escribir cualquier línea.
> Fuente de verdad del proyecto. No saltes fases. Marca `[x]` al completar.
> Ante cualquier duda, pregunta — no asumas.

---

## 0. CONTEXTO Y OBJETIVO

### Qué estamos construyendo
Demo de producción para una comercializadora de seguros colombiana.
Alcance del piloto: **2 áreas — Gerencia + Automóviles**.
2 asesores reales operando con datos reales durante 1 semana.

### Meta
Que los asesores y el gerente operen exactamente como hoy, pero dentro
de la plataforma. Sin fricción. Sin errores visibles.
Resultado: demo creíble lista para cerrar contrato y replicar.

### Lo que NO incluye este piloto (Fase 1)
- No tiene cotizador en línea. (Fase 3)
- No tiene módulo de comisiones. (Fase 2 — ver §16)
- No tiene todas las áreas (solo Automóviles + Gerencia).
- WhatsApp puede no estar activo (depende de aprobación Meta).

### Competidor de referencia: CELER (celer.co)
El cliente usa actualmente AIS de Celer — software colombiano de seguros legacy,
diseñado para escritorio, sin IA, sin mobile, sin firma electrónica, sin chatbot.
Nuestra plataforma iguala todos sus módulos y los supera en:
experiencia mobile, agentes IA, firma electrónica, chatbot con redireccionamiento,
gamificación, notificaciones WhatsApp/Telegram y costo operacional.

---

## 1. ESTRATEGIA DE DESARROLLO — OPTIMIZACIÓN DE TOKENS

**Claude Code resuelve:**
arquitectura, lógica de agentes, integraciones entre sistemas,
decisiones críticas, prompts de IA, revisión final de código.

**Delegar a GPT-4o (ChatGPT):**
HTML/CSS repetitivo, boilerplate de funciones simples,
documentación básica, debugging de sintaxis, componentes UI estándar.

**Flujo:** GPT-4o genera → Claude Code revisa y adapta al contexto.
Cuando generes algo con GPT-4o, tráelo aquí para revisión antes de usarlo.

---

## 2. PRINCIPIOS DE DISEÑO (NO NEGOCIABLES)

1. Mobile first. Solo URL en el navegador, sin instalaciones.
2. Un asesor la domina en 15 minutos sin ayuda.
3. Los agentes hacen el trabajo pesado. Asesores solo dan inputs simples.
4. Telegram para notificaciones del piloto. WhatsApp cuando Meta apruebe.
5. Datos limpios sobre datos completos. Solo migrar registros validados.
6. Demo offline lista en laptop por si el servidor falla.
7. Logs de toda llamada a API. Sin excepciones.
8. Código en español, comentado, modular.

---

## 3. STACK DEL PILOTO

| Capa | Herramienta | Notas |
|------|-------------|-------|
| Base de datos | Airtable (1 admin) | Solo agentes y scripts escriben |
| Interfaz asesores | HTML/CSS/JS en VPS | Basado en prototipo_trabajador.html |
| Automatización | n8n self-hosted | En VPS Hostinger |
| Notificaciones piloto | Telegram Bot | Gratis, sin aprobación, inmediato |
| Notificaciones futuro | WhatsApp Business (360dialog) | Activar cuando Meta apruebe |
| IA runtime | Claude API | Haiku para simple, Sonnet para análisis |
| Bot gerente | Telegram + n8n + Claude | Conversacional con acceso a Airtable |
| Monitoreo | UptimeRobot (gratis) | Alerta si VPS cae |
| Referencia visual | prototipo_trabajador.html | Estándar visual obligatorio |

---

## 4. MODELO DE DATOS — PILOTO

### Tabla: Clientes_Auto
| Campo | Tipo | Notas |
|-------|------|-------|
| id_cliente | Autonumber | |
| nombre_completo | Text | |
| documento | Text | Único. Validar al migrar |
| email | Email | |
| telefono | Phone | Formato +57XXXXXXXXXX |
| estado | Select | Activo / Inactivo / Prospecto |
| agente_asignado | Link → Trabajadores | |
| etapa_journey | Select | Ver §6 |
| ultima_interaccion | Rollup | Fecha más reciente en Actividades |
| dias_sin_contacto | Formula | TODAY() - ultima_interaccion |

### Tabla: Polizas_Auto
| Campo | Tipo | Notas |
|-------|------|-------|
| id_poliza | Autonumber | |
| cliente | Link → Clientes_Auto | |
| aseguradora | Text | |
| placa_vehiculo | Text | |
| tipo_cobertura | Select | Todo riesgo / Básico / SOAT |
| prima | Currency | |
| fecha_vencimiento | Date | |
| dias_para_vencer | Formula | fecha_vencimiento - TODAY() |
| estado | Select | Vigente / Por vencer / Vencida / Cancelada |
| estado_pago | Select | Al día / Pendiente / En mora |
| documentos | Attachments | |

### Tabla: Actividades
| Campo | Tipo | Notas |
|-------|------|-------|
| id_actividad | Autonumber | |
| cliente | Link → Clientes_Auto | |
| poliza | Link → Polizas_Auto | Opcional |
| tipo | Select | Llamada / Cotización / Renovación / Siniestro / Cobro / Seguimiento |
| descripcion | Long text | Input del asesor |
| resultado | Select | Exitoso / Sin respuesta / Reagendado / Escalado |
| responsable | Link → Trabajadores | |
| estado | Select | Abierta / En progreso / Completada / Vencida |
| prioridad | Select | Baja / Media / Alta / Urgente |
| fecha_creacion | DateTime | Automático |
| fecha_limite | Date | |
| fecha_cierre | DateTime | |
| dias_abierta | Formula | |
| xp_otorgado | Number | |
| notificacion_enviada | Checkbox | |

### Tabla: Trabajadores
| Campo | Tipo | Notas |
|-------|------|-------|
| id_trabajador | Autonumber | |
| nombre | Text | |
| telegram_id | Text | Para notificaciones piloto |
| telefono_whatsapp | Phone | Para cuando WA esté activo |
| area | Select | Automoviles / Gerencia |
| rol | Select | Asesor / Gerente / Admin |
| pin_acceso | Text | 4 dígitos hasheados |
| activo | Checkbox | |
| xp_total | Number | |
| nivel | Formula | Basado en xp_total |

### Tabla: XP_Log
| Campo | Tipo | |
|-------|------|-|
| trabajador | Link → Trabajadores | |
| xp_ganado | Number | Puede ser negativo |
| motivo | Text | |
| timestamp | DateTime | |

### Tabla: Alertas_Log
| Campo | Tipo | |
|-------|------|-|
| timestamp | DateTime | |
| tipo | Select | Poliza por vencer / Sin contacto / Tarea vencida / Siniestro |
| cliente | Link → Clientes_Auto | |
| accion | Long text | |
| agente_origen | Text | |
| notificacion_enviada | Checkbox | |

---

## 5. PROCESOS QUE DEBE SOPORTAR EL PILOTO

### P1 — Cotización nueva
```
Asesor registra: datos cliente + vehículo + tipo cobertura
→ Sistema crea cliente si no existe
→ Crea actividad "Cotización" con fecha límite 48h
→ Agente Journey marca etapa: "Cotizacion_enviada"
→ Si 3 días sin respuesta: alerta Telegram al asesor
```

### P2 — Seguimiento pólizas por vencer
```
n8n cron 8am diario:
→ Busca pólizas con dias_para_vencer <= 30
→ Crea actividad "Renovación" si no existe ya
→ Notifica asesor por Telegram con link
→ dias_para_vencer <= 7: prioridad URGENTE + alerta gerente
→ dias_para_vencer <= 0: alerta inmediata gerente
```

### P3 — Cobro / Pago pendiente
```
Asesor marca póliza con estado_pago "Pendiente"
→ Sistema crea actividad "Cobro"
→ Cada 5 días sin actualización: recordatorio Telegram
→ A los 15 días: escala a gerente
```

### P4 — Reporte de siniestro
```
Asesor registra actividad tipo "Siniestro"
→ Prioridad: URGENTE automáticamente
→ Notificación inmediata al gerente
→ Actividad abierta hasta que asesor confirme gestión
→ Gerente puede consultar estado por bot
```

### P5 — Actividades del día a día
```
Asesor abre la app cada mañana:
→ Ve tareas del día ordenadas por prioridad
→ Ve clientes sin contacto > 15 días
→ Ve su XP y progreso de la semana
→ Registra cualquier interacción en 3 taps
```

---

## 6. CUSTOMER JOURNEY — AUTOMÓVILES

```
Prospecto
  │ Sin respuesta 3d → alerta asesor
  ▼
Cotizacion_enviada
  │ Sin respuesta 3d → alerta asesor
  ▼
En_negociacion
  │ Sin avance 5d → alerta supervisor
  ▼
Cliente_activo
  │ Seguimiento mínimo cada 90 días
  ▼
En_renovacion (< 30 días para vencer)
  │ < 7 días → URGENTE
  ▼
Retenido ✓  |  Perdido ✗
```

---

## 7. INTERFAZ ASESORES

### Referencia visual obligatoria
prototipo_trabajador.html — respetar exactamente colores, tipografías y estructura.
Colores: fondo #0d0f14, verde #4fd1a5, azul #6c8fff, amarillo #f6c347, rojo #ff6b6b.
Tipografías: Syne (títulos) + DM Sans (cuerpo). Mobile first, máx 420px.

### URLs del piloto
```
http://[IP-VPS]/auto       → Interfaz asesores de Automóviles
http://[IP-VPS]/gerencia   → Vista del gerente
http://[IP-VPS]/admin      → Panel de Andrés (configuración)
```

### Autenticación
PIN 4 dígitos → n8n valida contra Airtable → retorna JWT (expira 8h).

### Pantalla principal asesor
1. Header: nombre + área + nivel XP.
2. Barra de XP con progreso.
3. Tres pills: Urgentes / Completadas hoy / Pendientes.
4. Card del agente IA (insight del día si hay algo relevante).
5. Lista de tareas del día por prioridad.
6. Scroll de clientes con alertas activas.
7. FAB (+) para registrar actividad.

### Formulario de registro (modal)
1. Cliente (búsqueda autocomplete por nombre o cédula).
2. Tipo de actividad (select con iconos).
3. Resultado / observación (máx 280 caracteres).
4. Botón "Registrar +XP".

---

## 8. BOT DEL GERENTE (Telegram)

### Comandos del piloto
```
/estado        → Resumen del día: abiertas, urgentes, completadas
/asesor [nombre] → Estado de un asesor
/cliente [nombre o cédula] → Ficha rápida
/siniestros    → Lista de siniestros activos
/vencer        → Pólizas por vencer esta semana
/asignar       → Asignar tarea (flujo guiado)
```

### Lenguaje natural
El bot responde preguntas sin comandos:
"¿Cómo va Juan hoy?" / "¿Cuántas pólizas vencen esta semana?"
Claude interpreta → consulta Airtable → responde en máximo 3 líneas.

### Prompt base del bot
```
Eres el asistente de gerencia de una empresa de seguros de autos colombiana.
Acceso a: asesores, clientes, pólizas y actividades del área de automóviles.
Respondes en español, directo, máximo 3 líneas.
Al asignar tarea: confirma asesor, crea actividad en Airtable,
notifica asesor por Telegram, confirma al gerente.
Si falta información: pregunta solo lo mínimo necesario.
Nunca inventes datos. Si no sabes: "No tengo esa información ahora."
```

---

## 9. MINI-AGENTES DEL PILOTO

Solo 2 agentes. Los demás en v2.

### Agente A — Vigía de Renovaciones
**Trigger:** Cron n8n 8am diario.
**Modelo:** Claude Haiku (más económico, suficiente para esta lógica).
**Entrada:** Pólizas con dias_para_vencer entre -30 y 30.
**Tarea:** Crear actividades de renovación faltantes + clasificar urgencia + notificar.
**Salida JSON:**
```json
{
  "polizas_procesadas": 0,
  "actividades_creadas": 0,
  "notificaciones_enviadas": 0,
  "urgentes": [],
  "errores": []
}
```

### Agente B — Lector de Journey
**Trigger:** Al completar una actividad (webhook n8n).
**Modelo:** Claude Haiku.
**Entrada:** Últimas 5 actividades del cliente.
**Tarea:** Determinar etapa del journey + sugerir próximo paso + actualizar Airtable.
**Salida JSON:**
```json
{
  "etapa_actual": "",
  "proximo_paso": "",
  "urgencia": "baja|media|alta",
  "actualizar_airtable": true
}
```

---

## 10. NOTIFICACIONES TELEGRAM

| Trigger | Mensaje | Destinatario |
|---------|---------|--------------|
| Póliza vence en 30d | "🔔 Póliza de [cliente] vence en 30 días. [link]" | Asesor |
| Póliza vence en 7d | "⚠️ URGENTE: Póliza de [cliente] vence en 7 días. [link]" | Asesor + Gerente |
| Póliza vencida | "🚨 Póliza de [cliente] VENCIDA. Acción requerida. [link]" | Asesor + Gerente |
| Siniestro registrado | "🚗 Siniestro: [cliente]. Ver: [link]" | Gerente |
| Tarea > 3d sin mover | "⏳ [Tarea] de [cliente] lleva 3 días sin actualizar. [link]" | Asesor |
| Cobro pendiente > 15d | "💳 Pago de [cliente] pendiente 15 días. Escalar. [link]" | Gerente |

---

## 11. GAMIFICACIÓN

| Acción | XP |
|--------|----|
| Registrar actividad | +20 |
| Completar tarea a tiempo | +50 |
| Completar tarea urgente | +80 |
| Cerrar renovación | +150 |
| Registrar siniestro | +40 |
| Tarea vencida | -30 |
| Semana sin vencidas | +100 |

| Nivel | Nombre | XP |
|-------|--------|----|
| 1 | Aprendiz | 0 |
| 2 | Asesor | 500 |
| 3 | Asesor Senior | 1.000 |
| 4 | Especialista | 2.000 |

---

## 12. PLAN DE CONTINGENCIA

| Riesgo | Acción |
|--------|--------|
| Dominio viejo no funciona | Usar IP del VPS para el piloto |
| WhatsApp no aprobado | Telegram cubre el piloto completo |
| Excel sucio | Dry-run obligatorio — migrar solo limpios |
| VPS cae en demo | UptimeRobot activo + demo offline en laptop |
| Asesores no adoptan | Sesión 20min previa + soporte día 1 + XP competitivo |
| Claude API lenta | Preguntas preparadas + spinner de carga visible |

---

## 13. FASES — SEMANA A SEMANA

### SEMANA 1 — Fundación de datos
- [ ] Crear base Airtable con tablas de §4
- [ ] validar_excel.py → reporte de calidad del Excel
- [ ] migrar_clientes.py dry-run → revisar reporte
- [ ] Migrar registros limpios a Airtable
- [ ] airtable_client.py con todas las operaciones base
- [ ] n8n conectado a Airtable y probado

### SEMANA 2 — Interfaz y notificaciones
- [ ] auto.html basado en prototipo_trabajador.html
- [ ] Autenticación PIN → JWT via n8n webhook
- [ ] Formulario de actividad conectado a Airtable
- [ ] XP actualiza en tiempo real
- [ ] Telegram Bot creado y notificaciones básicas funcionando
- [ ] Probado en celular real (375px)

### SEMANA 3 — Agentes, bot y piloto live
- [ ] Agente A: Vigía de Renovaciones (cron 8am)
- [ ] Agente B: Lector de Journey (on-demand)
- [ ] Bot gerente: comandos + lenguaje natural
- [ ] UptimeRobot configurado
- [ ] Demo offline preparada
- [ ] Prueba interna completa (simular asesor + gerente)
- [ ] Sesión 20min con los 2 asesores reales
- [ ] PILOTO LIVE: semana de operación real

---

## 14. ESTRUCTURA DE ARCHIVOS

```
/seguros-crm-piloto/
├── CLAUDE.md                    ← Este archivo
├── prototipo_trabajador.html    ← Referencia visual (NO modificar)
├── .env                         ← Variables reales (NUNCA en git)
├── .env.example                 ← Template sin valores
├── requirements.txt
│
├── /frontend/
│   ├── base.html                ← Estilos compartidos
│   ├── auto.html                ← Interfaz asesores Automóviles
│   ├── gerencia.html            ← Vista gerente
│   └── admin.html               ← Panel Andrés
│
├── /scripts/
│   ├── airtable_client.py       ← ÚNICO punto de acceso a Airtable API
│   ├── validar_excel.py         ← Reporte de calidad antes de migrar
│   ├── migrar_clientes.py       ← Con --dry-run obligatorio
│   └── xp_engine.py             ← Lógica de puntos y niveles
│
├── /agentes/
│   ├── vigia_renovaciones.py
│   ├── lector_journey.py
│   └── /prompts/
│       ├── vigia.txt
│       ├── journey.txt
│       └── bot_gerente.txt
│
├── /n8n/
│   ├── renovaciones_cron.json
│   ├── telegram_bot.json
│   ├── auth_pin.json
│   └── whatsapp_notifier.json
│
└── /demo_offline/
    ├── index.html               ← Demo estática si el servidor falla
    └── datos_mock.js            ← Datos ficticios hardcodeados
```

---

## 15. VARIABLES DE ENTORNO

```bash
# .env.example

# Airtable
AIRTABLE_TOKEN=pat_xxxxxxxxxxxx
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_CLIENTES=Clientes_Auto
AIRTABLE_TABLE_POLIZAS=Polizas_Auto
AIRTABLE_TABLE_ACTIVIDADES=Actividades
AIRTABLE_TABLE_TRABAJADORES=Trabajadores
AIRTABLE_TABLE_XP_LOG=XP_Log
AIRTABLE_TABLE_ALERTAS=Alertas_Log

# Claude API
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
CLAUDE_MODEL_HEAVY=claude-sonnet-4-20250514
CLAUDE_MODEL_LIGHT=claude-haiku-4-5-20251001

# Telegram
TELEGRAM_BOT_TOKEN=xxxxxxxxxxxx
TELEGRAM_GERENTE_CHAT_ID=xxxxxxxxxxxx
TELEGRAM_ASESOR_1_CHAT_ID=xxxxxxxxxxxx
TELEGRAM_ASESOR_2_CHAT_ID=xxxxxxxxxxxx

# WhatsApp (dejar vacío hasta aprobación Meta)
WHATSAPP_API_KEY=
WHATSAPP_FROM_NUMBER=

# App
APP_BASE_URL=http://[IP-DEL-VPS]
N8N_WEBHOOK_BASE_URL=http://[IP-DEL-VPS]:5678/webhook
JWT_SECRET=generar-clave-aleatoria-larga
JWT_EXPIRY_HOURS=8
```

---

## 16. REGLAS PARA CLAUDE CODE

1. Leer este archivo COMPLETO antes de cualquier acción.
2. No avanzar de semana sin validación de Andrés.
3. Delegar a GPT-4o lo indicado en §1. Traer el resultado aquí para revisión.
4. Todo el código en español: variables, comentarios, logs, errores.
5. airtable_client.py es sagrado — cero llamadas directas dispersas.
6. Dry-run siempre primero en migración. Nunca escribir sin validar primero.
7. Loggear cada llamada a Airtable y a Claude API.
8. Mobile first — probar HTML en 375px de ancho.
9. Sin dependencias innecesarias — instalar solo lo que se usa.
10. Antes de crear un agente: estimar tokens entrada/salida y documentarlo.
11. Marcar [x] en fases al completar.

---

## 17. PENDIENTES QUE BLOQUEAN — CONFIRMAR CON ANDRÉS

- [ ] IP del VPS de Hostinger
- [ ] ¿n8n ya instalado en el VPS? ¿Qué versión?
- [ ] Nombre real de la empresa (para bot y frontend)
- [ ] Nombres de los 2 asesores de Automóviles
- [ ] Primeras 3-5 filas del Excel ANONIMIZADAS (solo la estructura)
- [ ] Token de Airtable (crear en airtable.com/account)
- [ ] ¿Dominio disponible o usar IP del VPS para el piloto?

---

## 18. MÓDULO DE COMISIONES (Fase 2 — post piloto)

Requerido para igualar CELER/AIS en funcionalidad completa.

### Tabla: Comisiones (agregar en Fase 2)
| Campo | Tipo | Notas |
|-------|------|-------|
| id_comision | Autonumber | |
| asesor | Link → Trabajadores | |
| poliza | Link → Polizas_Auto | |
| tipo_comision | Select | Nueva / Renovación / Endoso |
| porcentaje | Number | % sobre la prima |
| valor_comision | Formula | prima × porcentaje |
| estado_pago | Select | Pendiente / Pagada / Retenida |
| fecha_generacion | Date | |
| fecha_pago | Date | |
| periodo | Text | Ej: "Jun 2026" |

### Lógica de cálculo
- Nueva póliza: comisión estándar por tipo de seguro (configurable).
- Renovación: comisión de renovación (generalmente menor).
- Endoso: comisión proporcional al ajuste de prima.
- n8n calcula automáticamente al cerrar una actividad de tipo Renovación.

### Vista para el asesor
- "Mis comisiones del mes" en la pantalla de Progreso.
- Total acumulado + pendiente de pago.
- Historial por póliza.

### Vista para el gerente
- Comisiones por asesor en Metabase.
- Total a pagar este mes.
- Comparativo vs. mes anterior.

---

## 19. CHATBOT DE ENTRADA + REDIRECCIONAMIENTO (Fase 2)

Sistema tipo KOMMO: un solo número/canal recibe clientes nuevos,
el bot califica y redirige a un asesor sin que el cliente cambie de chat.
El gerente monitorea todas las conversaciones en tiempo real.

### Flujo completo
```
CLIENTE NUEVO
    │ Escribe al número de WhatsApp/Telegram de la empresa
    ▼
BOT DE ENTRADA (n8n + Claude Haiku)
    │ Saluda y califica: nombre, tipo de seguro, vehículo
    │ "Hola, soy el asistente de [empresa]. ¿En qué te ayudamos?"
    ▼
CLASIFICACIÓN AUTOMÁTICA
    │ ¿Es cliente nuevo o existente?
    │ ¿Qué tipo de seguro necesita?
    ▼
REDIRECCIONAMIENTO SILENCIOSO
    │ Bot asigna al asesor disponible según área y carga
    │ El cliente NO cambia de chat — el asesor toma la conversación
    │ Asesor ve: contexto previo + datos capturados por el bot
    ▼
CONVERSACIÓN ASESOR ↔ CLIENTE
    │ El asesor continúa desde donde el bot dejó
    │ Gerente puede leer todas las conversaciones en el panel
    ▼
CIERRE
    │ Se crea cliente en Airtable automáticamente
    │ Se crea actividad tipo "Cotización" asignada al asesor
    └─ Log completo de la conversación guardado
```

### Panel de monitoreo del gerente
- Vista Kanban de conversaciones: Nuevo / En atención / Cotizando / Cerrado
- Conversación en tiempo real (como bandeja de entrada compartida)
- Puede intervenir o reasignar desde el panel
- Métricas: tiempo de respuesta, tasa de conversión, asesor más eficiente

### Tabla: Conversaciones (agregar en Fase 2)
| Campo | Tipo | Notas |
|-------|------|-------|
| id_conversacion | Autonumber | |
| canal | Select | WhatsApp / Telegram |
| telefono_cliente | Phone | |
| nombre_capturado | Text | Lo que dijo el bot |
| tipo_seguro_interes | Select | |
| asesor_asignado | Link → Trabajadores | |
| estado | Select | Bot / En atención / Cotizando / Cerrado / Perdido |
| fecha_inicio | DateTime | |
| fecha_cierre | DateTime | |
| transcript | Long text | JSON del historial |
| cliente_creado | Link → Clientes_Auto | Si se convirtió |

### Proveedor recomendado para el canal
- **Telegram:** inmediato, gratis, sin aprobación. Para el piloto.
- **WhatsApp Business API (360dialog):** para producción, requiere aprobación Meta.
- **Alternativa futura:** Twilio Conversations (multicanal: WA + SMS + chat web).

### Variables de entorno adicionales
```bash
# Chatbot entrada
BOT_ENTRADA_TOKEN=xxxxxxxxxxxx
BOT_CANAL=telegram  # o whatsapp
BOT_NUMERO_EMPRESA=+57XXXXXXXXXX
PANEL_MONITOR_URL=http://[IP-VPS]/monitor
```
