# Bitácora de decisiones técnicas — finanzas-telegram

Formato: contexto → decisión → alternativas descartadas → consecuencias. Una entrada por decisión con impacto arquitectónico.

---

## DEC-001 — Modelo de ciclo financiero: A, fronteras `1,16`, ingresos el 15 y el 31

**Estado:** ✅ **confirmada por AP** (2026-08-01)
**Fecha:** 2026-08-01

**Contexto.** El enunciado decía "$4.000.000 COP cada ciclo, dos ciclos por mes" y mencionaba ingresos el 1 y el 30/31. Se abrió como pregunta porque `1,30` habría dejado un ciclo de 1–2 días.

**Confirmación de AP:** ciclos **1–15** y **16–30/31**. El dinero entra el **15** y el **31** (último día del mes cuando no hay 31).

**Decisión.** Modelo A, `ciclo_dias_inicio = 1,16`. `Ingresos.dia_programado` = `15` y `31`, con ajuste automático al último día del mes (28/29/30). Ambos en `Configuracion`/`Ingresos`; cambiarlos no toca workflows.

**Consecuencia relevante para el cálculo.** El ingreso llega el **último día del ciclo**, no el primero. Es decir:

- El ciclo `1–15` se financia con el dinero recibido el 31 del mes anterior.
- El ciclo `16–30/31` se financia con el dinero recibido el 15.

De ahí que `dias_restantes_ciclo` y `dias_proximo_ingreso` apunten siempre a la misma fecha. Se reportan como dos métricas porque su definición difiere en un día: `dias_restantes_ciclo` incluye el día en curso, `dias_proximo_ingreso` no.

**Alternativas descartadas.** `1,30` (ciclo de 1–2 días); Modelo C (no representa dos ciclos por mes como unidad de presupuesto); Modelo B (exige declarar qué categorías financia cada fuente — ambigüedad alta para el MVP, estructura ya prevista en la hoja `Ingresos`).

---

## DEC-002 — Sheets como fuente de verdad, no como motor de cálculo

**Estado:** adoptada

**Contexto.** El enunciado fija Sheets como fuente de verdad del MVP y permite fórmulas "cuando aporten transparencia".

**Decisión.** Todos los cálculos de saldo, ciclo y umbral se hacen en Code nodes de n8n y se **escriben** como valores en `Categorias` y `Resumen`. Las fórmulas de `sheets/formulas.md` son verificación cruzada opcional en columnas auxiliares.

**Alternativas descartadas.** Fórmulas como motor: se rompen al insertar filas, al renombrar hojas, al importar CSV, y no son testeables desde n8n.

**Consecuencias.** El Sheet sigue legible para un humano. Un fallo de recálculo se detecta comparando el valor escrito contra la fórmula espejo. Contra: el Sheet no se autoactualiza si alguien edita a mano — es correcto y está documentado.

---

## DEC-003 — Pre-normalizador determinista antes del LLM

**Estado:** adoptada

**Contexto.** La mayoría de mensajes son "gasté 85.000 en gasolina": monto trivial de extraer con regex y categoría resoluble por keyword.

**Decisión.** Un Code node resuelve monto, fecha relativa y categoría por keyword. Si logra monto + categoría con confianza ≥ 0.90, **no** se llama al LLM. El LLM entra en lo ambiguo, lo multi-monto y las imágenes.

**Consecuencias.** Menos costo por token, menos latencia, menos superficie de prompt injection. Contra: dos rutas de clasificación que deben mantenerse coherentes; ambas emiten el mismo `Contrato.Movimiento` y comparten el mismo validador.

---

## DEC-004 — Punto único de escritura en `Transacciones`

**Estado:** adoptada

**Decisión.** Solo WF4 (`Registrar`) y WF6 (`Correcciones`) escriben en `Transacciones`. WF2, WF3 y WF5 nunca lo hacen.

**Consecuencias.** Validación, idempotencia y auditoría viven en un solo lugar. Contra: un salto extra de `Execute Workflow` por registro (~200 ms), irrelevante para uso personal.

