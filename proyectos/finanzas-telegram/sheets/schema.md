# Esquema del Google Sheet — finanzas-telegram

Encabezados exactos, formatos y validaciones. La semántica de cada columna está en `docs/data-model.md`.

**Regla dura:** los nodos de Google Sheets referencian columnas **por nombre**. Renombrar un encabezado rompe los workflows. Añadir columnas nuevas **al final** es seguro; reordenar no lo es.

---

## Reglas comunes a las 8 hojas

- Fila 1 = encabezados. Fila 2 en adelante = datos. Sin filas de título por encima.
- Congelar fila 1: `Ver → Inmovilizar → 1 fila`.
- Nombre de hoja exacto, sin tildes ni espacios.
- Idioma del archivo: `Archivo → Configuración → Español (Colombia)`, zona horaria `(GMT-05:00) Bogotá`. Esto fija `.` como separador de miles y `,` como decimal.
- Columnas de ID (`*_id`), `hash_archivo`, `correlation_id` y `clave_dedupe` en **Formato → Número → Texto sin formato**. Si no, Sheets reinterpreta `TX-20260808-0001` o pierde ceros a la izquierda.
- Columnas de moneda: `Formato → Número → Personalizado` → `$ #.##0` (sin decimales; COP no los usa en la práctica).
- Fechas: `Formato → Número → Fecha personalizada` → `AAAA-MM-DD`.
- Timestamps: **texto plano**, no fecha. Se guardan en ISO 8601 con offset (`2026-08-08T14:03:11-05:00`) y Sheets los destrozaría al convertirlos.
- Booleanos: texto `TRUE` / `FALSE` en mayúsculas. No usar la casilla de verificación nativa (devuelve `1`/`0` por la API).

---

## 1. `Configuracion`

Rango de datos: `Configuracion!A2:E`

```
clave	valor	descripcion	tipo_dato	estado
```

| Columna | Formato | Validación |
|---|---|---|
| A `clave` | Texto sin formato | única |
| B `valor` | Texto sin formato | — |
| C `descripcion` | Texto | — |
| D `tipo_dato` | Lista | `texto, numero, bool, lista, hora, enum` |
| E `estado` | Lista | `activo, inactivo` |

`valor` se guarda **siempre como texto**, incluso los números. El casteo lo hace n8n según `tipo_dato`. Así `1,16` no se convierte en el número 1,16.

---

## 2. `Categorias`

Rango de datos: `Categorias!A2:O`

```
categoria_id	nombre	descripcion	grupo	presupuesto	ciclo	fecha_inicio	fecha_fin	gastado	disponible	porcentaje_usado	estado	activa	palabras_clave	notas
```

| Columna | Formato | Validación |
|---|---|---|
| A `categoria_id` | Texto sin formato | patrón `CAT-###`, única |
| D `grupo` | Lista | `Esencial, Variable, Discrecional, Financiero` |
| E `presupuesto` | `$ #.##0` | número ≥ 0 |
| F `ciclo` | Lista | `ciclo, mensual` |
| G–H fechas | `AAAA-MM-DD` | — |
| I `gastado` · J `disponible` | `$ #.##0` | **calculadas** — no editar |
| K `porcentaje_usado` | `0.0` | **calculada**, vacío si `presupuesto = 0` |
| L `estado` | Lista | `ok, aviso, alto, limite, excedido, sin_presupuesto` |
| M `activa` | Lista | `TRUE, FALSE` |
| N `palabras_clave` | Texto | separadas por `|`, minúsculas sin tildes |

Formato condicional sugerido sobre `K:K` — verde `<70`, amarillo `70–84,9`, naranja `85–99,9`, rojo `≥100`.

Columnas I, J, K, L, G, H llevan fondo gris claro: señal visual de "esto lo escribe el sistema".

---

## 3. `Transacciones`

Rango de datos: `Transacciones!A2:AD` (30 columnas)

