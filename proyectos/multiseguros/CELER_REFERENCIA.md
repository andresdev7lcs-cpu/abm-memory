# CELER (AIS Cloud) — El CRM actual de Multiseguros — ANÁLISIS REAL DE CAPTURAS

> Software: "AIS Cloud" de Celer Software de Seguros. Versión v11 (30-09-2025).
> Usuario visto: STEFANIA (STSF). Es desktop, legacy, sin IA, sin móvil.
> Regla de producto: respetar SU lógica, no copiar su tamaño.
> Análisis de 13 capturas reales, 2026-06-15.

---

## Navegación: 7 módulos en barra superior
Personas · Actividades · Pólizas · Vehículos · Siniestros · Pendientes · Pagos

## Panel de inicio (KPIs que el gerente ve cada mañana)
- Cumpleaños de hoy (lista de clientes)
- Cartera al [fecha]: valor en pesos (ej: $21,988,301,967), nº documentos, nº días
- Pólizas sin renovar (ej: 5249)
- Pólizas a vencer (ej: 41)

---

## MÓDULO PERSONAS (el centro de todo)
Maneja NATURALES (C.C) y JURÍDICAS (NIT) — no solo personas, también empresas.
Ficha con 11 tabs: Detalle, Contactos, Perfil, Actividades, Ejecutivos y unidades,
Pólizas, Cartera, Pendientes, Siniestros, Asegurados.App, Vinc.Indirectas.

Campos del Detalle (persona natural):
- Tipo (Natural/Jurídica), Tipo Doc (C.C/NIT/etc), Identificación
- Nombres, Primer apellido, Segundo apellido
- Fecha expedición, Expedida en (país), Municipio
- Prefijo, Género, Estado civil
- Nacido en (país), Municipio, Nacido el, Edad, Peso, Estatura
- Estrato social, Medio de contacto, Apartado aéreo
- Profesión, Ocupación
- Secciones colapsables: Información de contacto, Información financiera, Otra información, Observaciones

Lista de personas (Control de personas) muestra:
- Nombre, Tipo Doc, Identificación, Tel.Oficina, Tel.Residencia,
  Celular Personal, Celular Oficina, Dir.Personal, Dir.Oficina, Mail Personal, Mail Oficina
  -> IMPORTANTE: múltiples teléfonos, direcciones y correos por persona.

## MÓDULO PÓLIZAS
Lista (Control de pólizas) muestra:
- Nº Póliza, F.Inicio, F.Fin, Vigente, Cancelada, Tomador, Ramo, Subcompañía(aseguradora), Modalidad
Filtros: por póliza específica, por partes, por tomador, por aseguradora/ramo, por documento.

Ficha de póliza (10 tabs): Información básica, Otros datos, Info.Productor, Riesgos,
Documentos, Siniestros, Pendientes, Actividades, Operaciones, Observaciones y URL.
Campos: Nº Póliza, Estado (SIN RENOVAR/vigente/etc), Aseguradora, Nombre comercial,
Ramo, Plan, Modalidad, Vigencia inicial, Vigencia actual (Inicio/Fin), Sucursal,
País y Municipio expedición, Tomador, Pagador (pueden ser distintos).
Ramos vistos: AUTOMOVILES, CUMPLIMIENTO, RC EXTRACONTRACTUAL, SALUD FAMILIAR,
VIDA GRUPO, MULTIRIESGO, ARRENDAMIENTO.

## MÓDULO VEHÍCULOS
Lista: Placa, Tipo, Marca, Fasecolda, Línea, Modelo(año).
Ficha: Placa, Clase, Marca, Fasecolda, Línea, Modelo, Color, Servicio,
Cilindraje, Motor, Chasis, Peso(T), Pasajeros, Circulación país/municipio,
Vencimiento revisión técnico-mecánica, Observaciones. Tab Pólizas asociadas.

## MÓDULO SINIESTROS
Lista: Cons, F.Ocurrencia, Nº Póliza, Tomador, Asegurado, Vehículo, Ramo,
Aseguradora, Estado (AVISADO/DEFINIDO), V.Indemnizado, Detalle.
Ficha (3 tabs): Información básica, Control, Actividades.
Campos: Nº Siniestro Aseguradora, Póliza, Tomador, Vigencia afectada (F.Inicio/F.Fin),
Asegurado, Fecha ocurrencia, Fecha notificación al asesor, Fecha notificación aseguradora,
Detalle, Documentos presentados, Observaciones.

## MÓDULO PENDIENTES (trámites/solicitudes a aseguradoras)
Lista: Cons, Tipo, Aseguradora, Ramo, Tomador, F.Inicio, F.Definición, Estado, Días, Póliza, Responsable, Desc.
Ficha (3 tabs): Información básica, Remisorios, Actividades.
Campos: Tipo (Solicitud/etc), Tiempo en días, Aseguradora, Ramo, Solicitud, Operación,
Prima, Tomador, Asegurado, Descripción, Responsable, Contacto aseguradora,
Estado (ej: PENDIENTE POR LA ASEGURADORA), F.Inicio, H.Inicio, F.Fin, etc. Botón "Crear póliza".

## MÓDULO ACTIVIDADES (con calendario)
Vista calendario mensual + lista de actividades del día.
Campos: Cons, Descripción, F.Inicio, F.Fin, Clase actividad, Estado, Vínculo, Usr.Registro.
Sección "Seguimientos de hoy": F.Inicio, Hora, F.Plazo, Tipo, Descripción, Estado,
Usr.Solicita, Asociada con, Tipo contacto, Acción. Botón "Nueva actividad".
Se puede asociar a Persona, Póliza, Siniestro o Pendiente.

## MÓDULO PAGOS
Existe pero es financiero -> BACKLOG (no en MVP).

---

## IMPLICACIONES PARA EL ESQUEMA SUPABASE (correcciones)
1. "clientes" -> debe llamarse "personas" y soportar natural/jurídica (tipo + tipo_doc).
2. personas necesita MÚLTIPLES contactos (varios tel/dir/mail) -> o campos separados o tabla contactos.
3. polizas: agregar tomador vs pagador, plan, modalidad, sucursal, vigencia_inicial vs vigencia_actual, municipio.
4. vehiculos: agregar clase, fasecolda, linea, color, servicio, cilindraje, motor, chasis, pasajeros, venc_tecnomecanica.
5. siniestros: agregar num_siniestro_aseguradora, asegurado, vehiculo, fechas de notificación (asesor y aseguradora), v_indemnizado, estado avisado/definido.
6. AGREGAR tabla "pendientes" (trámites a aseguradoras) — no estaba en el diseño.
7. actividades: puede asociarse a persona, póliza, siniestro O pendiente (no solo cliente).
8. Pagos -> backlog.
