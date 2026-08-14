# GUION DE DEMO — MSDS-CRM
**Para:** Gerencia (Fabio) · **Presenta:** Andrés Palomares · **Fecha:** 2026-08-06
**Duración objetivo:** 20 minutos (12 demo + 8 conversación)
**Objetivo:** mostrar el sistema funcionando y justificar el avance entregado.

---

## ANTES DE ENTRAR A LA REUNIÓN (10 min de preparación)

Checklist técnico. Marca cada uno:

**Primero, corre la verificación automática:**

```bash
cd ~/Documents/Proyectos/ABM
./tools/demo-msds.sh check
```

Debe responder los tres en OK:

```
Motor n8n .......... OK
Webhook ............ OK
Telegram ........... OK
```

Si alguno falla, no improvises en la reunión: usa el plan B (capturas).

**Luego, levanta el panel** (en una terminal aparte, déjala corriendo toda la reunión):

```bash
cd ~/Documents/Proyectos/ABM/proyectos/multiseguros
python3 -m http.server 8000
```

Y abre → **http://localhost:8000/gerencia.html**

> ⚠️ Si abres el archivo con doble clic (`file://`) el panel **no carga datos** — el navegador bloquea las llamadas a la base. Tiene que ser por `http://localhost:8000`.

**Después:**

- [ ] Confirmar que los KPIs cargan números (no ceros ni "—")
- [ ] Ir a la pestaña **Comunicaciones** y dejarla ahí
- [ ] Abrir Telegram en tu teléfono, chat con **@MSDS_Gerencia_N_bot**
- [ ] Terminal abierta en `~/Documents/Proyectos/ABM`, con `./tools/demo-msds.sh` escrito **sin dar Enter**
- [ ] **Tomar dos capturas de respaldo ahora** (bandeja con registro + notificación Telegram) por si falla la red
- [ ] Verificar conexión a internet estable

**Plan B si falla la red:** las capturas del punto anterior + la evidencia verificada del 2026-08-06 (sección "Evidencia" al final).

---

## GUION — 12 MINUTOS

### 1. Apertura (1 min) — El problema que resolvemos

> "Antes, cuando llegaba una solicitud de un cliente por WhatsApp, dependía de que alguien la viera, la anotara y la pasara. Si esa persona estaba ocupada, la solicitud se perdía o se atendía tarde. Lo que construimos hace que eso no dependa de la memoria de nadie."

**No digas:** términos técnicos (webhook, Supabase, n8n). Di: "el sistema", "la base de datos", "el motor de automatización".

---

### 2. La base de datos real (2 min) — Abre `gerencia.html`

Muestra los KPIs en pantalla. Números verificados hoy, 2026-08-06:

| Qué | Cantidad |
|-----|----------|
| Clientes migrados | **523** |
| Pólizas cargadas | 100 |
| Siniestros registrados | 9 |
| Comunicaciones registradas | 11 |
| Actividades | 10 |
| Asesores en el sistema | 14 |
| Bots configurados | 12 |

> "Estos 523 clientes estaban en Airtable, dispersos. Hoy están en una base propia de la empresa, con sus pólizas asociadas. Esto ya no depende de una herramienta externa que se pueda encarecer o caer."

**Acción en pantalla:** haz clic en un cliente → se abre la ficha. Muestra que ves sus pólizas y su historial.

---

### 3. El módulo de comunicaciones (2 min)

Ve a la pestaña **Comunicaciones** en `gerencia.html`.

> "Aquí llega todo lo que entra: WhatsApp, correo, lo que registremos a mano. Y queda con estado: sin responder, respondida, cerrada. Nada se pierde en un chat personal."

Muestra los filtros por canal y por estado.

---

### 4. DEMO EN VIVO (3 min) — El momento clave

**Este es el punto fuerte. No lo saltes.**

---

#### El caso que vas a contar

No ejecutes un comando en silencio. Cuenta una historia que Fabio reconozca de su operación diaria:

> **Doña Marta, cliente de la agencia, se despierta un martes y se acuerda de que se le vence el SOAT esta semana. Toma el teléfono, busca el WhatsApp de Multiseguros y escribe: "Buenos días, se me vence el SOAT esta semana y necesito renovarlo. ¿Me pueden ayudar?"**

Ese es el mensaje que el sistema va a procesar delante de ellos. El texto real que se envía es exactamente ese — no es un "hola prueba 123".