---

## DEC-005 — `transaccion_id` determinístico para idempotencia

**Estado:** adoptada

**Decisión.** `TX-{YYYYMMDD}-{hash6(telegram_chat_id + ':' + telegram_message_id)}`. Antes de escribir, WF4 busca ese ID; si existe, devuelve el resultado previo sin escribir.

**Alternativas descartadas.** UUID aleatorio (no protege contra reintentos); número de fila (inestable).

**Consecuencias.** Un reintento de n8n, un reenvío de Telegram o un doble tap no duplican. Contra: dos gastos idénticos enviados en **mensajes distintos** sí generan filas distintas — correcto, y para eso está la detección de duplicados por puntaje (§12 de architecture.md).

---

## DEC-006 — Borrado lógico, corrección por fila nueva

**Estado:** adoptada

**Decisión.** Corregir no sobrescribe: la fila original pasa a `estado=corregido` y se crea una fila nueva `activo` con `transaccion_relacionada` apuntando a la original.

**Consecuencias.** Historial auditable completo. Contra: crece el número de filas; mitigado con el archivado anual.

---

## DEC-007 — Estado conversacional en la hoja `Pendientes`

**Estado:** adoptada para el MVP, con salida planificada

**Decisión.** La máquina de estados vive en Sheets, con TTL de 15 minutos y barrido por cron.

**Alternativas descartadas.** Redis (infra adicional para 1–3 usuarios); memoria de n8n (se pierde al reiniciar); Postgres (sobredimensionado).

**Consecuencias.** Cero infraestructura nueva. Contra: sin locking, ~500 ms de latencia por lectura, sin TTL nativo. Limitaciones y ruta de migración documentadas en architecture.md §8; el cambio toca 3 nodos y no altera los contratos.

---

## DEC-008 — Un solo `AI Gateway` parametrizado

**Estado:** adoptada

**Decisión.** Un nodo HTTP Request genérico + un normalizador, seleccionado por `AI_PROVIDER`. No se usan los nodos nativos de OpenAI/Anthropic.

**Consecuencias.** Cambiar de proveedor toca 1 nodo. Se evita depender de nodos que cambian de forma entre versiones de n8n. Contra: hay que mantener a mano el shape del request por proveedor.

---

## DEC-009 — GPT-5 como modelo de texto y visión

**Estado:** adoptada

**Contexto.** Requisito explícito de AP: GPT-5 para procesar imágenes y datos.

**Decisión.** `AI_MODEL_TEXT=gpt-5`, `AI_MODEL_VISION=gpt-5`. Un solo modelo multimodal cubre texto e imagen; no se añade un motor OCR aparte (Tesseract/Vision API) en el MVP.

**Consecuencias.** Menos piezas móviles. Si el desempeño en facturas térmicas borrosas resulta insuficiente, se añade un OCR previo **detrás del mismo AI Gateway**, sin tocar WF3.

---

## DEC-010 — Reembolso ≠ ingreso

**Estado:** adoptada

**Decisión.** `tipo=reembolso` resta del gasto de su categoría y **no** entra en la hoja `Ingresos`. Solo la nómina y otras entradas reales son `ingreso`.

**Consecuencias.** El "gastado" de una categoría refleja el gasto neto real. Requisito explícito del enunciado §17.

---

## DEC-011 — Anti-repetición de alertas por clave de ciclo

**Estado:** adoptada

**Decisión.** Clave `ciclo_id|categoria_id|codigo` en `Alertas`. Antes de enviar se verifica que no exista. Al cambiar de ciclo, la clave cambia y los umbrales vuelven a poder dispararse.

**Alternativas descartadas.** Flag booleano en `Categorias` (habría que resetearlo y se pierde el histórico).

---

## DEC-012 — Validación de origen del webhook por secret token

**Estado:** adoptada

**Decisión.** No se usa el nodo Telegram Trigger. Se usa un Webhook node y `setWebhook` con `secret_token`; el primer nodo valida el header `X-Telegram-Bot-Api-Secret-Token` y devuelve 401 si no coincide.

