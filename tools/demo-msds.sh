#!/bin/bash
# Demo MSDS-CRM — simula una comunicación entrante de cliente
# Uso:
#   ./demo-msds.sh            → caso por defecto (renovación SOAT)
#   ./demo-msds.sh siniestro  → caso de siniestro urgente
#   ./demo-msds.sh check      → verificación previa (correr 10 min antes de la reunión)
#   ./demo-msds.sh limpiar    → borra los registros de ensayo (deja los 4 demos, ids 1-4)
#   ./demo-msds.sh reset      → limpiar + devuelve los 4 demos a su estado original

WEBHOOK="https://no-26feb-n8n.ydlmwq.easypanel.host/webhook/msds-comunicaciones"

case "$1" in

  reset)
    # Deja la bandeja exactamente como debe verse al iniciar la reunión:
    # borra ensayos y devuelve los 4 registros demo a su estado original.
    if [ ! -f "$HOME/Downloads/.env" ]; then
      echo "No se encontró ~/Downloads/.env — no puedo conectarme a la base."
      exit 1
    fi
    set -a; . "$HOME/Downloads/.env"; set +a

    # 1) borrar ensayos
    ids=$(curl -s -m 15 "$SUPABASE_URL/rest/v1/comunicaciones?select=id&id=gt.4" \
      -H "apikey: $SUPABASE_KEY" -H "Authorization: Bearer $SUPABASE_KEY" \
      | python3 -c "import json,sys; print(' '.join(str(r['id']) for r in json.load(sys.stdin)))")
    for id in $ids; do
      curl -s -m 15 -X DELETE "$SUPABASE_URL/rest/v1/comunicaciones?id=eq.$id" \
        -H "apikey: $SUPABASE_KEY" -H "Authorization: Bearer $SUPABASE_KEY" -o /dev/null
      echo "borrado ensayo id=$id"
    done

    # 1b) borrar reuniones creadas por la demo de enrutamiento
    act=$(curl -s -m 15 "$SUPABASE_URL/rest/v1/actividades?select=id&clase=eq.Reuni%C3%B3n%20con%20AXA" \
      -H "apikey: $SUPABASE_KEY" -H "Authorization: Bearer $SUPABASE_KEY" \
      | python3 -c "import json,sys; print(' '.join(str(r['id']) for r in json.load(sys.stdin)))")
    for id in $act; do
      curl -s -m 15 -X DELETE "$SUPABASE_URL/rest/v1/actividades?id=eq.$id" \
        -H "apikey: $SUPABASE_KEY" -H "Authorization: Bearer $SUPABASE_KEY" -o /dev/null
      echo "borrada reunión id=$id"
    done

    # 2) devolver los 4 demos a su estado original
    #    id 1 respondida · id 2 nueva · id 3 respondida · id 4 cerrada
    for par in "1:respondida" "2:nueva" "3:respondida" "4:cerrada"; do
      id="${par%%:*}"; est="${par##*:}"
      curl -s -m 15 -X PATCH "$SUPABASE_URL/rest/v1/comunicaciones?id=eq.$id" \
        -H "apikey: $SUPABASE_KEY" -H "Authorization: Bearer $SUPABASE_KEY" \
        -H "Content-Type: application/json" -d "{\"estado\":\"$est\"}" -o /dev/null
    done

    echo ""
    echo "Bandeja restaurada:"
    curl -s -m 15 "$SUPABASE_URL/rest/v1/comunicaciones?select=id,canal,estado&order=id.asc" \
      -H "apikey: $SUPABASE_KEY" -H "Authorization: Bearer $SUPABASE_KEY" \
      | python3 -c "
import json,sys
for r in json.load(sys.stdin):
    print(f\"  id {r['id']:>2}  {r['canal']:<10} {r['estado']}\")
"
    ;;

  limpiar)
    # Borra todo lo que tenga id > 4. Los ids 1-4 son las demos presentables
    # que deben quedar en la bandeja al iniciar la reunión.
    if [ ! -f "$HOME/Downloads/.env" ]; then
      echo "No se encontró ~/Downloads/.env — no puedo conectarme a la base."
      exit 1
    fi
    set -a; . "$HOME/Downloads/.env"; set +a

    ids=$(curl -s -m 15 "$SUPABASE_URL/rest/v1/comunicaciones?select=id&id=gt.4" \
      -H "apikey: $SUPABASE_KEY" -H "Authorization: Bearer $SUPABASE_KEY" \
      | python3 -c "import json,sys; print(' '.join(str(r['id']) for r in json.load(sys.stdin)))")

    if [ -z "$ids" ]; then
      echo "Bandeja ya está limpia (solo los 4 registros demo)."
      exit 0
    fi

    for id in $ids; do
      curl -s -m 15 -X DELETE "$SUPABASE_URL/rest/v1/comunicaciones?id=eq.$id" \
        -H "apikey: $SUPABASE_KEY" -H "Authorization: Bearer $SUPABASE_KEY" \
        -o /dev/null -w "borrado id=$id\n"
    done
    echo "Bandeja lista para la demo."
    ;;
  check)
    echo "── VERIFICACIÓN PREVIA A LA DEMO ──"
    echo ""
    printf "Motor n8n .......... "
    code=$(curl -s -m 15 -o /dev/null -w "%{http_code}" https://no-26feb-n8n.ydlmwq.easypanel.host/)
    [ "$code" = "200" ] && echo "OK" || echo "FALLA (HTTP $code)"

    printf "Webhook ............ "
    resp=$(curl -s -m 25 -X POST "$WEBHOOK" -H "Content-Type: application/json" \
      -d '{"canal":"whatsapp","direccion":"entrante","remitente":"+570000000000","asunto":"Chequeo previo","mensaje":"Verificacion tecnica. Ignorar.","cliente_nombre":""}')
    echo "$resp" | grep -q '"ok":true' && echo "OK" || echo "FALLA → $resp"

    printf "Telegram ........... "
    if [ -f "$HOME/Downloads/.env" ]; then
      set -a; . "$HOME/Downloads/.env"; set +a
      tg=$(curl -s -m 15 "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe")
      echo "$tg" | grep -q '"ok":true' && echo "OK" || echo "FALLA"
    else
      echo "no se encontró ~/Downloads/.env"
    fi

    echo ""
    echo "Si los tres dicen OK, la demo está lista."
    echo "Si alguno falla, usa el plan B del guion (capturas)."
    ;;

  siniestro)
    echo "→ Cliente reporta siniestro urgente..."
    curl -s -m 30 -X POST "$WEBHOOK" -H "Content-Type: application/json" -d '{
      "canal": "whatsapp",
      "direccion": "entrante",
      "remitente": "+573145566778",
      "asunto": "Choque en la via — necesito ayuda",
      "mensaje": "Buenas tardes, acabo de tener un accidente en la via Neiva-Campoalegre. El carro esta asegurado con ustedes. Que hago?",
      "cliente_nombre": ""
    }' -w "\n\n[respuesta en %{time_total}s]\n"
    ;;

  *)
    echo "→ Cliente escribe por WhatsApp..."
    curl -s -m 30 -X POST "$WEBHOOK" -H "Content-Type: application/json" -d '{
      "canal": "whatsapp",
      "direccion": "entrante",
      "remitente": "+573001234567",
      "asunto": "Renovacion SOAT",
      "mensaje": "Buenos dias, se me vence el SOAT esta semana y necesito renovarlo. Me pueden ayudar?",
      "cliente_nombre": ""
    }' -w "\n\n[respuesta en %{time_total}s]\n"
    ;;
esac