---

#### Montaje antes de empezar (déjalo listo antes de que entren)

**Dos pestañas del navegador y el teléfono. Nada de terminal a la vista.**

| Qué | Dónde | Para qué |
|-----|-------|----------|
| **Pestaña 1** | `http://localhost:8000/gerencia.html` → pestaña Comunicaciones | El panel que ellos miran |
| **Pestaña 2** | `http://localhost:8000/simulador.html` | El "teléfono de Marta" con el botón |
| **Teléfono** | Telegram en @MSDS_Gerencia_N_bot, pantalla encendida | La notificación |

Cambias entre pestañas con `Cmd+Tab` dentro de Chrome, o `Cmd+1` / `Cmd+2`.

> **La terminal la usas solo antes de que entren** (para el `check` y el `reset`). Durante la reunión, minimízala. Si te ven escribir comandos, la conclusión natural de un gerente es *"o sea que mi equipo tiene que aprender esto"* — y no es cierto.

> ⚠️ **Sobre el teléfono — leer esto con atención.** El chat `8695082898` es **tu terminal de prueba**, no el teléfono personal de Fabio. La notificación llega a **tu** Telegram. Nunca digas "mire su teléfono, Fabio" — no le va a llegar nada y la demo se cae ahí mismo.
>
> Lo correcto es mostrar **tu** pantalla y decir: *"Esta notificación llegó al bot de Gerencia Neiva, que es el único activado hoy. Cuando cada asesor active el suyo, esto mismo le llega a cada uno en su área."* Así el bloqueo del equipo queda demostrado en vez de escondido.

---

#### Los 5 pasos, con lo que dices en cada uno

**Paso 1 — Plantea la escena (20 seg)**

**Señala primero el contador "Hoy", que está en 0.** Ese cero es tu mejor aliado.

> "Les voy a mostrar qué pasa cuando un cliente escribe. Miren este contador: comunicaciones de hoy, cero. No ha entrado nada en la mañana."
>
> "Ahora imaginen que doña Marta acaba de mandar un WhatsApp porque se le vence el SOAT."

Que vean el **antes**: contador en 0 y la bandeja con 4 registros viejos. Sin el "antes", el "después" no impresiona.

> 💡 Los KPIs "WhatsApp 30 días" y "Email 30 días" también están en 0 porque los registros demo son de julio y quedan fuera de la ventana de 30 días. Es correcto. Si alguien pregunta: *"esos contadores miran los últimos treinta días; los registros de ejemplo son más viejos. Cuando entre movimiento real, se llenan solos."*

---

**Paso 2 — Envía el mensaje (5 seg)**

Cambia a la pestaña del **simulador** (`http://localhost:8000/simulador.html`). Se ve como una pantalla de WhatsApp con el mensaje de Marta.

Haz clic en **"Enviar mensaje"**.

Di: *"Marta acaba de darle enviar."*

El simulador responde en verde:

> **Mensaje registrado en 1.2 segundos**
> Ya aparece en el panel de gerencia y el responsable recibió la notificación en Telegram.

Señala el tiempo. *"Segundo y medio."*

> ⚠️ **No uses la terminal delante de ellos.** Si te ven escribir comandos, van a pensar que el equipo tiene que aprender eso. El simulador existe justo para evitarlo.

---

**Paso 3 — Espera 2 segundos (no lo llenes de palabras)**

Silencio corto. Deja que el sistema trabaje. Si hablas encima, se pierde el efecto.

---

**Paso 4 — Recarga la bandeja (30 seg)**

`F5` en `gerencia.html`, pestaña Comunicaciones.

**Señala el contador "Hoy" primero: pasó de 0 a 1.** Ese salto delante de sus ojos vale más que cualquier explicación.

> "Ahí está el contador. Estaba en cero hace diez segundos."

Y abajo aparece el registro:

| Campo | Lo que se ve |
|-------|--------------|
| Canal | whatsapp |
| Remitente | +573001234567 |
| Asunto | Renovación SOAT |
| Mensaje | "Buenos días, se me vence el SOAT esta semana y necesito renovarlo. ¿Me pueden ayudar?" |
| Estado | **nueva** (sin responder) |
| Fecha | la hora exacta, al segundo |

Di:

> "Ahí está. Con hora exacta, con el número del cliente, y marcada como *sin responder*. Nadie escribió esto a mano. Y mientras siga en *sin responder*, va a seguir apareciendo en la bandeja — no se puede olvidar."