**Alternativas descartadas.** Telegram Trigger nativo: cómodo, pero no expone el header para validarlo ni permite responder 200 temprano en el dedupe de `update_id`.

**Consecuencias.** Control total sobre autorización, dedupe y respuesta HTTP. Contra: hay que registrar el webhook a mano una vez (documentado en la guía de instalación).

---

## DEC-013 — Prefijo `FIN —` en la instancia n8n compartida

**Estado:** adoptada

**Contexto.** La instancia `no-26feb-n8n.ydlmwq.easypanel.host` ya aloja workflows de MSDS, Modutriplex y AndyBot.

**Decisión.** Los 8 workflows llevan prefijo `FIN — `. Credenciales, bot y Sheet son nuevos y exclusivos. No se toca ningún workflow existente.

---

## DEC-014 — Compatibilidad por matriz empírica, no por número de versión

**Estado:** ✅ resuelta (2026-08-01) — desbloquea la Fase 3

**Contexto.** Con la API key de n8n se confirmó el acceso (`HTTP 200`, 112 workflows en la instancia). Pero **ninguna** superficie expone el número de versión del core: `/rest/settings` responde en modo público sin `versionCli`, y `/api/v1/openapi.yml` declara `1.1.1`, que es la versión del *Public API*, no la de n8n.

**Decisión.** Se abandona el número de versión como criterio y se usa una **matriz de compatibilidad empírica**: los `typeVersion` que ya están corriendo en esta misma instancia. Si un nodo funciona hoy en un workflow activo, funciona en el nuestro.

Matriz completa en [`n8n/node-compatibility.md`](../n8n/node-compatibility.md).

Para los 4 nodos que no aparecen en ningún workflow de la instancia (`executeWorkflow`, `executeWorkflowTrigger`, `errorTrigger`, `crypto`) se usa `typeVersion: 1`. n8n siempre carga la versión 1 de un nodo: es el suelo garantizado, aunque no traiga las opciones más nuevas.

**Alternativa descartada.** Crear un workflow sonda en la instancia para probar los 4 nodos faltantes. El `POST /api/v1/workflows` acepta cualquier `typeVersion` sin validarlo contra el catálogo de nodos, así que la sonda no habría probado nada — y sí habría dejado basura en una instancia compartida con 112 workflows de otros proyectos.

**Riesgo residual.** Bajo. Si al abrir un workflow importado el editor marca un nodo con "unknown node type", se sube o baja ese `typeVersion` puntual. Afecta a un nodo, no al diseño.

---

## DEC-015 — Sin nodos de comunidad

**Estado:** adoptada

**Decisión.** Solo nodos oficiales: Webhook, HTTP Request, Code, Switch, IF, Set, Merge, Google Sheets, Google Drive, Telegram, Execute Workflow, Schedule Trigger, Error Trigger, Crypto, Wait.

**Consecuencias.** La instancia tiene `communityNodesEnabled: true`, pero los nodos de comunidad se rompen en upgrades y complican el diagnóstico. Ninguna necesidad del proyecto los justifica.

---

## DEC-016 — Lecturas por nodo nativo + OAuth, escrituras por HTTP Request + Service Account

**Estado:** ✅ resuelta (2026-08-05), verificada contra el sheet real

**Contexto.** El nodo nativo `Google Sheets` de esta instancia solo acepta el tipo de credencial `googleSheetsOAuth2Api`. Esa credencial OAuth2 (`FIN — Google Sheets`, creada primero) quedó con scope `drive.file` de Google — restringido a archivos que la propia app crea, nunca a uno preexistente aunque tenga permiso de Editor. Confirmado con un diagnóstico directo: la misma credencial podía **crear** un spreadsheet nuevo (200 OK) pero fallaba con `403 Forbidden` al escribir en el sheet real de AP, ya compartido como Editor. Se descartaron en orden: permiso mal configurado (no, se verificó dos veces), cuenta equivocada en el OAuth (no, se reconectó explícitamente con `afpalomaresr@gmail.com`), y por último el scope — confirmado con el test de creación.

