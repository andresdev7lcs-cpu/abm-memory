#!/usr/bin/env python3
"""
Migración de clientes: Airtable → Supabase
Tabla origen: Clientes_Auto (tblYb9IY2HOg3eFLI) en base app1UXLmLSjLDL5Mu
Tabla destino: clientes en Supabase MSDS-CRM (ekarbxdoaoqrtlmfzgyj.supabase.co)

Reglas:
- DRY-RUN primero: muestra primeros 5 registros mapeados sin insertar
- Luego de confirmación manual, migra todo
- Campos opcionales en Supabase que no vienen de Airtable se dejan en NULL
"""

import os
import json
from datetime import datetime
from dotenv import load_dotenv
import requests

# Carga .env (claves en local antes de Bitwarden)
env_path = os.path.expanduser('~/Downloads/.env')
load_dotenv(dotenv_path=env_path, verbose=True)

print(f"[DEBUG] .env cargado desde: {env_path}")
print(f"[DEBUG] Archivo existe: {os.path.exists(env_path)}")

# Credenciales
AIRTABLE_TOKEN = os.getenv('AIRTABLE_TOKEN')
print(f"[DEBUG] AIRTABLE_TOKEN primeros 10 chars: {AIRTABLE_TOKEN[:10] if AIRTABLE_TOKEN else 'NO CARGADO'}")
AIRTABLE_BASE = os.getenv('AIRTABLE_BASE', 'app1UXLmLSjLDL5Mu')
AIRTABLE_TABLE_CLIENTES = os.getenv('AIRTABLE_TABLE_CLIENTES', 'tblYb9IY2HOg3eFLI')

SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://ekarbxdoaoqrtlmfzgyj.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
SUPABASE_DB_HOST = os.getenv('SUPABASE_DB_HOST')
SUPABASE_DB_USER = os.getenv('SUPABASE_DB_USER')
SUPABASE_DB_PASSWORD = os.getenv('SUPABASE_DB_PASSWORD')
SUPABASE_DB_NAME = os.getenv('SUPABASE_DB_NAME')

# Validaciones mínimas
if not AIRTABLE_TOKEN:
    raise ValueError("AIRTABLE_TOKEN no configurado en .env")
if not SUPABASE_KEY:
    raise ValueError("SUPABASE_KEY no configurado en .env")
if not SUPABASE_DB_PASSWORD:
    raise ValueError("SUPABASE_DB_PASSWORD no configurado en .env")


def obtener_clientes_airtable(limit=None):
    """
    Lee todos los clientes de Airtable.
    Si limit es None, obtiene todos (con paginación).
    Retorna lista de dicts.
    """
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE}/{AIRTABLE_TABLE_CLIENTES}"
    # Sanitiza token: remueve caracteres Unicode problemáticos en headers HTTP
    token_clean = AIRTABLE_TOKEN.encode('utf-8', 'ignore').decode('ascii', 'ignore')
    headers = {"Authorization": f"Bearer {token_clean}"}

    todos = []
    offset = None
    pagina = 0

    while True:
        params = {}
        if offset:
            params['offset'] = offset
        if limit and len(todos) >= limit:
            break

        try:
            resp = requests.get(url, headers=headers, params=params, timeout=10)
            resp.raise_for_status()
            data = resp.json()

            for record in data.get('records', []):
                todos.append(record['fields'])
                if limit and len(todos) >= limit:
                    break

            # Paginación: Airtable usa offset
            offset = data.get('offset')
            if not offset:
                break

            pagina += 1
            print(f"  [INFO] Página {pagina}: {len(todos)} clientes acumulados")

        except Exception as e:
            print(f"[ERROR] Error leyendo Airtable: {e}")
            raise

    return todos[:limit] if limit else todos


def mapear_cliente_airtable_a_supabase(registro_airtable):
    """
    Mapea un registro de Airtable al esquema de Supabase.
    Busca múltiples variantes de nombre (Nombre, name, Nombre Completo, etc).
    """

    # Extrae valores (campos reales de Airtable Clientes_Auto)
    nombre_completo = registro_airtable.get('nombre_completo', '')
    apellido = ''  # No viene en Airtable
    cedula = registro_airtable.get('Documento', '')
    telefono = registro_airtable.get('telefono', '')
    celular = registro_airtable.get('celular', '')
    email = registro_airtable.get('email', '')
    direccion = registro_airtable.get('direccion', '')
    municipio = registro_airtable.get('ciudad', '')

    # Mapeo
    cliente_supabase = {
        'tipo': 'natural',  # Por defecto; si hay NIT, cambiar a 'juridica'
        'tipo_doc': 'CC',   # Asumir cédula colombiana
        'identificacion': cedula or None,
        'nombre': nombre_completo or None,
        'primer_apellido': apellido or None,
        'segundo_apellido': None,  # No viene en Airtable base
        'genero': None,
        'estado_civil': None,
        'fecha_nacimiento': None,
        'telefono': telefono or None,
        'celular': celular or None,
        'correo': email or None,
        'direccion': direccion or None,
        'municipio': municipio or None,
        'profesion': None,
        'ocupacion': None,
        'estrato': None,
        'observaciones': None,
    }

    return cliente_supabase


