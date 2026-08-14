# Matriz de compatibilidad de nodos

Instancia: `https://no-26feb-n8n.ydlmwq.easypanel.host`
Medido el **2026-08-01** sobre los **112 workflows** existentes (rango de actualización 2026-02-26 → 2026-07-31).

**Por qué esta matriz y no un número de versión.** La instancia no expone la versión del core por ninguna superficie accesible: `/rest/settings` responde en modo público sin `versionCli`, y `/api/v1/openapi.yml` declara `1.1.1`, que es la versión del Public API. En vez de adivinar, se midió qué `typeVersion` está realmente corriendo ahí (DEC-014).

Regla: **si un `typeVersion` ya funciona en esta instancia, funciona en nuestros workflows.**

---

## Confirmados en producción

`typeVersion` máximo observado en workflows reales de la instancia. Es el valor que usan los exports de `n8n/workflows/`.

| Nodo | `type` | typeVersion | Uso en este proyecto |
|---|---|---|---|
| Webhook | `n8n-nodes-base.webhook` | **2.0** | WF1 — entrada de Telegram |
| Respond to Webhook | `n8n-nodes-base.respondToWebhook` | **1.1** | WF1 — 200/401 temprano |
| HTTP Request | `n8n-nodes-base.httpRequest` | **4.3** | AI Gateway, API de Telegram |
| Code | `n8n-nodes-base.code` | **2.0** | normalizadores, validadores, cálculo de ciclo |
| Switch | `n8n-nodes-base.switch` | **3.4** | WF1 — enrutado por tipo de mensaje |
| If | `n8n-nodes-base.if` | **2.2** | ramas de decisión |
| Filter | `n8n-nodes-base.filter` | **2.3** | filtrado de transacciones |
| Set | `n8n-nodes-base.set` | **3.4** | armado de contratos JSON |
| Merge | `n8n-nodes-base.merge` | **3.0** | unión de ramas |
| Google Sheets | `n8n-nodes-base.googleSheets` | **4.7** | todas las lecturas y escrituras |
| Telegram | `n8n-nodes-base.telegram` | **1.2** | envío de mensajes y botones |
| Schedule Trigger | `n8n-nodes-base.scheduleTrigger` | **1.2** | WF7 — crones |
| Wait | `n8n-nodes-base.wait` | **1.1** | backoff entre reintentos |
| Split In Batches | `n8n-nodes-base.splitInBatches` | **3.0** | recorrido de categorías |
| Split Out | `n8n-nodes-base.splitOut` | **1.0** | expansión de arrays |
| Aggregate | `n8n-nodes-base.aggregate` | **1.0** | agregación para resúmenes |
| No Op | `n8n-nodes-base.noOp` | **1.0** | puntos de unión |
| Sticky Note | `n8n-nodes-base.stickyNote` | **1.0** | documentación en el lienzo |

## Sin precedente en la instancia

Ningún workflow de los 112 los usa, así que no hay evidencia empírica. Se usa `typeVersion: 1`, el suelo garantizado: n8n siempre puede cargar la versión 1 de un nodo.

| Nodo | `type` | typeVersion | Uso | Riesgo |
|---|---|---|---|---|
| Execute Workflow | `n8n-nodes-base.executeWorkflow` | **1** | WF1 → WF2/WF3/WF5/WF6; WF2/WF3 → WF4 | Bajo. v1 no trae el modo "wait for sub-workflow" configurable; el diseño no lo necesita |
| Execute Workflow Trigger | `n8n-nodes-base.executeWorkflowTrigger` | **1** | entrada de WF2…WF6 | Bajo |
| Error Trigger | `n8n-nodes-base.errorTrigger` | **1** | WF8 | Bajo. Nodo estable desde hace años |
| Crypto | `n8n-nodes-base.crypto` | **1** | SHA-256 de adjuntos, hash del `transaccion_id` | Bajo. Alternativa lista: `crypto` nativo dentro de un Code node |

**Plan B si alguno falla al importar:** `crypto` se reemplaza por dos líneas en un Code node (`require('crypto').createHash('sha256')`). Los otros tres no tienen sustituto — son el andamiaje de la arquitectura de subworkflows. Si `executeWorkflow` v1 diera problema, se sube a la versión que muestre el editor al arrastrar el nodo a mano.

## Prohibidos

| Categoría | Motivo |
|---|---|
| Nodos de comunidad (`n8n-nodes-<vendor>.*`) | DEC-015. `communityNodesEnabled: true` en la instancia, pero se rompen en upgrades y complican el diagnóstico. `scripts/validate-workflows.js` falla si detecta uno. |
| `@n8n/n8n-nodes-langchain.*` | No hace falta: el `AI Gateway` es un HTTP Request. Evita acoplarse a nodos de IA que cambian de forma entre versiones (DEC-008). |
| Nodo nativo de OpenAI/Anthropic | Mismo motivo. |

## Ajustes de workflow

Valores observados en la instancia, replicados en nuestros exports:

```json
"settings": {
  "executionOrder": "v1",
  "timezone": "America/Bogota",
  "errorWorkflow": "<id de FIN — SYS Manejador de Errores>",
  "callerPolicy": "workflowsFromSameOwner"
}
```

`executionOrder: v1` está en 110 de los 112 workflows. Los 2 sin él son anteriores a que el ajuste existiera.

`callerPolicy: workflowsFromSameOwner` en WF2…WF6: impide que un workflow de otro proyecto de la instancia los invoque por accidente.

---

## Cómo re-medir

Tras cada upgrade de n8n, o si un import falla:

```bash
source .env
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
  "$N8N_API_URL/workflows?limit=250" -o /tmp/wfs.json

python3 - <<'PY'
import json, collections
d = json.load(open('/tmp/wfs.json'))['data']
mx = collections.defaultdict(float)
for w in d:
    for n in w.get('nodes', []):
        mx[n.get('type','')] = max(mx[n.get('type','')], float(n.get('typeVersion',1) or 1))
for t, v in sorted(mx.items()):
    if t.startswith('n8n-nodes-base.'):
        print(f"{t[15:]:<28} {v}")
PY
```

Si un `typeVersion` de esta tabla sube, no hay que hacer nada: n8n mantiene compatibilidad hacia atrás. Solo importa si un nodo desaparece o si el editor marca "unknown node type".
