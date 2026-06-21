#!/usr/bin/env python3
"""
Insertar datos demo en Supabase para test gerencia.html
- 20 pólizas vigentes (próximos 30 días)
- 10 actividades abiertas
- 5 siniestros avisados
"""

import os
import sys
import random
from datetime import datetime, timedelta
from dotenv import load_dotenv
import requests

load_dotenv(os.path.expanduser('~/.env'))

SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://ekarbxdoaoqrtlmfzgyj.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

if not SUPABASE_KEY:
    print("ERROR: SUPABASE_KEY no encontrada en .env")
    sys.exit(1)

headers = {
    'apikey': SUPABASE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

def insert_polizas_with_ids(cliente_ids):
    """Inserta 20 pólizas vigentes"""
    polizas = []
    today = datetime.now().date()

    for i in range(20):
        days_ahead = random.randint(1, 30)
        fecha_vence = today + timedelta(days=days_ahead)

        poliza = {
            'cliente_id': random.choice(cliente_ids),
            'estado': 'vigente',
            'fecha_inicio': today.isoformat(),
            'fecha_vencimiento': fecha_vence.isoformat(),
            'prima': round(random.uniform(100000, 5000000), 2),
            'ramo': 'Autos',
            'numero': f'POL-{i+1:04d}',
            'aseguradora': random.choice(['Sura', 'Bolívar', 'Liberty', 'Allianz']),
        }
        polizas.append(poliza)

    url = f"{SUPABASE_URL}/rest/v1/polizas"
    r = requests.post(url, json=polizas, headers=headers)

    if r.ok:
        print(f"✅ {len(polizas)} pólizas insertadas")
        return [p['id'] for p in r.json()] if r.json() else []
    else:
        print(f"❌ Error insertando pólizas: {r.status_code} {r.text}")
        return []

def insert_actividades_with_ids(cliente_ids, asesor_ids):
    """Inserta 10 actividades abiertas"""
    actividades = []
    today = datetime.now().date()

    for i in range(10):
        actividad = {
            'cliente_id': random.choice(cliente_ids),
            'asesor_id': random.choice(asesor_ids),
            'clase': random.choice(['llamada', 'visita']),
            'descripcion': f'Actividad demo {i+1}',
            'estado': 'abierta',
            'fecha_inicio': today.isoformat(),
        }
        actividades.append(actividad)

    url = f"{SUPABASE_URL}/rest/v1/actividades"
    r = requests.post(url, json=actividades, headers=headers)

    if r.ok:
        print(f"✅ {len(actividades)} actividades insertadas")
    else:
        print(f"❌ Error insertando actividades: {r.status_code} {r.text}")

def insert_siniestros(poliza_ids):
    """Inserta 5 siniestros avisados"""
    if not poliza_ids:
        print("⚠️  Sin pólizas para crear siniestros")
        return

    siniestros = []
    today = datetime.now().date()

    for i in range(min(5, len(poliza_ids))):
        siniestro = {
            'poliza_id': random.choice(poliza_ids),
            'asegurado': f'Asegurado Demo {i+1}',
            'fecha_ocurrencia': today.isoformat(),
            'descripcion': f'Siniestro demo {i+1}',
            'estado': 'avisado',
        }
        siniestros.append(siniestro)

    url = f"{SUPABASE_URL}/rest/v1/siniestros"
    r = requests.post(url, json=siniestros, headers=headers)

    if r.ok:
        print(f"✅ {len(siniestros)} siniestros insertados")
    else:
        print(f"❌ Error insertando siniestros: {r.status_code} {r.text}")

def get_cliente_ids():
    """Obtiene primeros 20 IDs de clientes"""
    url = f"{SUPABASE_URL}/rest/v1/clientes?select=id&limit=20"
    r = requests.get(url, headers=headers)
    if r.ok:
        return [row['id'] for row in r.json()]
    else:
        print(f"❌ Error obteniendo clientes: {r.status_code}")
        return list(range(1, 21))

def insert_asesores():
    """Inserta 3 asesores demo (o retorna existentes)"""
    asesores = [
        {'nombre': 'Asesor 1', 'correo': 'asesor1@test.com', 'rol': 'asesor', 'ramo': 'Autos'},
        {'nombre': 'Asesor 2', 'correo': 'asesor2@test.com', 'rol': 'asesor', 'ramo': 'Hogar'},
        {'nombre': 'Supervisor', 'correo': 'supervisor@test.com', 'rol': 'supervisor', 'ramo': 'Autos'}
    ]

    url = f"{SUPABASE_URL}/rest/v1/asesores"
    r = requests.post(url, json=asesores, headers=headers)

    if r.ok:
        try:
            result = r.json()
            # result puede ser lista o dict dependiendo de Prefer header
            if isinstance(result, list):
                ids = [a['id'] for a in result]
            else:
                ids = []
            if ids:
                print(f"✅ {len(ids)} asesores insertados")
                return ids
        except (ValueError, KeyError):
            pass

    # Si insert falló o no retornó IDs, busca existentes
    print("🔄 Buscando asesores existentes...")
    ids = get_asesor_ids()
    if ids:
        print(f"✅ {len(ids)} asesores encontrados")
    return ids

def get_asesor_ids():
    """Obtiene primeros 3 IDs de asesores"""
    url = f"{SUPABASE_URL}/rest/v1/asesores?select=id&limit=3"
    r = requests.get(url, headers=headers)
    if r.ok:
        return [row['id'] for row in r.json()]
    else:
        print(f"❌ Error obteniendo asesores: {r.status_code}")
        return []

if __name__ == '__main__':
    print("🔄 Insertando datos demo en Supabase...")

    # Insertar asesores PRIMERO
    asesor_ids = insert_asesores()

    print("🔄 Obteniendo IDs de Supabase...")
    cliente_ids = get_cliente_ids()
    print(f"   - {len(cliente_ids)} clientes encontrados")
    print(f"   - {len(asesor_ids)} asesores insertados")

    print("🔄 Insertando datos relacionados...")
    poliza_ids = insert_polizas_with_ids(cliente_ids)
    insert_actividades_with_ids(cliente_ids, asesor_ids)
    insert_siniestros(poliza_ids)
    print("✅ Demo data cargada. Recarga http://localhost:8000/gerencia.html")
