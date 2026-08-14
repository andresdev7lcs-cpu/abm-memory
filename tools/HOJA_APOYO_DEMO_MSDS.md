# MSDS-CRM — HOJA DE APOYO
**2026-08-06 · Una página · Tener a la vista durante la reunión**

---

## LOS NÚMEROS (verificados hoy)

**523** clientes · **100** pólizas · **12** bots · **10** automatizaciones · **6** reglas de tiempo
Prueba en vivo de hoy: **1.4 segundos** de WhatsApp a sistema registrado.

---

## LA FRASE DE APERTURA

> "Antes, una solicitud de cliente dependía de que alguien la viera y la anotara. Hoy el sistema la registra sola y avisa al responsable. Se los muestro funcionando."

---

## ORDEN DE LA DEMO

1. Panel → **523 clientes**, ficha de cliente
2. Pestaña Comunicaciones → filtros
3. **DEMO EN VIVO** → ejecutar curl → recargar → mostrar teléfono
4. Monitor de tiempos → 15 min alerta / 30 min escala
5. Tabla de 12 bots → **el pedido**

---

## EL PEDIDO (memorizar)

> "Los 12 bots funcionan. Falta que cada persona le escriba `/start` a su bot. Treinta segundos por persona. Fabio ya lo hizo. Faltan diez asesores y Jorge. Lleva pendiente desde el 27 de julio. Necesito que salga como instrucción de gerencia."

**Cerrar con fecha:** *"¿Cuento con que esté el viernes?"*

---

## SI PREGUNTAN "¿por qué no está en vivo?"

> "El sistema sí está en vivo — lo acaban de ver. Lo que falta es el equipo conectado. La parte que dependía de nosotros está entregada."

---

## SI PREGUNTAN "¿cuánto falta?"

> "Horas, no semanas. El mismo día que se activen los bots, más una tarde de verificación."

---

## SI PREGUNTAN "¿dónde vive esto / cómo entra el equipo?"

**En la nube ya (24/7):** base de datos, motor de automatización, los 12 bots.
**En mi computador todavía:** solo el panel.

> "El sistema ya vive en internet — la prueba es que el mensaje que mandamos se procesó en servidores, no aquí. Lo único local es esta pantalla. Está así porque lleva la llave de la base escrita dentro; si la publico así, cualquiera podría leerla y entrar a los datos de los clientes."

**¿Cuándo lo ve el equipo?** *"Una semana: sacar la llave, poner usuario y contraseña, subirlo a un dominio de la empresa. Después entran desde el celular sin instalar nada."*

**¿Qué primero?** *"Los bots — es gratis y es un mensaje por persona. El panel cuesta trabajo y sirve más cuando ya haya movimiento que mirar."*

---

## SI PIDE UN LINK PARA PROBARLO

**Respuesta: hoy no hay link, y no debe haberlo.**

> "El panel lleva la llave de la base escrita en el código. Si lo subo así, cualquiera que abra el código de la página puede leer, cambiar o borrar los datos de los 523 clientes. Sin contraseña. Lo probé hoy: creé un cliente falso con solo esa llave. No te entrego un link así."

**Ofrece en este orden:** 1) compartir pantalla hoy · 2) capturas · 3) acceso de una hora si es indispensable · 4) publicación bien hecha en una semana

⚠️ **No cedas a un link "provisional".** Los provisionales se quedan y la responsabilidad queda en ti.

---

## SI PREGUNTA POR PERMISOS DEL EQUIPO

**Hoy: sin login, sin usuarios, sin roles, sin registro de cambios.** Quien abre, ve y toca todo.

> "Está bien para tú y yo revisando. No sirve para meter diez personas."

**Propuesta de partida** (que él corrija):

| Perfil | Ver | Crear | Editar | Borrar |
|---|---|---|---|---|
| Gerencia | todo | ✓ | ✓ | ✓ |
| Supervisor | todo | ✓ | ✓ | ✗ |
| Asesor | los suyos | ✓ | los suyos | ✗ |
| Cartera/Caja | todo (lectura) | ✗ | solo pagos | ✗ |

**Las 3 preguntas que él debe responder:**
1. ¿Un asesor ve los clientes de otro?
2. ¿Quién borra? (recomendar: nadie — marcar inactivo)
3. ¿Quién exporta a Excel?

**El argumento que pesa:** *"Hoy si cambian un dato no queda registro de quién fue. Con perfiles sí. Te sirve para saber a quién preguntar y para respaldarte si un cliente reclama."*

**Si sale habeas data:** *"No está montado todavía, hace parte de lo previo a publicar."* — NUNCA digas que cumple.

**Cierre:** *"Todo eso es la siguiente fase. Pero no bloquea lo de hoy: los bots van por Telegram, no por el panel."*

---

## COMANDOS

**Terminal 1 — panel (dejar corriendo):**
```
cd ~/Documents/Proyectos/ABM/proyectos/multiseguros
python3 -m http.server 8000
```
→ abrir **http://localhost:8000/gerencia.html**
(NO doble clic al archivo — no carga datos)

**Terminal 2 — SOLO antes de que entren** (luego minimizar):
```
cd ~/Documents/Proyectos/ABM

./tools/demo-msds.sh check       ← 10 min antes (3 OK)
./tools/demo-msds.sh reset       ← deja la bandeja como debe estar
```

**Corre `reset` siempre:** después del `check` (deja rastro) y si tocas algún botón por accidente. Restaura a: respondida / nueva / respondida / cerrada.

---

## LAS 2 PESTAÑAS DE LA DEMO

