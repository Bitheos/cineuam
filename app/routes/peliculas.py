from flask import Blueprint, request, jsonify, render_template
from app import db
from app.models import Pelicula
from datetime import date

peliculas_bp = Blueprint('peliculas', __name__)

@peliculas_bp.route('/peliculas')
def lista_peliculas():
    peliculas = Pelicula.query.all()
    return render_template('peliculas/index.html', peliculas=peliculas)

@peliculas_bp.route('/peliculas/nueva')
def nueva_pelicula():
    return render_template('peliculas/nueva.html')

@peliculas_bp.route('/peliculas/<int:id>')
def detalle_pelicula(id):
    pelicula = Pelicula.query.get_or_404(id)
    return render_template('peliculas/detalle.html', pelicula=pelicula)

# API endpoints
@peliculas_bp.route('/api/peliculas', methods=['GET'])
def api_lista_peliculas():
    peliculas = Pelicula.query.all()
    return jsonify([p.to_dict() for p in peliculas])

@peliculas_bp.route('/api/peliculas', methods=['POST'])
def api_crear_pelicula():
    data = request.get_json()
    if not data or not data.get('titulo'):
        return jsonify({'error': 'El título es obligatorio'}), 400

    fecha_estreno = None
    if data.get('fecha_estreno'):
        try:
            fecha_estreno = date.fromisoformat(data['fecha_estreno'])
        except ValueError:
            return jsonify({'error': 'Formato de fecha inválido'}), 400

    pelicula = Pelicula(
        titulo=data['titulo'],
        director=data.get('director'),
        duracion_minutos=data.get('duracion_minutos'),
        genero=data.get('genero'),
        sinopsis=data.get('sinopsis'),
        fecha_estreno=fecha_estreno,
        imagen_url=data.get('imagen_url')
    )
    db.session.add(pelicula)
    db.session.commit()
    return jsonify(pelicula.to_dict()), 201

@peliculas_bp.route('/api/peliculas/<int:id>', methods=['GET'])
def api_obtener_pelicula(id):
    pelicula = Pelicula.query.get_or_404(id)
    return jsonify(pelicula.to_dict())

@peliculas_bp.route('/api/peliculas/<int:id>', methods=['PUT'])
def api_actualizar_pelicula(id):
    pelicula = Pelicula.query.get_or_404(id)
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No se proporcionaron datos'}), 400

    if 'titulo' in data:
        if not data['titulo']:
            return jsonify({'error': 'El título es obligatorio'}), 400
        pelicula.titulo = data['titulo']
    if 'director' in data:
        pelicula.director = data['director']
    if 'duracion_minutos' in data:
        pelicula.duracion_minutos = data['duracion_minutos']
    if 'genero' in data:
        pelicula.genero = data['genero']
    if 'sinopsis' in data:
        pelicula.sinopsis = data['sinopsis']
    if 'fecha_estreno' in data:
        if data['fecha_estreno']:
            try:
                pelicula.fecha_estreno = date.fromisoformat(data['fecha_estreno'])
            except ValueError:
                return jsonify({'error': 'Formato de fecha inválido'}), 400
        else:
            pelicula.fecha_estreno = None
    if 'imagen_url' in data:
        pelicula.imagen_url = data['imagen_url']

    db.session.commit()
    return jsonify(pelicula.to_dict())

@peliculas_bp.route('/api/peliculas/<int:id>', methods=['DELETE'])
def api_eliminar_pelicula(id):
    pelicula = Pelicula.query.get_or_404(id)
    db.session.delete(pelicula)
    db.session.commit()
    return jsonify({'mensaje': 'Película eliminada correctamente'}), 200
