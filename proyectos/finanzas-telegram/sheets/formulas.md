# Fórmulas de Google Sheets — verificación cruzada

**Estas fórmulas no son el motor del sistema.** El cálculo real vive en Code nodes de n8n, que escriben valores en `Categorias` y `Resumen` (DEC-002). Estas fórmulas van en **columnas auxiliares** y sirven para dos cosas:

1. Que un humano vea el número sin abrir n8n.
2. Detectar desviaciones: si el valor escrito por n8n y el de la fórmula difieren, algo falló en el recálculo.

Si una fórmula se rompe, el sistema **sigue funcionando**. Esa es la razón de que no sean el motor.

Todas asumen el idioma `Español (Colombia)`, donde el separador de argumentos es **`;`** (punto y coma). En un archivo en inglés hay que cambiarlo por `,`.

---

## 1. Constantes de apoyo

Poner en una hoja auxiliar `Aux` (o en celdas libres de `Resumen`):

```
Aux!B1  ciclo vigente
=INDEX(Resumen!B:B; MATCH("_ciclo_vigente"; Resumen!A:A; 0))
```

Alternativa sin depender de `Resumen`, leyendo la configuración:

```
Aux!B2  dia de inicio del ciclo vigente
=LET(
   dias; SORT(TRANSPOSE(SPLIT(INDEX(CFG_VALORES; MATCH("ciclo_dias_inicio"; CFG_CLAVES; 0)); ",")); 1; TRUE);
   hoy;  DAY(TODAY());
   IFERROR(MAX(FILTER(dias; dias <= hoy)); MAX(dias))
 )
```

```
Aux!B3  fecha de inicio del ciclo vigente
=DATE(YEAR(TODAY()); MONTH(TODAY()); MIN(Aux!B2; DAY(EOMONTH(TODAY(); 0))))
```

```
Aux!B4  fecha de fin del ciclo vigente
=LET(
   dias;  SORT(TRANSPOSE(SPLIT(INDEX(CFG_VALORES; MATCH("ciclo_dias_inicio"; CFG_CLAVES; 0)); ",")); 1; TRUE);
   sigs;  FILTER(dias; dias > Aux!B2);
   IF(COUNTA(sigs) = 0;
      DATE(YEAR(TODAY()); MONTH(TODAY()) + 1; MIN(MIN(dias); DAY(EOMONTH(TODAY(); 1)))) - 1;
      DATE(YEAR(TODAY()); MONTH(TODAY()); MIN(MIN(sigs); DAY(EOMONTH(TODAY(); 0)))) - 1)
 )
```

⚠️ **Frágil.** Estas tres fórmulas replican `resolverCiclo` de n8n en lenguaje de hoja de cálculo. Divergen en casos de borde (cambios de año, listas de más de dos días). La versión autoritativa es la de n8n; esta es solo espejo visual. Si difieren, **gana n8n**.

---

## 2. `Categorias` — columnas auxiliares

Sobre la primera fila de datos (fila 2), arrastrar hacia abajo.

### `P2` — gastado calculado (neto de reembolsos)

```
=SUMIFS(TX_MONTO; TX_CATEGORIA_ID; $A2; TX_TIPO; "gasto";   TX_ESTADO; "activo"; TX_CICLO; $Aux.$B$1)
-SUMIFS(TX_MONTO; TX_CATEGORIA_ID; $A2; TX_TIPO; "reembolso"; TX_ESTADO; "activo"; TX_CICLO; $Aux.$B$1)
```

### `Q2` — diferencia contra lo que escribió n8n

```
=$I2 - $P2
```

Debe dar `0`. Cualquier otro valor indica que el recálculo de n8n quedó desincronizado. Formato condicional: rojo si `<>0`.

### `R2` — porcentaje calculado, a prueba de división por cero

```
=IF(N($E2) = 0; ""; ROUND($P2 / $E2 * 100; 1))
```

`IF` sobre el presupuesto, no `IFERROR` sobre la división: `IFERROR` también taparía un error de referencia real.

### `S2` — estado calculado

```
=IFS(
  N($E2) = 0;  "sin_presupuesto";
  $R2 >= 100;  IF($R2 > 100; "excedido"; "limite");
  $R2 >= 85;   "alto";
  $R2 >= 70;   "aviso";
  TRUE;        "ok"
)
```

---

## 3. `Resumen` — fórmulas espejo por métrica

Colocar en la columna `F` (auxiliar), en la fila de cada métrica.