Se intentó primero migrar **todo** a Service Account (tipo `googleApi`, con `email` + `privateKey` + `scopes=spreadsheets`, creada vía API de n8n porque la UI no la muestra en el buscador global de credenciales — solo aparece dentro del selector propio de cada nodo). Pero el nodo nativo `Google Sheets` de esta instancia **no acepta** `googleApi` como tipo de credencial (confirmado: `n8n` rechaza la activación con *"Missing required credential: googleSheetsOAuth2Api"*). No existe un tercer tipo dedicado (`googleSheetsApi`, `googleServiceAccountApi` → ambos 404 contra el catálogo de la instancia).

**Decisión.** Arquitectura híbrida:
- **Lecturas** (14 nodos en los 6 workflows) siguen con el nodo nativo `Google Sheets` + credencial OAuth2 `FIN — Google Sheets`. Confirmado que leer sí funciona bajo `drive.file`, probablemente porque el sheet tenía "Cualquiera con el enlace: Lector" activo — la lectura no depende del ACL específico de la cuenta autorizada.
- **Escrituras** (11 nodos: 7 `append`, 4 `update`) se reemplazaron por pares `Code` (arma la fila/fusiona campos) + `HTTP Request` directo a `sheets.googleapis.com`, con credencial Service Account `FIN — Google Sheets SA` (`googleApi`, `httpNode: true`, `scopes: https://www.googleapis.com/auth/spreadsheets`). El nodo `HTTP Request` conserva el **mismo nombre e id** que el nodo nativo que reemplaza, así que ninguna referencia `$('Nombre del nodo')` de otros Code nodes del mismo workflow se rompió.
- El patrón `update` hace *read-modify-write* de la fila completa: busca el índice por la columna clave dentro de los datos ya leídos por un nodo previo del mismo workflow (`$('Leer X').all()`), fusiona los campos nuevos sobre la fila existente, y hace `PUT` sobre el rango exacto `Hoja!A{fila}:{última_columna}{fila}`. Replica el comportamiento de `matchingColumns` del nodo nativo sin depender de él.

**Verificación.** Tres pruebas descartables antes de tocar producción: (1) `POST batchUpdate` crea una pestaña nueva con la SA → 200; (2) patrón `append` completo con `values:append` → 200; (3) patrón `update` completo: pestaña de prueba, 2 filas sembradas, `update` sobre la fila 2 por índice → `updatedRange: A3:B3` correcto. Con los tres patrones probados, se corrió `00-setup-sheet.json` contra el sheet real: 9 pestañas creadas, 699 celdas escritas, `Sheet1`/`Gastos` intactas, verificado además por una vía completamente independiente (lectura pública sin credencial de n8n).

**Bug propio detectado en el camino.** El primer intento de conversión asumió que los 4 nodos `update` tenían forma plana (`mappingMode: autoMapInputData`). Tres de los cuatro (`Marcar Pendiente Consumido`, `Cancelar Pendiente`, `Actualizar Estado Original` en WF6) en realidad usaban `defineBelow` con expresiones apuntando a rutas anidadas (`$json.pendiente_a_consumir.pendiente_id`, no `$json.pendiente_id`). Se detectó por inspección antes de ejecutar contra producción y se corrigió cada Code node individualmente con la expresión de match correcta.

**Alternativas descartadas.**
- Publicar la app OAuth para saltar el modo Testing: no cambia el scope `drive.file`, que está fijado en el tipo de credencial nativo de n8n, no en la configuración de Cloud Console.
- Convertir también las lecturas a HTTP Request + SA por consistencia: se descartó por ser trabajo adicional sin beneficio — las lecturas ya funcionan y cada conversión de más es superficie nueva para bugs.