---

**Paso 5 — Muestra la notificación (30 seg)**

Levanta tu teléfono. En Telegram llegó:

```
📨 Nueva comunicación whatsapp

De: +573001234567
Asunto: Renovación SOAT
Mensaje: Buenos días, se me vence el SOAT esta semana y necesito renovarlo. ¿Me pueden ayudar?

Estado: sin responder
Ver en dashboard → Comunicaciones
```

Di:

> "Al mismo tiempo, el responsable del área recibe esto en su Telegram. No tiene que estar mirando el panel: el sistema lo busca a él."

---

#### El cierre del momento (la frase que importa)

> "De que el cliente escribe a que queda registrado y el responsable notificado: **un segundo y medio**, sin que nadie tocara nada. Hoy eso depende de que alguien vea el WhatsApp, se acuerde y lo pase. Los martes a las ocho de la mañana, con veinte mensajes acumulados, eso falla. El sistema no se distrae."

---

#### VERSIÓN LARGA: los tres casos seguidos (6 min)

Si hay tiempo, esta versión es bastante más convincente que un solo caso. Muestra tres tipos de trabajo distintos entrando por dos vías distintas, y cada uno instala un argumento diferente.

**Recorre el desplegable de arriba hacia abajo. No recargues el panel entre casos** — manda los tres y recarga una sola vez al final. El contador salta de **0 a 3** de un golpe, y eso pega más fuerte.

---

**Caso 1 — Siniestro por llamada** *(lo registra el gerente)*

La pantalla cambia: se pone azul y ya no parece un WhatsApp, sino una nota interna. El botón dice **"Registrar la llamada"**.

> "Primero el caso que no entra solo. Un cliente llama al conmutador reportando un choque en la vía a Campoalegre. Alguien lo atiende y cuelga. Hoy, ¿qué pasa con esa llamada? Queda en la cabeza de quien contestó, o en un papelito."
>
> *(clic en Registrar la llamada)*
>
> "Ahora queda registrado, con hora, y el sistema empieza a contar el tiempo desde este momento."

**Lo que instala:** que el sistema no es solo para WhatsApp. Sirve para lo que entra por teléfono, que es donde más se pierde.

---

**Caso 2 — Renovación vencida hace 3 días** *(entra sola por WhatsApp)*

> "Segundo caso. Doña Marta escribe porque se dio cuenta de que la póliza se le venció hace tres días. Miren la diferencia: este no lo registró nadie. Entró solo."
>
> *(clic en Enviar mensaje)*
>
> "Y este es el caso que más plata cuesta. Una renovación vencida hace tres días todavía se recupera. Vencida hace tres semanas, el cliente ya se fue con otro. La diferencia entre las dos cosas es que alguien lo vea a tiempo."

**Lo que instala:** el costo directo de no tener el sistema. Es el argumento de plata, y conviene decirlo mirando a Fabio.

---

**Caso 3 — Clínica odontológica, RC profesional** *(entra sola por WhatsApp)*

> "Tercero. Una clínica odontológica con cuatro odontólogos pide cotización de responsabilidad civil profesional. Esto no es un SOAT: es una póliza empresarial, de las que dejan buena comisión."
>
> *(clic en Enviar mensaje)*
>
> "Un negocio así no se puede quedar sin responder tres días porque el mensaje se perdió entre veinte chats."

**Lo que instala:** que el sistema protege los negocios grandes, no solo el trámite chiquito.

---

**Ahora sí, `Cmd+1` y F5.**

> "Miren el contador: estaba en cero cuando empezamos. Ahora dice tres."

Y en la bandeja se ven los tres, cada uno con su canal — una llamada y dos WhatsApp — todos marcados **sin responder**.

> "Tres tipos de trabajo distintos, entrando por dos vías distintas, en menos de un minuto. Todos con hora exacta y todos marcados como pendientes. Ninguno depende de que alguien se acuerde."

---

**El cierre de la versión larga** — enlaza directo con el punto 5:

> "Y fíjense en el primero, el del choque. Ese es el que no puede esperar. Por eso el sistema no solo lo registra: lo vigila. De eso les hablo ahora."

---

#### "¿Y mi equipo tiene que usar eso?"

Si alguien pregunta qué es el simulador, o si el equipo debe aprender algo técnico, la respuesta es clara:

