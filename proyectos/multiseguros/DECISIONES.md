# DECISIONES — Multiseguros del Sur

> Qué se decidió y POR QUÉ. Para no re-discutir lo ya resuelto y entender el razonamiento.
> Formato: fecha · decisión · por qué · quién.

---

| Fecha | Decisión | Por qué | Quién |
|-------|----------|---------|-------|
| 2026-06-12 | Pasar de piloto a producción real | El cliente confirmó que quiere la solución | Andrés + cliente |
| 2026-06-12 | Construir los 3 módulos en SECUENCIA, no en paralelo | Andrés es solo uno, aprendiendo. Paralelo garantiza 3 cosas al 40% y cero facturado. Secuencial maximiza ROI visible por fase. | Fable |
| 2026-06-12 | Módulo financiero solo planteado, no construido ahora | Es el más difícil y frágil (scraping de portales de aseguradoras sin API). Va cuando haya ingresos. | Fable |
| 2026-06-12 | Voz IA (ElevenLabs) descartada por ahora | El cuello de botella real es visibilidad centralizada para gerencia, no experiencia de voz. La voz agrega 40% costo dev por un feature de uso incierto. | Fable |
| 2026-06-12 | WhatsApp: Evolution API para piloto, 360dialog para producción | Evolution es gratis pero Meta puede banear el número. Para producción real se necesita estabilidad. | Fable |
| 2026-06-12 | El "AndyBot" es un sistema de archivos, NO un programa autónomo | No existe IA que se auto-mejore sola. La continuidad vive en archivos que los cerebros leen. Construirlo grande y autónomo primero = perseguir un unicornio. | Fable |
| 2026-06-12 | AndyBot usa GPT (barato) como conserje; Fable como asesor externo | Optimización de costos: GPT para consultas simples, Claude/Fable reservado para lo difícil. | Andrés |
| 2026-06-12 | Claves en Bitwarden, NUNCA en el repo | Una subcarpeta de contraseñas en GitHub = regalar las llaves del negocio si se expone. Bitwarden es el blackbox real. | Fable |
| 2026-06-12 | ANDYBOT vive en GitHub privado, no en USB | El USB es bomba de tiempo: si se daña, se pierde todo. GitHub da acceso desde cualquier dispositivo + rewind. | Fable |
| 2026-06-12 | Whisper vía API de OpenAI en n8n (no instalación local) | Funciona desde el móvil, no requiere instalar nada, integra con el flujo de Telegram. | Andrés |
| 2026-06-15 | MIGRAR A SUPABASE (definitivo) | Producción real necesita roles por usuario, permisos por ramo (RLS) y concurrencia. Airtable no los soporta bien. Hacerlo ahora evita reconstruir todo después. | Andrés + Fable |
| 2026-06-15 | Orden: migrar a Supabase ANTES de importar P2 (Opción B) | Importar P2 sobre Airtable es construir sobre algo que se desmonta en 2 semanas. P2 nace conectado a la base definitiva, sin retrabajo. | Andrés + Fable |
| 2026-06-15 | Esquema MULTI-RAMO desde el inicio (Autos, Hogar, Vida, SOAT) | Agregar campo `ramo` ahora cuesta casi lo mismo que solo-Autos. Rediseñar después con datos cargados y workflows conectados es el retrabajo doloroso. La estructura aguanta los 4 ramos aunque al inicio solo se use Autos. | Fable (decisión delegada) |
| 2026-06-15 | Tablas y columnas de Supabase en ESPAÑOL | Los datos de negocio son en español (pólizas, siniestros). Más legible para Andrés y el equipo. Convención para todos los proyectos. | Andrés |
| 2026-06-15 | Tabla `asesores` (no "trabajadores") con rol y ramo | Roles: asesor / supervisor / gerente. Un ramo tiene varios asesores. Supervisor y gerente ven y editan TODO. | Andrés |
| 2026-06-15 | Cliente se asigna al RAMO, no a un asesor-persona | Cualquier asesor del ramo lo atiende. El acceso se decide por ramo, no por dueño individual. Simplifica permisos y refleja cómo operan. | Andrés |

---

## Decisión abierta (sin resolver)

- (ninguna por ahora)