**Deuda de seguridad.** La `private_key` de la Service Account se compartió en el chat de esta sesión (archivo JSON completo pegado por AP) para poder crear la credencial vía API sin pelear más con la UI. Se usó una sola vez, no quedó en ningún archivo del repo. **Rotar antes de operar con datos reales:** Cloud Console → IAM y administración → Cuentas de servicio → `fin-sheet-writer@pure-feat-504217-n8.iam.gserviceaccount.com` → Claves → borrar la clave actual (`b1ce171a062755705d16907353cbdf00718eb3a6`) → generar una nueva → actualizar la credencial `FIN — Google Sheets SA` en n8n.

---

## DEC-017 — Seis bugs de producción encontrados y corregidos durante la primera prueba de humo real

**Estado:** ✅ resueltos (2026-08-05), verificados contra Telegram real y el sheet real

**Contexto.** Tras importar y activar los 7 workflows, la primera cadena de gastos reales (WF1→WF2→WF4) reveló seis fallos que ninguna prueba offline (Luxon puro, sin n8n) podía detectar, porque dependen del runtime específico de n8n: semántica de `Merge`, contrato de `Code` en modo por-ítem, y el sandbox de esta instancia. Se corrigieron todos antes de dar la Fase 3 por cerrada.

### 1. `Merge combineAll` sobre ramas mutuamente excluyentes (3 ocurrencias)

`Unir Ramas` (WF2), `Unir Respuestas` (WF5, 14 entradas), `Unir Respuestas` (WF6, 9 entradas): todas juntaban las salidas de un `Switch`/`IF` donde **solo una rama corre por ejecución**. `combineAll` espera que lleguen ítems a **todas** las entradas configuradas antes de emitir — con una rama que nunca llega (por diseño), el nodo se queda esperando para siempre y todo lo que sigue nunca se ejecuta. Detectado porque WF4 nunca se disparaba desde WF2 pese a que WF2 marcaba `success`.

**Fix:** eliminados los 3 `Merge`. Cada rama del switch conecta directo al nodo siguiente — son alternativas, no streams paralelos a combinar.

### 2. `executeWorkflow`/`executeWorkflowTrigger` typeVersion 1 rechaza el resource locator

DEC-014 eligió `typeVersion: 1` como "suelo garantizado" para estos dos nodos, por no tener precedente empírico en la instancia. Pero el formato `{__rl:true, value, mode:'id'}` que usé para `workflowId` es de una versión posterior del nodo; en v1 produce `"Workflow does not exist"` aunque el ID sea correcto, porque v1 espera el ID en un campo distinto sin el wrapper RL.

**Fix:** subidos a `typeVersion: 1.2` (probado en vivo, funciona). El trigger además exige `parameters.inputSource: "passthrough"` en 1.2 — sin eso, n8n rechaza la activación con *"Missing or invalid required parameters"*.

### 3. `require('crypto')` bloqueado en el sandbox del Code node

La instancia tiene el sandbox de Code node configurado sin `crypto` en los módulos permitidos (`NODE_FUNCTION_ALLOW_BUILTIN` no lo incluye). `Resolver Ciclo e ID` (WF4) lo usaba para el hash del `transaccion_id` determinístico.

**Fix:** reemplazado por FNV-1a de 32 bits en JS puro. No hace falta resistencia criptográfica — el único requisito es que `(chat_id, message_id)` produzca siempre el mismo hash (idempotencia, DEC-005), y FNV-1a cumple eso de sobra.

### 4. Code node en modo por-ítem: contrato de retorno distinto

Los 11 nodos `Code` generados para el patrón de escritura (DEC-016) necesitaban `mode: "runOnceForEachItem"` para procesar los N ítems que les llegan (ej. las 15 categorías separadas por `Separar Categorias`) — sin eso, un Code node en modo por-defecto ("Run Once for All Items") solo ve el **primer** ítem vía `$json` y ejecuta una sola vez, descartando los demás en silencio. Confirmado en vivo: `Actualizar Categorias` solo escribió la fila de `CAT-001`, las otras 14 categorías nunca se tocaron.

