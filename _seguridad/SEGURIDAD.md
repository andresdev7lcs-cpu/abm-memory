# SEGURIDAD — Cómo se protege todo esto (de verdad)

> Seguridad real, no teatro. Dos preguntas en un .md no protegen nada
> (cualquiera que abra el archivo ve las respuestas). Esto sí protege:

---

## Las 3 capas reales

1. **Repo privado en GitHub.** Solo entras tú con tu contraseña. Nadie más lo ve.
2. **2FA (doble factor) en GitHub.** Tu "doble verificación" real: además de la
   contraseña, pide un código de tu teléfono. Aunque alguien robe tu contraseña, no entra.
3. **Bitwarden para las claves.** Todas las contraseñas, APIs y secret keys viven
   cifradas ahí. Una sola contraseña maestra (que memorizas) abre el blackbox.

## Rewind: cómo deshacer un desastre

Cuando una IA se equivoca y el error contamina todo el contexto:
- NO sigas peleando con el contexto dañado.
- Vuelve al último punto bueno con Git.

Comando (en la terminal de VSCode, te lo explico cuando lleguemos):
```
git log --oneline        # ves la lista de puntos guardados (commits)
git checkout <codigo>    # vuelves a ese punto
```
En lenguaje simple: "Git, muéstrame las fotos guardadas" y luego "devuélveme a esta foto".

## Regla de commits

Haz commit (guardar foto) DESPUÉS de cada avance que funcione. Así siempre hay
un punto bueno al cual volver. Mejor muchos commits pequeños que uno gigante.

## Qué hacer si una clave se filtró al repo

1. Cámbiala de inmediato en el servicio (genera una nueva).
2. Sácala del archivo y muévela a Bitwarden.
3. Pídele a Fable o CC limpiar el historial de Git (la clave vieja queda en commits viejos).
