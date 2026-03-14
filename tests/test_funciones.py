import pytest

@pytest.fixture
def pelicula_y_sala(client):
    p = client.post('/api/peliculas', json={'titulo': 'Test Movie', 'duracion_minutos': 120}).json
    s = client.post('/api/salas', json={'nombre': 'Test Sala', 'capacidad': 100}).json
    return p, s

def test_lista_funciones_vacia(client):
    response = client.get('/api/funciones')
    assert response.status_code == 200
    assert response.json == []

def test_crear_funcion(client, pelicula_y_sala):
    pelicula, sala = pelicula_y_sala
    data = {
        'pelicula_id': pelicula['id'],
        'sala_id': sala['id'],
        'fecha_hora': '2024-12-25T20:00:00',
        'precio': 12.50,
        'idioma': 'Doblada'
    }
    response = client.post('/api/funciones', json=data)
    assert response.status_code == 201
    result = response.json
    assert result['precio'] == 12.50
    assert result['idioma'] == 'Doblada'
    assert result['asientos_disponibles'] == 100

def test_crear_funcion_sin_pelicula(client, pelicula_y_sala):
    _, sala = pelicula_y_sala
    response = client.post('/api/funciones', json={
        'sala_id': sala['id'],
        'fecha_hora': '2024-12-25T20:00:00'
    })
    assert response.status_code == 400

def test_crear_funcion_pelicula_no_existe(client, pelicula_y_sala):
    _, sala = pelicula_y_sala
    response = client.post('/api/funciones', json={
        'pelicula_id': 9999,
        'sala_id': sala['id'],
        'fecha_hora': '2024-12-25T20:00:00'
    })
    assert response.status_code == 404

def test_filtrar_funciones_por_pelicula(client, pelicula_y_sala):
    pelicula, sala = pelicula_y_sala
    client.post('/api/funciones', json={
        'pelicula_id': pelicula['id'], 'sala_id': sala['id'],
        'fecha_hora': '2024-12-25T20:00:00'
    })
    p2 = client.post('/api/peliculas', json={'titulo': 'Otra Pelicula'}).json
    client.post('/api/funciones', json={
        'pelicula_id': p2['id'], 'sala_id': sala['id'],
        'fecha_hora': '2024-12-26T20:00:00'
    })

    response = client.get(f'/api/funciones?pelicula_id={pelicula["id"]}')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['pelicula_id'] == pelicula['id']

def test_actualizar_funcion(client, pelicula_y_sala):
    pelicula, sala = pelicula_y_sala
    funcion = client.post('/api/funciones', json={
        'pelicula_id': pelicula['id'], 'sala_id': sala['id'],
        'fecha_hora': '2024-12-25T20:00:00', 'precio': 10.0
    }).json

    response = client.put(f'/api/funciones/{funcion["id"]}', json={'precio': 15.0, 'idioma': 'Original'})
    assert response.status_code == 200
    assert response.json['precio'] == 15.0
    assert response.json['idioma'] == 'Original'

def test_eliminar_funcion(client, pelicula_y_sala):
    pelicula, sala = pelicula_y_sala
    funcion = client.post('/api/funciones', json={
        'pelicula_id': pelicula['id'], 'sala_id': sala['id'],
        'fecha_hora': '2024-12-25T20:00:00'
    }).json

    response = client.delete(f'/api/funciones/{funcion["id"]}')
    assert response.status_code == 200

    response = client.get(f'/api/funciones/{funcion["id"]}')
    assert response.status_code == 404