> "No. Esta pantalla es solo para la demostración: hace de teléfono del cliente, porque no íbamos a pedirle a un cliente real que escriba ahorita."
>
> "El asesor no ve nada de esto. Él usa dos cosas que ya sabe usar: **su Telegram**, donde le llegan los avisos, y **el panel**, cuando quiera revisar. El cliente usa su WhatsApp de siempre. Nadie aprende una herramienta nueva."

**Este es un punto de venta, no una disculpa.** La adopción es la razón número uno por la que fracasan los sistemas internos. Que no haya nada que aprender es un argumento fuerte — dilo con esa seguridad.

Si preguntan cómo entra el WhatsApp real:

> "Falta conectar la línea de WhatsApp de la empresa al sistema. Es una configuración, no una construcción — el sistema ya sabe recibir; hay que apuntarle la línea. Va en la misma fase de publicar el panel."

---

#### Si tocas algo por accidente

Los botones del panel (Respondida / Cerrar) **escriben de verdad** en la base. Si le das a uno sin querer, el registro cambia de estado y se queda así.

No es grave y no se pierde nada — se restaura con:

```bash
./tools/demo-msds.sh reset
```

Deja los 4 registros como deben verse al empezar: respondida / nueva / respondida / cerrada, y borra cualquier ensayo.

**Corre `reset` siempre después del `check`** — el chequeo previo deja un registro "Chequeo previo" que no quieres que Fabio vea en la bandeja.

---

#### Si algo falla en vivo

**No te disculpes ni empieces a depurar delante de ellos.** Di:

> "La red del sistema está lenta ahorita. Les muestro la prueba que corrí esta mañana, es exactamente lo mismo."

Y pasas a las capturas. Ten listas dos: la bandeja con el registro y la notificación de Telegram. **Tómalas hoy mismo, antes de la reunión.**

---

**Verificado el 2026-08-06 antes de escribir esto:** ejecuté el flujo completo tres veces. Webhook respondió en 1.10s, 1.39s y 1.4s. Los registros quedaron guardados (ids 11, 12, 13) y luego los borré para no ensuciar la bandeja. La entrega de Telegram se confirmó por separado (message_id 83).

---

### 4b. El correo que se registra a mano (2 min) — OPCIONAL

`http://localhost:8000/correo.html`

**Aquí no automatizas nada: Fabio te ve trabajando.** Eso vende distinto, porque entiende que el sistema encaja con lo que ya hacen.

A la izquierda hay un correo real de **Ferretería El Martillo** (Neiva, 14 años, inventario de 180 millones, 6 empleados) pidiendo cotización de póliza empresarial. A la derecha, el formulario **vacío**.

> "Este caso no entra solo. Llega un correo y alguien tiene que pasarlo al sistema. Lo hago ahora, mirando el correo."

**Llena los campos delante de ellos** — no los tengas pre-llenados, la gracia es que vean el trabajo:

| Campo | Qué escribir |
|---|---|
| Correo del cliente | `gerencia@ferreteriaelmartillo.com` |
| Asunto | `Cotizacion poliza empresarial — ferreteria` |
| Canal | Correo electrónico |
| Área | Generales |
| Resumen | *Local, mercancía en bodega y RC. Inventario 180 millones, 6 empleados. Contacto Ramiro Peña 310 447 8890.* |

Clic en **Guardar en el CRM**.

> "Listo. Fíjense que aunque lo escribí yo, ya quedó con hora, con área asignada y marcado como pendiente. En la siguiente fase el correo entra solo. Pero incluso haciéndolo a mano, ya no se pierde ni depende de que yo me acuerde."

**Lo que instala:** que el sistema sirve desde hoy, sin esperar a que todo esté automatizado. Y prepara el terreno para cotizar la fase de correo automático.

---

### 4c. Comunicación interna — el pendiente para Jorge (3 min)

`http://localhost:8000/enrutamiento.html`

> ⚠️ **Lee esto antes de usarla.** Esta pantalla muestra **algo que funciona a medias, a propósito**. El pendiente se crea de verdad en el CRM; el aviso a Telegram falla porque Jorge no ha activado su bot. **Ese fallo es el punto.** No lo escondas ni lo maquilles — es tu mejor argumento para el pedido del punto 6.

**Cómo va:**

