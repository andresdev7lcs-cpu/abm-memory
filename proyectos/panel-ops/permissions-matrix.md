# Permissions Matrix — Panel-Ops

**Version:** 1.0. Enforced server-side per request. Roles from `Users` table:
`management` (M), `sales` (S), `billing` (B). Production has **no account** — receives
exported technical documents only.

| Capability | M | S | B |
|---|---|---|---|
| View dashboard / Kanban / reports | ✔ | ✔ | ✔ (payment views + approved tickets) |
| Create/edit customers | ✔ | ✔ | — |
| Create tickets | ✔ | ✔ | — |
| Edit parts (before payment confirmed) | ✔ | ✔ | — |
| Edit parts (after payment confirmed) | exception flow only | — | — |
| Commercial state transitions | ✔ | ✔ | — |
| Create/send quotations | ✔ | ✔ | — |
| Record customer decision | ✔ | ✔ | — |
| See prices/margins/quoted values | ✔ | ✔ | ✔ (amounts on approved tickets) |
| Register payment | ✔ | ✔ | ✔ |
| **Confirm payment** | — | — | **✔ only** |
| Attach payment evidence | ✔ | ✔ | ✔ |
| Edit price tables | ✔ | — | — |
| Extend quotation validity | ✔ | — | — |
| Authorize exceptional commercial adjustment | ✔ | — | — |
| Reopen / cancel tickets | ✔ | ✔ (cancel own, reason req.) | — |
| Reopen closed/lost | ✔ | — | — |
| Configuration (VAT, waste, thresholds) | ✔ | — | — |
| User administration | ✔ | — | — |
| View all documents | ✔ | ✔ | payment + quotation docs |
| Delete anything physically | — | — | — |

## Data-visibility rules

- Production package (export): technical fields only — order id, parts, material, ref, thickness, dims, grain, edges, tape, cutting plan, notes. **Whitelist enforced in adapters.**
- B must not edit dimensions or commercial prices (server rejects).
- Customer tax-ID data visible to B for invoicing.

## Future AI agents (any phase)

Prohibited regardless of role wiring: confirm payments, change prices, modify paid
quotations, resolve ambiguous dimensions silently, delete original requests, close
orders without evidence, release orders to production.
