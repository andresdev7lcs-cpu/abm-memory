# Herramientas n8n — ABM

Copiado desde Samsung USB / PVSC_App el 2026-06-19.

## n8n-skills/
7 skills para Claude Code al construir workflows n8n:

| Skill | Uso |
|-------|-----|
| `n8n-expression-syntax` | Sintaxis `{{}}`, `$json`, `$node["X"].json` |
| `n8n-code-javascript` | Code nodes JS, retorno `[{json:{}}]`, `$input.all()` |
| `n8n-code-python` | Code nodes Python |
| `n8n-mcp-tools-expert` | Herramientas MCP: `get_node`, `validate_node` |
| `n8n-node-configuration` | Configurar nodos correctamente |
| `n8n-validation-expert` | Interpretar errores de validación |
| `n8n-workflow-patterns` | Patrones: webhook, HTTP API, DB, AI, scheduled |

**Cargar skill:** `skills/n8n-code-javascript/skill.md`

## n8n-mcp/
Servidor MCP para n8n — da acceso a 800+ nodos, validación, templates.

**Docs clave:**
- `CLAUDE.md` — instrucciones para Claude
- `README.md` — setup completo
- `N8N_HTTP_STREAMABLE_SETUP.md` — configurar HTTP streamable

## Reglas críticas (de los skills)

```javascript
// ✅ Referenciar nodo anterior
$node["Nombre Nodo"].json.campo

// ✅ Return correcto en Code node
return [{json: {campo: valor}}];

// ✅ Acceder todos los items
const items = $input.all();

// ❌ NO funciona
$prevNode.json.campo
$('Nombre').item.json.campo
return {campo: valor};  // sin wrapper
```