| Métrica | Fórmula |
|---|---|
| `presupuesto_total` | `=SUMIFS(CAT_PRESUPUESTOS; CAT_ACTIVA; "TRUE")` |
| `gastado_total` | `=SUMIFS(TX_MONTO; TX_TIPO; "gasto"; TX_ESTADO; "activo"; TX_CICLO; Aux!B1) - SUMIFS(TX_MONTO; TX_TIPO; "reembolso"; TX_ESTADO; "activo"; TX_CICLO; Aux!B1)` |
| `disponible_total` | `=SUMIFS(CAT_PRESUPUESTOS; CAT_ACTIVA; "TRUE") - F<fila_gastado_total>` |
| `porcentaje_consumido` | `=IF(F<fila_presupuesto> = 0; ""; ROUND(F<fila_gastado> / F<fila_presupuesto> * 100; 1))` |
| `gasto_hoy` | `=SUMIFS(TX_MONTO; TX_FECHA; TODAY(); TX_TIPO; "gasto"; TX_ESTADO; "activo")` |
| `gasto_semana` | `=SUMIFS(TX_MONTO; TX_FECHA; ">=" & (TODAY() - WEEKDAY(TODAY(); 2) + 1); TX_TIPO; "gasto"; TX_ESTADO; "activo") - SUMIFS(TX_MONTO; TX_FECHA; ">=" & (TODAY() - WEEKDAY(TODAY(); 2) + 1); TX_TIPO; "reembolso"; TX_ESTADO; "activo")` |
| `gasto_ciclo` | igual que `gastado_total` |
| `dias_restantes_ciclo` | `=MAX(0; Aux!B4 - TODAY() + 1)` |
| `proximo_ingreso_fecha` | `=IFERROR(MIN(FILTER(Ingresos!G2:G; Ingresos!I2:I = "pendiente"; Ingresos!G2:G >= TODAY())); "")` |
| `proximo_ingreso_nombre` | `=IFERROR(INDEX(Ingresos!B2:B; MATCH(F<fila_fecha>; Ingresos!G2:G; 0)); "")` |
| `dias_proximo_ingreso` | `=IF(F<fila_fecha> = ""; ""; F<fila_fecha> - TODAY())` |
| `maximo_diario_sugerido` | `=ROUND(MAX(F<fila_disponible>; 0) / MAX(F<fila_dias_restantes>; 1); 0)` |
| `categorias_en_aviso` | `=COUNTIFS(Categorias!S2:S; "aviso") + COUNTIFS(Categorias!S2:S; "alto") + COUNTIFS(Categorias!S2:S; "limite")` |
| `categorias_excedidas` | `=COUNTIF(Categorias!S2:S; "excedido")` |
| `transacciones_ciclo` | `=COUNTIFS(TX_CICLO; Aux!B1; TX_ESTADO; "activo")` |
| `pendientes_abiertos` | `=COUNTIF(Pendientes!J2:J; "abierto")` |

`<fila_x>` = número de fila donde vive esa métrica en `Resumen`. Se resuelve al pegar, o con `MATCH("metrica"; Resumen!A:A; 0)` si se prefiere robustez sobre legibilidad.

`WEEKDAY(TODAY(); 2)` usa el tipo 2 (lunes = 1), que corresponde al inicio de semana en Colombia.

---

## 4. Gasto por categoría (tabla dinámica de lectura)

Para una vista rápida sin tabla dinámica, en la hoja `Aux`:

```
=QUERY(
   {TX_CATEGORIA_ID \ TX_MONTO \ TX_TIPO \ TX_ESTADO \ TX_CICLO};
   "select Col1, sum(Col2)
      where Col3 = 'gasto' and Col4 = 'activo' and Col5 = '" & Aux!B1 & "'
      group by Col1
      order by sum(Col2) desc
      label Col1 'categoria', sum(Col2) 'gastado'";
   0
 )
```

El separador de columnas en un array literal es `\` en configuración regional española y `,` en inglesa. Es la causa más común de que este `QUERY` falle al copiarlo.

---

## 5. Comparación con el ciclo anterior

```
=LET(
   ciclo_ant; INDEX(Resumen!B:B; MATCH("_ciclo_anterior"; Resumen!A:A; 0));
   ant; SUMIFS(TX_MONTO; TX_CICLO; ciclo_ant; TX_TIPO; "gasto"; TX_ESTADO; "activo");
   act; SUMIFS(TX_MONTO; TX_CICLO; Aux!B1;    TX_TIPO; "gasto"; TX_ESTADO; "activo");
   IF(ant = 0; "sin_datos"; TEXT((act - ant) / ant; "+0,0%;-0,0%") & " vs ciclo anterior")
 )
```

Devuelve `sin_datos` en el primer ciclo, sin `#DIV/0!`.

---

## 6. Índice de fragilidad

| Fórmula | Fragilidad | Por qué | Si se rompe |
|---|---|---|---|
| `Aux!B2`–`B4` (fronteras de ciclo) | **Alta** | Replica lógica de fechas que Sheets maneja mal; sensible a cambios de año | El sistema no se afecta; solo el espejo visual |
| `QUERY` con array literal | **Alta** | El separador `\` vs `,` depende del idioma del archivo | Vista de gasto por categoría en blanco |
| `SUMIFS` sobre rangos con nombre | Baja | Los rangos con nombre sobreviven a insertar filas | — |
| Referencias `F<fila_x>` | Media | Se rompen si se reordenan las filas de `Resumen` | Métrica espejo incorrecta |
| `Categorias!P:S` | Baja | Solo dependen de rangos con nombre y de `$A2` | — |

**Regla operativa:** si un valor escrito por n8n y su fórmula espejo discrepan, se investiga el recálculo de n8n — pero el número que el bot le reporta al usuario es siempre el de n8n, nunca el de la fórmula.

---

## 7. Lo que deliberadamente NO se hace con fórmulas

- **Detección de duplicados.** Necesita ventana temporal, normalización de proveedor y puntaje. Va en un Code node.
- **Anti-repetición de alertas.** Necesita escribir estado, no solo leer.
- **Resolución de fechas relativas.** "Ayer" en zona horaria de Bogotá no se resuelve confiablemente con `TODAY()`, que depende de la configuración regional del archivo.
- **`transaccion_id`.** Necesita un hash determinístico.
- **Cualquier escritura.** Las fórmulas solo leen. Todo lo que muta el estado pasa por n8n, con su registro en `Auditoria`.
