import pytest

@pytest.fixture
def funcion_disponible(client):
    pelicula = client.post('/api/peliculas', json={'titulo': 'Test Movie'}).json
    sala = client.post('/api/salas', json={'nombre': 'Test Sala', 'capacidad': 50}).json
    funcion = client.post('/api/funciones', json={
        'pelicula_id': pelicula['id'],
        'sala_id': sala['id'],
        'fecha_hora': '2024-12-25T20:00:00',
        'precio': 10.0
    }).json
    return funcion

def test_lista_reservas_vacia(client):
    response = client.get('/api/reservas')
    assert response.status_code == 200
    assert response.json == []

def test_crear_reserva(client, funcion_disponible):
    data = {
        'funcion_id': funcion_disponible['id'],
        'nombre_cliente': 'Juan García',
        'email_cliente': 'juan@example.com',
        'cantidad_asientos': 2
    }
    response = client.post('/api/reservas', json=data)
    assert response.status_code == 201
    result = response.json
    assert result['nombre_cliente'] == 'Juan García'
    assert result['cantidad_asientos'] == 2
    assert result['codigo_reserva'] is not None

def test_crear_reserva_sin_asientos_suficientes(client, funcion_disponible):
    data = {
        'funcion_id': funcion_disponible['id'],
        'nombre_cliente': 'Ana López',
        'email_cliente': 'ana@example.com',
        'cantidad_asientos': 100  # More than capacity (50)
    }
    response = client.post('/api/reservas', json=data)
    assert response.status_code == 400
    assert 'error' in response.json

def test_asientos_disponibles_se_reducen(client, funcion_disponible):
    client.post('/api/reservas', json={
        'funcion_id': funcion_disponible['id'],
        'nombre_cliente': 'Cliente 1',
        'email_cliente': 'c1@example.com',
        'cantidad_asientos': 20
    })

    funcion_response = client.get(f'/api/funciones/{funcion_disponible["id"]}')
    assert funcion_response.json['asientos_disponibles'] == 30  # 50 - 20

def test_crear_reserva_sin_nombre(client, funcion_disponible):
    response = client.post('/api/reservas', json={
        'funcion_id': funcion_disponible['id'],
        'email_cliente': 'test@example.com',
        'cantidad_asientos': 2
    })
    assert response.status_code == 400

def test_crear_reserva_cantidad_cero(client, funcion_disponible):
    response = client.post('/api/reservas', json={
        'funcion_id': funcion_disponible['id'],
        'nombre_cliente': 'Test',
        'email_cliente': 'test@example.com',
        'cantidad_asientos': 0
    })
    assert response.status_code == 400

def test_obtener_reserva(client, funcion_disponible):
    reserva = client.post('/api/reservas', json={
        'funcion_id': funcion_disponible['id'],
        'nombre_cliente': 'María Fernández',
        'email_cliente': 'maria@example.com',
        'cantidad_asientos': 3
    }).json

    response = client.get(f'/api/reservas/{reserva["id"]}')
    assert response.status_code == 200
    assert response.json['nombre_cliente'] == 'María Fernández'

def test_cancelar_reserva(client, funcion_disponible):
    reserva = client.post('/api/reservas', json={
        'funcion_id': funcion_disponible['id'],
        'nombre_cliente': 'Pedro Ruiz',
        'email_cliente': 'pedro@example.com',
        'cantidad_asientos': 5
    }).json

    response = client.delete(f'/api/reservas/{reserva["id"]}')
    assert response.status_code == 200

    response = client.get(f'/api/reservas/{reserva["id"]}')
    assert response.status_code == 404

def test_reservas_multiples_agotan_asientos(client, funcion_disponible):
    # Book 45 seats
    client.post('/api/reservas', json={
        'funcion_id': funcion_disponible['id'],
        'nombre_cliente': 'Grupo Grande',
        'email_cliente': 'grupo@example.com',
        'cantidad_asientos': 45
    })

    # Try to book 10 more (only 5 available)
    response = client.post('/api/reservas', json={
        'funcion_id': funcion_disponible['id'],
        'nombre_cliente': 'Segundo Cliente',
        'email_cliente': 'segundo@example.com',
        'cantidad_asientos': 10
    })
    assert response.status_code == 400
