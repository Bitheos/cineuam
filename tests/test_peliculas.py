import json

def test_lista_peliculas_vacia(client):
    response = client.get('/api/peliculas')
    assert response.status_code == 200
    assert response.json == []

def test_crear_pelicula(client):
    data = {
        'titulo': 'El Padrino',
        'director': 'Francis Ford Coppola',
        'duracion_minutos': 175,
        'genero': 'Drama',
        'sinopsis': 'Una familia mafiosa italiana en Nueva York.',
        'fecha_estreno': '1972-03-24'
    }
    response = client.post('/api/peliculas', json=data)
    assert response.status_code == 201
    result = response.json
    assert result['titulo'] == 'El Padrino'
    assert result['director'] == 'Francis Ford Coppola'
    assert result['id'] is not None

def test_crear_pelicula_sin_titulo(client):
    response = client.post('/api/peliculas', json={'director': 'Director'})
    assert response.status_code == 400
    assert 'error' in response.json

def test_obtener_pelicula(client):
    # Create first
    response = client.post('/api/peliculas', json={'titulo': 'Interstellar', 'director': 'Christopher Nolan'})
    pelicula_id = response.json['id']

    response = client.get(f'/api/peliculas/{pelicula_id}')
    assert response.status_code == 200
    assert response.json['titulo'] == 'Interstellar'

def test_obtener_pelicula_no_existe(client):
    response = client.get('/api/peliculas/9999')
    assert response.status_code == 404

def test_actualizar_pelicula(client):
    response = client.post('/api/peliculas', json={'titulo': 'Titulo Original'})
    pelicula_id = response.json['id']

    response = client.put(f'/api/peliculas/{pelicula_id}', json={'titulo': 'Titulo Actualizado', 'genero': 'Acción'})
    assert response.status_code == 200
    assert response.json['titulo'] == 'Titulo Actualizado'
    assert response.json['genero'] == 'Acción'

def test_eliminar_pelicula(client):
    response = client.post('/api/peliculas', json={'titulo': 'Para Eliminar'})
    pelicula_id = response.json['id']

    response = client.delete(f'/api/peliculas/{pelicula_id}')
    assert response.status_code == 200

    response = client.get(f'/api/peliculas/{pelicula_id}')
    assert response.status_code == 404

def test_lista_peliculas_con_datos(client):
    client.post('/api/peliculas', json={'titulo': 'Pelicula 1'})
    client.post('/api/peliculas', json={'titulo': 'Pelicula 2'})

    response = client.get('/api/peliculas')
    assert response.status_code == 200
    assert len(response.json) == 2