Se ve el Telegram de Fabio con el mensaje ya escrito: *"Informar a Jorge de reunión con AXA mañana a las 9am"*. Dale a enviar.

El panel de la derecha se ilumina paso a paso:

| Paso | Qué pasa | Estado |
|---|---|---|
| 1 · El MasterBot lee | Entiende que es una instrucción para otra persona. Saca: destinatario Jorge, asunto AXA, mañana 9am | ✅ funciona |
| 2 · Crea el pendiente | Se registra **de verdad** en el CRM, asignado a Jorge, con fecha | ✅ funciona |
| 3 · Avisa a Jorge | Busca su chat de Telegram → **no lo encuentra** | ⚠️ falta activar |

Y el bot le responde a Fabio: *"Listo. Pendiente creado para Jorge. ⚠️ No pude avisarle: Jorge todavía no ha activado su bot."*

**Lo que dices:**

> "Miren los dos primeros pasos: el bot entendió la instrucción y el pendiente ya quedó en el sistema, asignado a Jorge con fecha y hora. Eso funciona hoy."
>
> *(señalas el paso 3)*
>
> "El tercero no. El aviso sale del sistema pero no tiene a dónde llegar. Telegram no permite escribirle a alguien por su número de teléfono — necesita que la persona mande un `/start` a su bot una sola vez. Ahí Telegram genera el código de su chat y desde entonces el sistema le puede escribir siempre."
>
> "Tenemos el número de Jorge. Lo que falta es ese mensaje suyo. Treinta segundos, y solo lo puede hacer él."

**Después, `Cmd+1` al panel:** el pendiente "Reunión con AXA" aparece en el dashboard, asignado a Jorge, para mañana. **Eso es real** — quedó guardado.

> "El pendiente está ahí. Cuando Jorge active su bot, además le va a llegar el recordatorio al teléfono. Hoy tiene que entrar al panel a verlo."

**Por qué esta pantalla es la más útil de toda la demo:** deja de ser tu palabra contra la de nadie. Fabio *ve* dónde se corta el sistema y ve que la parte construida funciona. El pedido del punto 6 deja de sonar a excusa.

---

### 5. El monitor de tiempos de respuesta (2 min)

Explica sin abrir nada (o muestra la configuración de SLA):

> "El sistema vigila los siniestros. Si uno lleva 15 minutos sin que nadie lo atienda, alerta al responsable del área. Si a los 30 minutos sigue sin atenderse, escala automáticamente al supervisor. Eso significa que un caso urgente no se queda quieto porque alguien salió a almorzar."

Hay 6 reglas de tiempo configuradas en el sistema.

---

### 6. Los 12 bots — y el único punto que falta (2 min)

**Aquí viene el pedido. Sé directo, sin rodeos y sin culpar a nadie.**

Muestra la tabla:

| Área | Bot | Estado |
|------|-----|--------|
| Gerencia Neiva (Fabio) | @MSDS_Gerencia_N_bot | ✅ **Activo** |
| Gerencia Bogotá (Santiago) | @MSDS_Gerencia_B_bot | ⏳ Falta activar |
| Autos Nuevos (Gabriel) | @MSDS_Autos_N_bot | ⏳ Falta activar |
| Autos Renovaciones (Valentina) | @MSDS_Autos_R_bot | ⏳ Falta activar |
| Cartera (Geraldin) | @MSDS_Cartera_bot | ⏳ Falta activar |
| Caja (Natalia) | @MSDS_Caja_bot | ⏳ Falta activar |
| Generales (Aida) | @MSDS_Generales_bot | ⏳ Falta activar |
| Cumplimiento (Leonela) | @MSDS_Cumplimiento_bot | ⏳ Falta activar |
| Siniestros (Oscar) | @MSDS_Siniestros_bot | ⏳ Falta activar |
| Comisiones (Yamaira) | @MSDS_Comisiones_bot | ⏳ Falta activar |
| Supervisor (Jorge) | @MSDS_Supervisor_bot | ⏳ Falta activar |

Guion exacto:

> "Los 12 bots están creados, configurados y probados. Funcionan. Lo único que falta es que cada persona abra Telegram y le escriba `/start` a su bot. Es literalmente un mensaje, treinta segundos por persona. Sin eso, el sistema no sabe a qué teléfono mandar las alertas."
>
> "Fabio ya lo hizo — por eso las notificaciones que acaban de ver llegaron a su bot. Faltan diez asesores y Jorge."
>
> "Esto lleva pendiente desde el 27 de julio. No es un problema técnico de nuestro lado: la parte de sistema está lista y esperando. Necesito que salga desde gerencia como una instrucción, no como una sugerencia."