```
transaccion_id	timestamp_registro	fecha_movimiento	ciclo_id	tipo	monto	moneda	categoria_id	categoria	subcategoria	descripcion	comercio_proveedor	metodo_pago	persona	origen	telegram_user_id	telegram_chat_id	telegram_message_id	file_id	archivo_url_o_referencia	hash_archivo	texto_original	datos_extraidos	confianza_ia	requiere_revision	estado	posible_duplicado	transaccion_relacionada	correlation_id	notas
```

| Columna | Formato | Validación |
|---|---|---|
| A `transaccion_id` | Texto sin formato | `TX-YYYYMMDD-XXXXXX`, única |
| B `timestamp_registro` | Texto sin formato | ISO 8601 con offset |
| C `fecha_movimiento` | `AAAA-MM-DD` | — |
| D `ciclo_id` | Texto sin formato | `YYYY-MM-[A-C]` |
| E `tipo` | Lista | `gasto, ingreso, reembolso, traslado, ajuste` |
| F `monto` | `$ #.##0` | número > 0 |
| G `moneda` | Lista | `COP` |
| M `metodo_pago` | Lista | `efectivo, debito, credito, transferencia, nequi, daviplata, no_especificado` |
| O `origen` | Lista | `telegram_texto, telegram_imagen, telegram_pdf, telegram_audio, manual, automatizacion` |
| P–R IDs Telegram | Texto sin formato | los IDs de Telegram superan la precisión segura de número |
| X `confianza_ia` | `0.00` | 0–1 |
| Y `requiere_revision` | Lista | `TRUE, FALSE` |
| Z `estado` | Lista | `activo, corregido, anulado, eliminado, incompleto` |
| AA `posible_duplicado` | Lista | `TRUE, FALSE` |

Hoja append-only. **No ordenar ni insertar filas en medio**: la idempotencia se apoya en `transaccion_id`, pero las lecturas por rango asumen orden de escritura.

Filtro guardado sugerido: `estado = activo`.

---

## 4. `Ingresos`

Rango de datos: `Ingresos!A2:K`

```
ingreso_id	nombre	monto_esperado	monto_recibido	frecuencia	dia_programado	proxima_fecha	fecha_recibido	estado	categorias_asociadas	notas
```

| Columna | Formato | Validación |
|---|---|---|
| A `ingreso_id` | Texto sin formato | `ING-###` |
| C–D montos | `$ #.##0` | ≥ 0 |
| E `frecuencia` | Lista | `mensual, quincenal, semanal, unico, variable` |
| F `dia_programado` | Número entero | 1–31 |
| G–H fechas | `AAAA-MM-DD` | — |
| I `estado` | Lista | `recibido, pendiente, vencido` |

---

## 5. `Resumen`

Rango de datos: `Resumen!A2:E`

```
metrica	valor	unidad	ciclo_id	actualizado_en
```

| Columna | Formato |
|---|---|
| A `metrica` | Texto sin formato (clave, única) |
| B `valor` | Texto sin formato — mezcla montos, fechas y porcentajes |
| C `unidad` | Lista: `COP, %, dias, fecha, texto, conteo` |
| E `actualizado_en` | Texto sin formato (ISO 8601) |

Las 18 métricas están listadas en `docs/data-model.md` §5. El orden de filas es fijo: n8n las actualiza buscando por `metrica`, no por número de fila, pero mantenerlas ordenadas ayuda a leer el panel.

---

## 6. `Alertas`

Rango de datos: `Alertas!A2:M`

```
alerta_id	timestamp	clave_dedupe	tipo	nivel	categoria	valor_actual	limite	mensaje	enviada	telegram_message_id	resuelta	fecha_resolucion
```

| Columna | Formato | Validación |
|---|---|---|
| A `alerta_id` | Texto sin formato | `AL-YYYYMMDD-NNNN` |
| C `clave_dedupe` | Texto sin formato | `ciclo_id\|categoria_id\|codigo` — **única**; es el antirrepetición |
| E `nivel` | Lista | `info, medio, alto, critico` |
| G–H | `0.0` | — |
| J `enviada` · L `resuelta` | Lista | `TRUE, FALSE` |

Aplicar `Datos → Validación de datos` con fórmula personalizada sobre `C2:C` para forzar unicidad:
`=COUNTIF($C$2:$C, C2) = 1`

