def test_lista_salas_vacia(client):
    response = client.get('/api/salas')
    assert response.status_code == 200
    assert response.json == []

def test_crear_sala(client):
    data = {'nombre': 'Sala 1', 'capacidad': 100, 'tipo': '2D'}
    response = client.post('/api/salas', json=data)
    assert response.status_code == 201
    result = response.json
    assert result['nombre'] == 'Sala 1'
    assert result['capacidad'] == 100
    assert result['tipo'] == '2D'

def test_crear_sala_sin_nombre(client):
    response = client.post('/api/salas', json={'capacidad': 100})
    assert response.status_code == 400

def test_crear_sala_sin_capacidad(client):
    response = client.post('/api/salas', json={'nombre': 'Sala Sin Capacidad'})
    assert response.status_code == 400

def test_obtener_sala(client):
    response = client.post('/api/salas', json={'nombre': 'Sala IMAX', 'capacidad': 200, 'tipo': 'IMAX'})
    sala_id = response.json['id']

    response = client.get(f'/api/salas/{sala_id}')
    assert response.status_code == 200
    assert response.json['nombre'] == 'Sala IMAX'

def test_actualizar_sala(client):
    response = client.post('/api/salas', json={'nombre': 'Sala Antigua', 'capacidad': 50})
    sala_id = response.json['id']

    response = client.put(f'/api/salas/{sala_id}', json={'nombre': 'Sala Nueva', 'capacidad': 75})
    assert response.status_code == 200
    assert response.json['nombre'] == 'Sala Nueva'
    assert response.json['capacidad'] == 75

def test_eliminar_sala(client):
    response = client.post('/api/salas', json={'nombre': 'Sala a Eliminar', 'capacidad': 30})
    sala_id = response.json['id']

    response = client.delete(f'/api/salas/{sala_id}')
    assert response.status_code == 200

    response = client.get(f'/api/salas/{sala_id}')
    assert response.status_code == 404