| `Cmd+1` | **gerencia.html** → el panel |
| `Cmd+2` | **simulador.html** → WhatsApp del cliente |
| `Cmd+3` | **correo.html** → registro manual (ferretería) |
| `Cmd+4` | **enrutamiento.html** → pendiente para Jorge |

Todas en `http://localhost:8000/`

⚠️ **Nada de terminal delante de ellos.** Si te ven escribir comandos piensan que el equipo debe aprender eso.

Respuesta esperada: `{"ok":true,"mensaje":"comunicacion registrada"}` en ~1.2s

---

## LA DEMO EN 5 PASOS

1. `Cmd+1` **Señala el contador "Hoy" en 0** → *"Marta se despierta y se le vence el SOAT"*
2. `Cmd+2` clic **"Enviar mensaje"** → *"Marta acaba de darle enviar"* → señala el tiempo
3. **Silencio 2 segundos**
4. `Cmd+1` F5 → **contador pasa a 1** → *"Estaba en cero hace diez segundos"* → señala el registro
5. Levanta TU teléfono → notificación Telegram

**Cierre:** *"Un segundo y medio. Hoy eso depende de que alguien vea el WhatsApp y se acuerde. El sistema no se distrae."*

---

## VERSIÓN LARGA — 3 CASOS SEGUIDOS

**Manda los tres SIN recargar. Recarga una sola vez al final → contador 0 → 3.**

**1 · Siniestro (llamada, pantalla azul, "Registrar la llamada")**
> *"Un cliente llama reportando un choque. Hoy esa llamada queda en la cabeza de quien contestó, o en un papelito."*
→ instala: **no es solo WhatsApp, también lo que entra por teléfono**

**2 · Renovación vencida hace 3 días (WhatsApp, entra sola)**
> *"Vencida hace tres días se recupera. Hace tres semanas el cliente ya se fue con otro. La diferencia es que alguien lo vea a tiempo."*
→ instala: **el costo en plata** ← míralo a Fabio aquí

**3 · Clínica odontológica RC profesional (WhatsApp, entra sola)**
> *"Póliza empresarial, de las que dejan buena comisión. No se puede quedar sin responder tres días entre veinte chats."*
→ instala: **protege los negocios grandes**

**`Cmd+1` + F5:** *"Estaba en cero. Ahora dice tres. Dos vías distintas, todos sin responder, ninguno depende de que alguien se acuerde."*

**Enlace al punto 5:** *"Y el del choque es el que no puede esperar. Por eso el sistema no solo lo registra: lo vigila."*

---

## `Cmd+3` CORREO FERRETERÍA — registro manual

**Llena el formulario delante de ellos.** No pre-llenado.

`gerencia@ferreteriaelmartillo.com` · `Cotizacion poliza empresarial — ferreteria` · Correo · Generales
Resumen: *Local, mercancía y RC. Inventario 180 millones, 6 empleados. Ramiro Peña 310 447 8890.*

> *"Este no entra solo, alguien tiene que pasarlo. Aun escribiéndolo yo, queda con hora, área y marcado pendiente. Ya no se pierde."*

→ instala: **sirve desde hoy, sin esperar a automatizar todo**

---

## `Cmd+4` PENDIENTE PARA JORGE — el que falla a propósito

⚠️ **El fallo ES el punto. No lo escondas.**

Mensaje ya escrito → enviar. Se ilumina:

| 1 · MasterBot lee | ✅ funciona |
| 2 · Crea pendiente en CRM | ✅ **real, queda guardado** |
| 3 · Avisa a Jorge | ⚠️ **no encuentra su chat** |

> *"Los dos primeros funcionan hoy: entendió la instrucción y el pendiente quedó asignado a Jorge con fecha."*
>
> *(señala el 3)* *"El aviso sale pero no tiene a dónde llegar. Telegram no permite escribir por número de teléfono — necesita que la persona mande `/start` una vez. Tenemos el número de Jorge; falta ese mensaje suyo. Treinta segundos, y solo lo puede hacer él."*

**`Cmd+1`** → el pendiente "Reunión con AXA" aparece en el dashboard. Es real.

→ **la pantalla más útil de la demo:** Fabio VE dónde se corta. El pedido deja de sonar a excusa.

⚠️ **El chat 8695082898 es TU terminal, no el teléfono de Fabio.** Nunca digas "mire su teléfono". Di: *"llegó al bot de Gerencia Neiva, el único activado. Cuando cada asesor active el suyo, le llega a cada uno."*

---

## SI PREGUNTAN "¿mi equipo tiene que usar eso?"

> "No. Esta pantalla es solo para la demostración — hace de teléfono del cliente. El asesor usa dos cosas que ya sabe: **su Telegram**, donde le llegan los avisos, y **el panel**, si quiere revisar. El cliente usa su WhatsApp de siempre. Nadie aprende una herramienta nueva."

**Dilo como punto de venta, no como disculpa.** La adopción es lo que hunde los sistemas internos.

**¿Y el WhatsApp real?** *"Falta apuntar la línea de la empresa al sistema. Es configuración, no construcción — va en la misma fase de publicar el panel."*

---

## NO HACER

✗ Abrir n8n con los flujos a la vista
✗ Nombrar tickets (T-A4, T-B2)
✗ Disculparse por el bloqueo — no es tuyo
✗ Dar fecha de go-live sin fecha de activación del equipo primero

---

## ESTADO EN UNA LÍNEA

**CRM: 100% operativo. Bots: 100% construidos, 9% activados (falta el equipo).**
