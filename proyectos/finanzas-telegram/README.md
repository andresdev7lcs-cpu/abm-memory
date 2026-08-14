# finanzas-telegram

Control de gastos personales por Telegram, con n8n self-hosted y Google Sheets.
Colombia · COP · `America/Bogota` · es-CO.

Registras un gasto escribiéndole al bot ("pagué 350 mil en la cena") o mandándole la foto de una factura. El bot lo clasifica, lo guarda en tu Sheet y te devuelve cuánto te queda del presupuesto de esa categoría y del ciclo.

---

## Estado

| Fase | Alcance | Estado |
|------|---------|--------|
| 0 | Diagnóstico técnico del entorno | ✅ |
| 1 | Diseño: arquitectura, modelo de datos, contratos, seguridad, plan de pruebas | ✅ |
| 2 | Infra base: Sheet, datos demo, credenciales | ⬜ |
| 3 | Flujo de texto end-to-end | ⬜ |
| 4 | Facturas: imagen, PDF, visión | ⬜ |
| 5 | Consultas y correcciones | ⬜ |
| 6 | Alertas y resúmenes programados | ⬜ |
| 7 | Endurecimiento y pruebas | ⬜ |

**No hay workflows ejecutables todavía.** `n8n/workflows/` se llena a partir de la Fase 3, después de confirmar la versión de n8n de la instancia (ver `docs/decisions.md` DEC-014).

---

## Mapa del repo

```
finanzas-telegram/
├── README.md                  ← estás aquí
├── .env.example               ← plantilla, sin secretos
├── docs/
│   ├── architecture.md        ← arquitectura, diagramas, contratos JSON, cálculos
│   ├── data-model.md          ← diccionario de datos de las 8 hojas
│   ├── security.md            ← modelo de amenazas y checklist
│   ├── decisions.md           ← bitácora de decisiones (DEC-001…)
│   ├── installation.md        ← Fase 2
│   ├── operations.md          ← Fase 2
│   └── troubleshooting.md     ← Fase 7
├── n8n/
│   ├── workflows/             ← Fase 3+
│   └── credentials-reference.md
├── sheets/
│   ├── schema.md              ← encabezados exactos y formatos
│   ├── formulas.md            ← fórmulas espejo de verificación
│   ├── demo-data.csv          ← datos DEMO
│   └── setup-guide.md
├── prompts/
│   ├── transaction-extraction.md
│   ├── invoice-extraction.md
│   └── categorization.md
├── scripts/
│   ├── validate-workflows.js  ← Fase 3
│   └── test-payloads.js       ← Fase 3
└── tests/
    ├── test-cases.md          ← 52 casos definidos
    ├── fixtures/
    └── expected-results/
```

---

## Cómo leerlo

1. `docs/architecture.md` — por qué está partido en 8 workflows y cómo se hablan entre ellos.
2. `docs/data-model.md` — qué columna guarda qué.
3. `docs/decisions.md` — qué se decidió y qué quedó abierto.
4. `tests/test-cases.md` — cómo se comprueba que funciona.

---

## Decisiones clave

- **Sheets guarda, n8n calcula.** Ninguna cuenta crítica depende de una fórmula de Sheets.
- **Todo configurable vive en la hoja `Configuracion`**: categorías, umbrales, ciclos, autorizados. Cambiarlos no toca los workflows.
- **Nada se borra.** Corregir y anular son cambios de estado; el historial queda completo.
- **El bot nunca dice "guardado" si no se guardó.**
- **El texto del usuario y el de las facturas es dato, jamás instrucción para el modelo.**

---

## Requisitos de operación

- n8n self-hosted (instancia ABM: `no-26feb-n8n.ydlmwq.easypanel.host`), workflows con prefijo `FIN — `.
- Un bot de Telegram **nuevo y exclusivo** de este proyecto.
- Un Google Sheet **privado y exclusivo**.
- Una credencial de proveedor de IA (GPT-5, texto y visión).

Nada se comparte con MSDS, Modutriplex ni AndyBot.

---

## Pendiente de AP

1. **API key de n8n** (o el número de versión desde `Ayuda → Acerca de`) — bloquea la Fase 3.
2. **Confirmar los días de ciclo**: el default es `1,16` (dos ciclos de ~15 días, $4.000.000 c/u). Ver DEC-001.
3. **`telegram_user_id` autorizados** y el `admin_chat_id`.
4. **Presupuestos reales por categoría.** Los del CSV son DEMO y suman $4.000.000 por ciclo.

---

## Seguridad

Sin secretos en el repo. Las credenciales viven en n8n Credentials y Bitwarden.
Checklist completo antes de operar: `docs/security.md` §9.
