# Workflow State Machine — Panel-Ops

**Version:** 1.0. Server-enforced. Matrix stored as JSON in `Configuration.transition_matrix`
(versioned); this document is the human-readable source the JSON is generated from.

## States

| # | ID | English | Español | Category | Aging-critical (internal 1h) |
|---|---|---|---|---|---|
| 1 | `received` | Request received | Solicitud recibida | intake | yes |
| 2 | `incomplete` | Incomplete information | Información incompleta | intake | no (waiting on customer) |
| 3 | `review` | Under review | En revisión | intake | yes |
| 4 | `awaiting_confirmation` | Awaiting customer confirmation | Esperando confirmación cliente | intake | no |
| 5 | `confirmed` | Data confirmed | Datos confirmados | commercial | yes |
| 6 | `quoting` | Quotation in preparation | Cotización en preparación | commercial | yes |
| 7 | `quote_sent` | Quotation sent | Cotización enviada | commercial | no |
| 8 | `awaiting_approval` | Awaiting approval | Esperando aprobación | commercial | no |
| 9 | `approved_unpaid` | Approved — awaiting payment | Aprobada — esperando pago | payment | no |
| 10 | `payment_verifying` | Payment under verification | Pago en verificación | payment | yes |
| 11 | `payment_confirmed` | Payment confirmed | Pago confirmado | payment | yes |
| 12 | `ready_production` | Ready for production | Lista para producción | production | yes |
| 13 | `in_production` | In production | En producción | production | no |
| 14 | `ready_delivery` | Ready for delivery | Lista para entrega | production | yes |
| 15 | `delivered` | Delivered | Entregada | production | no |
| 16 | `closed` | Closed | Cerrada | closed (terminal) | — |
| 17 | `lost` | Lost / cancelled | Perdida / cancelada | closed (terminal) | — |

## Transition Matrix

Legend: S=sales, M=management, B=billing, SYS=system. `lost` reachable from every
non-terminal state (S or M, `loss_reason` required). `M` may additionally reopen: `closed→review`, `lost→review` (exception, Activity note required).

| From \ To | allowed |
|---|---|
| `received` | `incomplete` (S) · `review` (S) |
| `incomplete` | `review` (S) |
| `review` | `incomplete` (S) · `awaiting_confirmation` (S) · `confirmed` (S) |
| `awaiting_confirmation` | `review` (S) · `confirmed` (S, confirmation evidence required) |
| `confirmed` | `quoting` (S) |
| `quoting` | `quote_sent` (S, quotation version required) |
| `quote_sent` | `awaiting_approval` (S) · `quoting` (S, new version) |
| `awaiting_approval` | `approved_unpaid` (S, decision=approved) · `quoting` (S, changes_requested) |
| `approved_unpaid` | `payment_verifying` (S or B, payment registered) |
| `payment_verifying` | `payment_confirmed` (**B only**) · `approved_unpaid` (B, payment rejected) |
| `payment_confirmed` | `ready_production` (SYS/S — automatic after commercial snapshot locked) |
| `ready_production` | `in_production` (S) |
| `in_production` | `ready_delivery` (S) |
| `ready_delivery` | `delivered` (S, delivery evidence) |
| `delivered` | `closed` (S or M) |

## Guards (server-side, in addition to role)

1. `awaiting_confirmation → confirmed`: at least 1 part row, all required part fields valid, confirmation evidence document attached OR Activity note with evidence reference.
2. `quoting → quote_sent`: quotation version exists with full price snapshot; PDF generated.
3. `awaiting_approval → approved_unpaid`: decision recorded on active quotation version.
4. `approved_unpaid → payment_verifying`: Payment row exists (status=registered/verifying).
5. `payment_verifying → payment_confirmed`: actor role = billing; payment evidence attached; amount recorded.
6. `payment_confirmed → ready_production`: commercial snapshot frozen (`Quotations.immutable=true`), technical package generable. **No other path into ready_production exists.**
7. Quotation expiry: SYS marks quotation `expired` after `valid_until`; ticket stays in place, label `price update required` added; re-quote required before approval.
8. Any transition writes Activity row; invalid transition returns explicit error listing allowed targets.

## Aging Rule

Alert when `now - last_activity_at > 60 min` AND state is aging-critical AND `waiting_on=internal`.
Cards always show: stage age, total age, owner, next action, blocking reason, customer-waiting flag, severity.