**Pide algo concreto:** una fecha. *"¿Puedo contar con que esté hecho el viernes?"*

---

## LO QUE SE ENTREGÓ (para la conversación de cobro)

Traducido a valor de negocio, no a tickets:

| Entregable | Qué significa para la empresa |
|------------|-------------------------------|
| 523 clientes migrados a base propia | La empresa deja de depender de Airtable. Los datos son suyos. |
| Panel de gerencia operativo | Ver clientes, pólizas, siniestros y comunicaciones en un solo lugar |
| Módulo de comunicaciones | Ninguna solicitud de cliente se pierde en un chat personal |
| 12 bots de Telegram configurados | Cada área recibe lo suyo, sin cadena de mensajes |
| Monitor automático de tiempos | Los casos urgentes escalan solos, sin depender de que alguien recuerde |
| 10 automatizaciones construidas | El trabajo repetitivo lo hace el sistema |
| Auditoría de seguridad hecha | La clave de acceso comprometida se eliminó del código y del historial |

**El estado en una frase:**
> "El CRM está 100% operativo. Los bots están 100% construidos y funcionando, pero al 9% de adopción porque falta que el equipo los active. La parte que dependía de nosotros está entregada."

---

## "¿DÓNDE VIVE ESTO Y CÓMO ENTRA EL EQUIPO?"

Es la pregunta que más probablemente haga un gerente. Responde con la verdad, que además juega a favor.

### Dónde está cada pieza — hoy

| Pieza | Dónde vive | ¿El equipo entra hoy? |
|-------|-----------|----------------------|
| **Base de datos** (523 clientes, pólizas, siniestros) | Supabase, en la nube. Servidor propio del proyecto | Sí — está en línea 24/7 |
| **Motor de automatización** (n8n) | Servidor en la nube (Easypanel), en línea | Sí — recibe mensajes 24/7 |
| **Los 12 bots de Telegram** | En los servidores de Telegram | Sí — en cuanto activen su bot |
| **El panel de gerencia** (`gerencia.html`) | ⚠️ **En mi computador todavía** | **No — este es el punto** |

### La frase para decirlo

> "El sistema en sí ya vive en internet: la base de datos, el motor que procesa los mensajes y los bots están en la nube, funcionando las veinticuatro horas. Eso no depende de que yo prenda mi computador — la prueba es que el mensaje que acabamos de mandar se procesó en servidores, no aquí."
>
> "Lo único que todavía corre desde mi equipo es esta pantalla, el panel. Está así a propósito, por dos razones: mientras estábamos ajustando, no tenía sentido publicarlo; y hay un tema de seguridad que quiero resolver antes de ponerlo en internet."

### Si preguntan "¿qué tema de seguridad?"

Sé transparente. Suma más que esconderlo:

> "Hoy el panel lleva la llave de acceso a la base de datos escrita dentro del archivo. Funciona bien para trabajar de forma local, pero si lo publico tal cual, cualquiera que abra el código de la página podría leer esa llave y entrar a los datos de los clientes. Antes de publicarlo hay que mover esa llave a un lugar seguro y poner un inicio de sesión por usuario. Es trabajo hecho, no un imprevisto — está en el plan."

### Si preguntan "¿entonces cuándo lo puede ver el equipo?"

> "Publicarlo toma cerca de una semana de trabajo. Incluye tres cosas: sacar la llave del código, poner usuario y contraseña por persona, y subirlo a un dominio de la empresa — algo tipo `panel.multisegurosdelsur.com`. Después de eso cada asesor entra desde el navegador de su celular o su computador, sin instalar nada."
>
> "Lo cotizo aparte cuando definamos si lo quieren ya o después de que los bots estén activos."

### El orden que debes recomendar

Si te preguntan qué hacer primero, ten la respuesta lista:

> "Yo haría primero los bots — es gratis y es un mensaje por persona. El panel publicado cuesta trabajo y es más útil cuando ya haya movimiento real que mirar. Activar bots esta semana, publicar el panel después."

Esto te posiciona recomendando lo barato primero, no vendiendo trabajo extra. Da credibilidad al pedido del punto 6.

### Qué NO decir