def mostrar_preview_dry_run(clientes_raw, cantidad=5):
    """
    Muestra preview de primeros N clientes mapeados sin insertar.
    """
    print("\n" + "="*80)
    print(f"DRY-RUN: Primeros {cantidad} clientes mapeados")
    print("="*80)

    for i, registro in enumerate(clientes_raw[:cantidad]):
        cliente_mapped = mapear_cliente_airtable_a_supabase(registro)
        print(f"\n[Cliente {i+1}]")
        print(f"  Origen (Airtable): {json.dumps(registro, indent=4, ensure_ascii=False)}")
        print(f"  Destino (Supabase): {json.dumps(cliente_mapped, indent=4, ensure_ascii=False)}")

    print("\n" + "="*80)
    print(f"Total a migrar: {len(clientes_raw)} registros")
    print("="*80)


def migrar_clientes_supabase(clientes_raw):
    """
    Inserta los clientes mapeados en Supabase vía REST API.
    Filtra registros sin nombre (campo NOT NULL en Supabase).
    """
    from supabase import create_client

    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print(f"\n[INFO] Conectado a Supabase {SUPABASE_URL}")

        # Mapea todos los registros
        clientes_mapped = [mapear_cliente_airtable_a_supabase(reg) for reg in clientes_raw]

        # Filtra: solo los que tienen nombre (NOT NULL en Supabase)
        clientes_con_nombre = [c for c in clientes_mapped if c['nombre']]

        # Filtra duplicados por identificacion (unique constraint en Supabase)
        ids_vistos = set()
        clientes_validos = []
        duplicados = 0
        for c in clientes_con_nombre:
            id_value = c['identificacion']
            if id_value and id_value in ids_vistos:
                duplicados += 1
                continue
            if id_value:
                ids_vistos.add(id_value)
            clientes_validos.append(c)

        print(f"[INFO] Registros válidos (con nombre): {len(clientes_con_nombre)}/{len(clientes_mapped)}")
        print(f"[INFO] Después filtrar duplicados: {len(clientes_validos)} (removidos {duplicados})")

        # Inserta vía REST API (chunks de 100)
        chunk_size = 100
        for i in range(0, len(clientes_validos), chunk_size):
            chunk = clientes_validos[i:i+chunk_size]
            supabase.table("clientes").insert(chunk).execute()

        print(f"[OK] Insertados {len(clientes_validos)} clientes en Supabase")

    except Exception as e:
        print(f"[ERROR] Error en Supabase: {e}")
        raise


def main():
    print("[INICIO] Migración Airtable → Supabase")
    print(f"  Airtable base: {AIRTABLE_BASE}")
    print(f"  Airtable tabla: {AIRTABLE_TABLE_CLIENTES}")
    print(f"  Supabase: {SUPABASE_URL}")

    # Obtiene clientes (todos, pero el preview muestra solo 5)
    print("\n[INFO] Leyendo clientes de Airtable...")
    clientes_raw = obtener_clientes_airtable()
    print(f"[OK] {len(clientes_raw)} clientes leídos de Airtable")

    # DRY-RUN: muestra primeros 5
    mostrar_preview_dry_run(clientes_raw, cantidad=5)

    # Pide confirmación manual
    print("\n⚠️  DRY-RUN completado. Revisar arriba.")
    print("Para migrar los clientes, ejecutar:")
    print("  python migrar_clientes_airtable_a_supabase.py --confirmar")
    print("\nSin --confirmar, el script solo hace preview.")


if __name__ == '__main__':
    import sys

    if '--confirmar' in sys.argv:
        print("\n[ADVERTENCIA] Iniciando migración real...")
        clientes_raw = obtener_clientes_airtable()
        migrar_clientes_supabase(clientes_raw)
        print("[ÉXITO] Migración completada")
    else:
        main()