---

## 7. `Pendientes`

Rango de datos: `Pendientes!A2:K`

```
pendiente_id	telegram_chat_id	telegram_message_id	estado_maquina	datos_propuestos	campo_ambiguo	opciones	fecha_creacion	fecha_expiracion	estado	correlation_id
```

| Columna | Formato | Validación |
|---|---|---|
| B–C | Texto sin formato | IDs de Telegram |
| D `estado_maquina` | Lista | `espera_monto, espera_categoria, espera_fecha, confirma_factura, resuelve_duplicado, corrigiendo` |
| E `datos_propuestos` · G `opciones` | Texto sin formato | JSON serializado |
| H–I | Texto sin formato | ISO 8601 |
| J `estado` | Lista | `abierto, consumido, expirado, cancelado` |

---

## 8. `Auditoria`

Rango de datos: `Auditoria!A2:K`

```
evento_id	timestamp	correlation_id	workflow	ejecucion	usuario	accion	resultado	detalle	error	datos_tecnicos
```

| Columna | Formato | Validación |
|---|---|---|
| A `evento_id` | Texto sin formato | `EV-YYYYMMDD-NNNN` |
| F `usuario` | Texto sin formato | solo `telegram_user_id` numérico |
| G `accion` | Lista | `autorizar, interpretar, ocr, escribir_transaccion, alertar, corregir, anular, consultar, resumen` |
| H `resultado` | Lista | `ok, warn, error` |
| K `datos_tecnicos` | Texto sin formato | JSON serializado |

---

## Rangos con nombre

Definir en `Datos → Rangos con nombre`. Hacen legibles las fórmulas espejo y sobreviven a la inserción de filas.

| Nombre | Rango |
|---|---|
| `CFG_CLAVES` | `Configuracion!A2:A` |
| `CFG_VALORES` | `Configuracion!B2:B` |
| `CAT_IDS` | `Categorias!A2:A` |
| `CAT_NOMBRES` | `Categorias!B2:B` |
| `CAT_PRESUPUESTOS` | `Categorias!E2:E` |
| `CAT_GASTADO` | `Categorias!I2:I` |
| `CAT_ACTIVA` | `Categorias!M2:M` |
| `TX_CICLO` | `Transacciones!D2:D` |
| `TX_TIPO` | `Transacciones!E2:E` |
| `TX_MONTO` | `Transacciones!F2:F` |
| `TX_CATEGORIA_ID` | `Transacciones!H2:H` |
| `TX_FECHA` | `Transacciones!C2:C` |
| `TX_ESTADO` | `Transacciones!Z2:Z` |

---

## Permisos

- El Sheet es **privado**. `Compartir` debe mostrar *"Restringido"*, nunca *"Cualquier persona con el enlace"*.
- Acceso: la cuenta dueña (editor) y la service account de n8n (editor). Nadie más.
- No publicar en la web (`Archivo → Compartir → Publicar en la Web` debe estar apagado).
- Historial de versiones activo (viene por defecto) — es la primera línea de respaldo.
- Proteger las columnas calculadas de `Categorias` (I, J, K, L, G, H) con `Datos → Proteger hojas y rangos` → *Mostrar advertencia al editar*. Advertencia, no bloqueo: la service account debe poder escribirlas.

---

## Verificación

- [ ] Las 8 hojas existen con el nombre exacto y sin tildes
- [ ] Encabezados pegados en la fila 1 de cada hoja, sin celdas vacías intermedias
- [ ] Fila 1 inmovilizada en las 8
- [ ] Idioma `Español (Colombia)` y zona horaria `Bogotá`
- [ ] Columnas de ID y timestamp en Texto sin formato (probar escribiendo `TX-20260808-0001`: debe verse igual, alineado a la izquierda)
- [ ] Validaciones de lista aplicadas en todas las columnas ENUM
- [ ] Los 13 rangos con nombre creados
- [ ] `Compartir` dice "Restringido"
- [ ] `GOOGLE_SHEETS_DOCUMENT_ID` copiado de la URL al `.env`