Al corregir el modo, apareció el segundo problema: `runOnceForEachItem` exige `return { json: {...} };` (un solo objeto), no `return [{ json: {...} }];` (el array que exige el modo por defecto). Un primer intento de arreglarlo con una regex sobre el código fuente hizo un match demasiado codicioso y mezcló los dos `return` de los nodos con salida temprana (`if (idx === -1) return ...`), rompiendo la sintaxis. Se regeneraron los 11 nodos desde cero (no con parches sucesivos) y se verificó cada uno con `node --check` antes de volver a sincronizar con n8n.

**Fix:** los 11 Code nodes de escritura llevan `mode: "runOnceForEachItem"` y devuelven un objeto único, nunca un array.

### 5. `Filtrar Alertas Nuevas` devolvía `[]` y mataba la respuesta al usuario

`Construir Respuesta` (la confirmación "✅ gasto registrado") estaba conectado a la misma salida que `Guardar Alertas`. Cuando no había alertas nuevas que emitir, `Filtrar Alertas Nuevas` devolvía un array vacío — y en n8n, **0 ítems aguas arriba significa que los nodos siguientes no se ejecutan en absoluto**, sin importar su propia lógica. El usuario se quedaba sin ningún mensaje de confirmación en el caso más común (un gasto sin alertas).

**Fix:** `Filtrar Alertas Nuevas` nunca devuelve `[]`; cuando no hay alertas reales emite un ítem centinela `{ _sin_alertas: true }`. Se insertó un nodo `IF` (`Hay Alertas Reales?`) antes de `Guardar Alertas` para que el centinela no se cuele como fila basura en la hoja `Alertas`. `Construir Respuesta` ya filtraba por `.mensaje` (el centinela no lo tiene), así que no necesitó cambios.

### 6. `Filtrar Alertas Nuevas` dispara `CATEGORIA_SIN_PRESUPUESTO` en cada gasto mientras Vivienda siga en 0

No es un bug — es el comportamiento correcto de DEC-011 (anti-repetición por `clave_dedupe`) exponiendo un dato real pendiente: `CAT-001 Vivienda` sigue con `presupuesto=0` (una de las 3 dudas marcadas `CONFIRMAR` en el seed, sección §16 de architecture.md). Cada `Recalcular Saldos` evalúa las 15 categorías completas, así que la alerta se reevalúa en cada gasto — pero solo se **envía** una vez por ciclo gracias al `clave_dedupe`. Confirmado con la ejecución 286573: 0 ítems por la rama centinela, exactamente 1 alerta nueva registrada.

**Verificación final.** 4 transacciones reales vía webhook con secret token real: `TX-20260805-73BA33` (35.000, Transporte), `TX-20260805-8D7182` (85.000, Mercado), `TX-20260805-E42C57` (62.000, Salud), `TX-20260805-869524` (300.000, Vivienda). Las 4 con `gastado`/`disponible`/`porcentaje_usado` correctos en `Categorias`, sin filas corrompidas en las categorías no tocadas, y confirmación completa entregada a Telegram (verificado leyendo el sheet por una vía sin credencial de n8n, independiente de lo que reportó la ejecución).

---

## DEC-018 — Las 3 dudas de `Categorias` quedan cerradas por AP

**Estado:** ✅ confirmada por AP (2026-08-05)

**Contexto.** El seed inicial (00-setup-sheet.json) dejó 3 categorías marcadas `CONFIRMAR` en su columna `notas` porque los números de la pestaña `Sheet1`/`Gastos` de AP no cuadraban entre la vista mensual y la vista quincenal (ver §"Lo que encontré en tu sheet" de la conversación de instalación).

**Decisión de AP:**