- ✗ "Está en mi computador" a secas → suena a que no hay nada hecho
- ✗ "Ya está todo en la nube" → falso, y si piden el link quedas mal
- ✗ Meterte en detalles de hosting, DNS o certificados → no les interesa

---

## "¿ME PASAS UN LINK PARA PROBARLO?"

**Respuesta corta: hoy no hay link, y no debe haberlo todavía.** Esto no es una excusa — es la respuesta técnicamente correcta, y así hay que presentarla.

### Por qué no

Verifiqué esto hoy contra el sistema real. La situación es:

El panel lleva escrita dentro del código la llave maestra de la base de datos. **Comprobé qué puede hacer alguien que copie esa llave del código de la página** (cualquiera que sepa oprimir "ver código fuente"):

- Leer los datos personales de los 523 clientes: nombre, cédula, teléfono, correo, dirección
- Crear clientes falsos
- Modificar cualquier registro
- **Borrar la base completa**

Lo probé: creé un cliente de prueba usando solo la llave que está en el código, y luego lo borré. Funcionó sin ninguna restricción.

Además, el panel **no tiene inicio de sesión**. No hay usuario ni contraseña. Quien tenga el link, entra.

### Cómo decirlo (sin asustar de más ni minimizar)

> "Hoy no te puedo pasar un link, y prefiero explicarte por qué en vez de improvisar uno."
>
> "El panel está construido y funciona — lo acabas de ver. Pero por dentro lleva la llave de acceso a la base escrita en el código de la página. Mientras corre en mi computador no hay problema. Si lo subo a internet tal como está, cualquiera que abra el código de esa página puede sacar esa llave y con ella leer, cambiar o borrar los datos de los 523 clientes. Sin contraseña, sin dejar rastro."
>
> "No te voy a entregar un link así. Publicarlo bien es una semana de trabajo y prefiero decírtelo hoy que tener que llamarte en tres meses por una fuga de datos."

### Si insiste — "aunque sea para verlo yo"

Ofrece alternativas reales, en este orden:

1. **Compartir pantalla** (hoy mismo, gratis) — *"Te comparto pantalla por videollamada cuando quieras y lo recorres conmigo."*
2. **Capturas del panel** (hoy mismo) — para que las lleve a junta
3. **Acceso temporal por una hora** — solo si es indispensable: se levanta un túnel, se muestra, se cierra. *"Pero sigue siendo el panel sin contraseña, así que no lo dejaría abierto ni un día."*
4. **Publicación bien hecha** — una semana, y ahí sí link permanente para todo el equipo

> ⚠️ **No cedas a un link permanente "provisional".** Los provisionales se quedan. Si publicas el panel con la llave adentro y algo pasa, la responsabilidad es de quien lo publicó — o sea tú.

---

## "¿CÓMO QUEDAN LOS PERMISOS DEL EQUIPO?"

Esta pregunta es una oportunidad: es la parte del trabajo que todavía no está hecha, y conviene que **él la pida** en vez de que tú la ofrezcas.

### La verdad de hoy

| | Estado actual |
|---|---|
| Inicio de sesión | ❌ No existe |
| Usuarios individuales | ❌ No existen |
| Perfiles o roles | ❌ No existen |
| Registro de quién hizo qué | ❌ No existe |
| Permisos por área | ❌ No existen |

> "Hoy el panel es una sola pantalla, sin usuarios. Quien lo abre ve todo y puede tocar todo. Está bien para lo que hemos hecho hasta ahora — que somos tú y yo revisando — pero no sirve para poner diez personas adentro."

### Lo que hay que definir — y esto lo decide él, no tú

Presenta una propuesta concreta. Que corrija, no que invente desde cero:

| Perfil | Ver | Crear | Editar | Borrar |
|--------|-----|-------|--------|--------|
| **Gerencia** (Fabio, Santiago) | Todo | Sí | Sí | Sí |
| **Supervisor** (Jorge) | Todo | Sí | Sí | No |
| **Asesor** (Gabriel, Valentina, Aida…) | Solo sus clientes | Sí | Solo los suyos | No |
| **Cartera / Caja** (Geraldin, Natalia) | Todo, solo lectura | No | Solo estado de pago | No |
| **Auditoría** (contador externo) | Todo, solo lectura | No | No | No |

Preséntala así:

> "Esta es mi propuesta de partida, pero la decisión es de ustedes. Las preguntas que necesito que me respondan son tres:"
>
> 1. **"¿Un asesor puede ver los clientes de otro asesor?"** — es la más importante. Si la respuesta es no, el sistema cambia bastante por dentro.
> 2. **"¿Quién puede borrar?"** — mi recomendación: nadie. Que se marque como inactivo, no que desaparezca. Así nada se pierde por error o por rabia.
> 3. **"¿Quién puede exportar la lista completa a Excel?"** — es por donde se van las bases de datos cuando alguien renuncia.

### El punto que más le va a pesar

> "Hoy, si un dato de un cliente cambia, no queda registro de quién lo cambió ni cuándo. Con perfiles sí queda. Eso te sirve para dos cosas: para saber a quién preguntarle cuando algo esté raro, y para respaldarte si un cliente reclama que nadie lo llamó."

### Sobre la ley de datos (habeas data)

Si el tema sale, no improvises:

> "En Colombia los datos de clientes están cubiertos por la ley de habeas data. En la práctica, para nosotros significa tres cosas: que solo acceda quien lo necesite para su trabajo, que quede registro de quién consulta qué, y que el cliente pueda pedir que lo borren. Nada de eso está montado todavía — hace parte de lo que hay que hacer antes de publicar. Si tienen abogado o alguien que lleve el tema, me gustaría revisarlo con esa persona antes de definir los perfiles."

**No digas** que el sistema "cumple con la ley". No lo cumple todavía.

### Cierre — vuelve al pedido principal

> "Todo esto —el link, los usuarios, los permisos— es la siguiente fase, y te la cotizo cuando la definamos. Pero nada de eso bloquea lo de hoy: los bots funcionan por Telegram, no por el panel. Por eso insisto en que los activen esta semana. Eso no cuesta nada y empieza a dar resultado ya."

---

## PREGUNTAS PROBABLES Y CÓMO RESPONDER

**"¿Por qué no está en vivo si dices que está listo?"**
> "El sistema está en vivo y funcionando — lo acabamos de ver. Lo que no está es el equipo conectado a él. Son dos cosas distintas: la primera dependía de nosotros y está hecha; la segunda depende de que cada asesor mande un mensaje."

**"¿Cuánto falta para terminar?"**
> "Para que el sistema quede al 100% con el equipo dentro: el mismo día en que se activen los bots. Después de eso quedan dos verificaciones que toman una tarde. Es cuestión de horas de trabajo, no de semanas."

**"¿Y si el equipo no lo usa?"**
> "Por eso lo pedí como instrucción de gerencia. La herramienta ya está pagada en horas de construcción; si no se activa, ese valor queda parado. Es la decisión más barata que se puede tomar hoy."

**"¿Esto es seguro?"**
> "Hicimos una auditoría. Encontramos una clave de acceso expuesta en el código, la revocamos y la limpiamos también del historial. Hoy las credenciales están en un gestor cifrado, no en archivos."

**"¿Qué sigue después?"**
> "Hay tres frentes: el cotizador automático, el módulo financiero y el de marketing. Los tengo diseñados. Los cotizo cuando este quede activo — no tiene sentido abrir un frente nuevo con este a medias."

---

## LO QUE NO DEBES HACER

- No abras n8n con los workflows a la vista. Las cajas y flechas confunden y desvían la conversación a lo técnico.
- No enumeres tickets (T-A4, T-B2). A gerencia no le dicen nada.
- No pidas disculpas por el bloqueo. No es tuyo.
- No prometas fecha de go-live sin tener la fecha de activación del equipo primero.

---

## EVIDENCIA — verificada el 2026-08-06

Todo esto lo comprobé contra los sistemas en vivo antes de escribir este guion:

| Verificación | Resultado |
|--------------|-----------|
| Motor n8n en línea | ✅ HTTP 200 |
| Bot Telegram respondiendo | ✅ SCMSDS_bot activo (id 8889541466) |
| Webhook de comunicaciones | ✅ HTTP 200 en 1.387 s |
| Registro guardado en base | ✅ id=11, `2026-08-06T14:40:23Z` |
| Base de datos | ✅ 523 clientes, 100 pólizas, 6 reglas de tiempo |
| Bots configurados | ✅ 12 activos en tabla `bots` |
| Chat_ids del equipo | ⚠️ 1 de 11 (solo Fabio, id 8695082898) |
