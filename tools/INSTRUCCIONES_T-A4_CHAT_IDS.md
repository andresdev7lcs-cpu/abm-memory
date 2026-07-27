# T-A4: Recolectar Chat IDs — Instrucciones Equipo

**Objetivo:** Cada asesor obtiene su `chat_id` en Telegram para recibir notificaciones de casos.

---

## 📱 Paso 1: Enviar /start a tu Bot

Abre **Telegram** y busca **TU BOT PERSONAL**:

| Tu Nombre | Bot a Buscar | Handle |
|-----------|-------------|--------|
| Fabio | MSDS Gerencia N | @MSDS_Gerencia_N_bot |
| Santiago | MSDS Gerencia B | @MSDS_Gerencia_B_bot |
| Gabriel | MSDS Autos Nuevos | @MSDS_Autos_N_bot |
| Valentina | MSDS Autos Ren | @MSDS_Autos_R_bot |
| Geraldin | MSDS Cartera | @MSDS_Cartera_bot |
| Natalia | MSDS Caja | @MSDS_Caja_bot |
| Aida | MSDS Generales | @MSDS_Generales_bot |
| Leonela | MSDS Cumplimiento | @MSDS_Cumplimiento_bot |
| Oscar | MSDS Siniestros | @MSDS_Siniestros_bot |
| Yamaira | MSDS Comisiones | @MSDS_Comisiones_bot |
| Jorge | MSDS Supervisor | @MSDS_Supervisor_bot |

**En el chat, escribe:**
```
/start
```

Presiona **ENTER**. El bot responderá con un mensaje de bienvenida.

**¡Ya está!** Tu `chat_id` fue registrado automáticamente en el sistema.

---

## 🤔 ¿Qué pasó detrás?

Cuando enviaste `/start`:
1. Telegram envió tu `chat_id` al bot
2. El bot (workflow n8n) capturó tu ID
3. Tu nombre se actualizó automáticamente en la base de datos

**Resultado:** Ahora recibirás notificaciones de casos en este chat cuando:
- Un siniestro se asigne a tu área (alerta en 15 min)
- Necesite escalación a gerencia (en 30 min)
- Un cliente envíe un mensaje vía WhatsApp/email

---

## ✅ Verificación

Para confirmar que funciona, prueba:

**1. Abre el bot otra vez:**
```
/status
```

Deberías ver algo como:
```
✅ Chat ID registrado: [tu_numero]
Asesor: [Tu Nombre]
Área: [Tu Área]
```

**2. Si no ves ese mensaje:**
- Intenta `/start` de nuevo
- Asegúrate de que es el bot correcto (verifica el handle @...)
- Si sigue sin funcionar, avisa a Andrés

---

## 📋 Checklist

- [ ] Encontré mi bot en Telegram
- [ ] Envié `/start`
- [ ] El bot respondió
- [ ] Verificué con `/status`
- [ ] Listo para recibir notificaciones

---

## 💬 Preguntas?

Cualquier problema → Avisa en el grupo de WhatsApp equipo o contacata a **Andrés Palomares**.

**Fecha límite:** Completar esto antes de 2026-07-31 para go-live sistema.

---

**Última actualización:** 2026-07-27