| Categoría | Duda | Resuelto |
|---|---|---|
| `CAT-001 Vivienda` | Apto (2.500.000) + Chía (800.000) no estaban en ningún ciclo | **Costo futuro estimado, no ejecutado en el corto plazo.** `presupuesto` se queda en 0 a propósito — no es un dato pendiente, es la representación correcta de "esto no se paga todavía". |
| `CAT-006 Deudas y créditos` (TC Andrés) | ¿1.150.000/mes o 350.000+350.000/ciclo? | **350.000 por ciclo** (700.000/mes). Ya era el valor cargado en `Categorias.presupuesto`; solo la nota decía `CONFIRMAR`. |
| `CAT-003 Mercado` | ¿800.000/mes o 600.000+600.000/ciclo? | **600.000 por ciclo** (1.200.000/mes). Mismo caso: el número ya estaba bien, la nota quedó desactualizada. |

**Aplicado.** Las 3 notas de `Categorias!O2`, `O4`, `O7` se reescribieron directo en el sheet (vía workflow temporal `httpRequest`+SA, creado-ejecutado-borrado en la misma operación) para reflejar el cierre. Ningún `presupuesto` cambió — CAT-003 y CAT-006 ya tenían el número correcto desde el seed; solo CAT-001 se mantiene en 0, ahora documentado como decisión deliberada y no como pendiente.

**Consecuencia práctica.** La alerta `CATEGORIA_SIN_PRESUPUESTO` de Vivienda seguirá apareciendo en cada ciclo (una vez, por `clave_dedupe`) mientras `presupuesto=0` sea la decisión vigente. Es el comportamiento esperado, no un bug — recuerda que ese gasto real cuando exista necesitará presupuesto propio o una fuente de ingreso que hoy no está modelada.

---

## DEC-019 — WF7 (Programados) implementado y activo

**Estado:** ✅ implementada e importada (2026-08-05). Sin verificación en vivo todavía — depende de que llegue la hora/día configurados o de que existan pendientes/ingresos vencidos reales para disparar cada rama.

**Contexto.** Último de los 8 workflows de producción. Tres crones independientes en un solo workflow (mismo patrón de `Configuracion` como fuente de verdad que el resto del sistema):

| Cron | Frecuencia | Qué hace |
|---|---|---|
| Barrido de pendientes | cada 15 min | marca `expirado` lo que superó `ttl_pendientes_minutos` |
| Ingresos vencidos | cada hora | marca `vencido` lo que pasó `proxima_fecha` sin recibirse, avisa al admin |
| Resumen semanal | cada hora, evalúa condición | compara hora/día actual contra `Configuracion.hora_envio_resumen`/`dia_resumen_semanal`; si coincide, arma y envía el resumen |

**Por qué "cada hora, evalúa condición" y no una expresión cron exacta para el resumen.** Correr cada hora y comparar contra la config (en vez de `0 20 * * 0` fijo) permite cambiar el día u hora del resumen editando la hoja `Configuracion`, sin tocar ni reimportar el workflow.

**Bug propio detectado antes de importar (mismo patrón que DEC-017 §4).** `Aviso Ingreso Vencido` no declaraba `mode: runOnceForEachItem` — si vencían 2+ ingresos en la misma pasada horaria, solo el primero habría generado aviso al admin, los demás se habrían descartado en silencio (mismo bug de "Run Once for All Items ve solo el primer ítem" que ya había mordido a `Actualizar Categorias` en WF4). Se corrigió antes de sincronizar con n8n, no después de que fallara en producción — la lección de DEC-017 se aplicó proactivamente al resto del código nuevo.

**No implementado en esta fase:** el resumen de **cierre de ciclo** (comparación completa contra el ciclo anterior, distribución por categoría, ver architecture.md §19) queda para una iteración futura. La *mecánica* de cierre ya funciona sola — `Recalcular Saldos` de WF4 filtra por `ciclo_id` en cada movimiento, así que un ciclo nuevo arranca en 0 sin intervención de WF7. Lo que falta es solo el mensaje de resumen al cerrar, no el reinicio de saldos.

**Estado final del sistema:** 8/8 workflows de producción activos en n8n (WF1–WF8, WF3 como stub honesto de Fase 4). Setup de un solo uso (`00-setup-sheet.json`) ya ejecutado y retirado de la instancia.
