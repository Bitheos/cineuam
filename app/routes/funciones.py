from flask import Blueprint, request, jsonify, render_template
from app import db
from app.models import Funcion, Pelicula, Sala
from datetime import datetime

funciones_bp = Blueprint('funciones', __name__)

@funciones_bp.route('/funciones')
def lista_funciones():
    funciones = Funcion.query.order_by(Funcion.fecha_hora).all()
    return render_template('funciones/index.html', funciones=funciones)

@funciones_bp.route('/funciones/nueva')
def nueva_funcion():
    peliculas = Pelicula.query.all()
    salas = Sala.query.all()
    return render_template('funciones/nueva.html', peliculas=peliculas, salas=salas)

# API endpoints
@funciones_bp.route('/api/funciones', methods=['GET'])
def api_lista_funciones():
    query = Funcion.query
    pelicula_id = request.args.get('pelicula_id', type=int)
    sala_id = request.args.get('sala_id', type=int)
    if pelicula_id:
        query = query.filter_by(pelicula_id=pelicula_id)
    if sala_id:
        query = query.filter_by(sala_id=sala_id)
    funciones = query.order_by(Funcion.fecha_hora).all()
    return jsonify([f.to_dict() for f in funciones])

@funciones_bp.route('/api/funciones', methods=['POST'])
def api_crear_funcion():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No se proporcionaron datos'}), 400
    if not data.get('pelicula_id'):
        return jsonify({'error': 'La película es obligatoria'}), 400
    if not data.get('sala_id'):
        return jsonify({'error': 'La sala es obligatoria'}), 400
    if not data.get('fecha_hora'):
        return jsonify({'error': 'La fecha y hora son obligatorias'}), 400

    if not Pelicula.query.get(data['pelicula_id']):
        return jsonify({'error': 'Película no encontrada'}), 404
    if not Sala.query.get(data['sala_id']):
        return jsonify({'error': 'Sala no encontrada'}), 404

    try:
        fecha_hora = datetime.fromisoformat(data['fecha_hora'])
    except ValueError:
        return jsonify({'error': 'Formato de fecha/hora inválido'}), 400

    funcion = Funcion(
        pelicula_id=data['pelicula_id'],
        sala_id=data['sala_id'],
        fecha_hora=fecha_hora,
        precio=data.get('precio'),
        idioma=data.get('idioma')
    )
    db.session.add(funcion)
    db.session.commit()
    return jsonify(funcion.to_dict()), 201

@funciones_bp.route('/api/funciones/<int:id>', methods=['GET'])
def api_obtener_funcion(id):
    funcion = Funcion.query.get_or_404(id)
    return jsonify(funcion.to_dict())

@funciones_bp.route('/api/funciones/<int:id>', methods=['PUT'])
def api_actualizar_funcion(id):
    funcion = Funcion.query.get_or_404(id)
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No se proporcionaron datos'}), 400

    if 'pelicula_id' in data:
        if not Pelicula.query.get(data['pelicula_id']):
            return jsonify({'error': 'Película no encontrada'}), 404
        funcion.pelicula_id = data['pelicula_id']
    if 'sala_id' in data:
        if not Sala.query.get(data['sala_id']):
            return jsonify({'error': 'Sala no encontrada'}), 404
        funcion.sala_id = data['sala_id']
    if 'fecha_hora' in data:
        try:
            funcion.fecha_hora = datetime.fromisoformat(data['fecha_hora'])
        except ValueError:
            return jsonify({'error': 'Formato de fecha/hora inválido'}), 400
    if 'precio' in data:
        funcion.precio = data['precio']
    if 'idioma' in data:
        funcion.idioma = data['idioma']

    db.session.commit()
    return jsonify(funcion.to_dict())

@funciones_bp.route('/api/funciones/<int:id>', methods=['DELETE'])
def api_eliminar_funcion(id):
    funcion = Funcion.query.get_or_404(id)
    db.session.delete(funcion)
    db.session.commit()
    return jsonify({'mensaje': 'Función eliminada correctamente'}), 200
