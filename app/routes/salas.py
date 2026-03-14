from flask import Blueprint, request, jsonify, render_template
from app import db
from app.models import Sala

salas_bp = Blueprint('salas', __name__)

@salas_bp.route('/salas')
def lista_salas():
    salas = Sala.query.all()
    return render_template('salas/index.html', salas=salas)

@salas_bp.route('/salas/nueva')
def nueva_sala():
    return render_template('salas/nueva.html')

# API endpoints
@salas_bp.route('/api/salas', methods=['GET'])
def api_lista_salas():
    salas = Sala.query.all()
    return jsonify([s.to_dict() for s in salas])

@salas_bp.route('/api/salas', methods=['POST'])
def api_crear_sala():
    data = request.get_json()
    if not data or not data.get('nombre'):
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    if not data.get('capacidad'):
        return jsonify({'error': 'La capacidad es obligatoria'}), 400

    sala = Sala(
        nombre=data['nombre'],
        capacidad=data['capacidad'],
        tipo=data.get('tipo')
    )
    db.session.add(sala)
    db.session.commit()
    return jsonify(sala.to_dict()), 201

@salas_bp.route('/api/salas/<int:id>', methods=['GET'])
def api_obtener_sala(id):
    sala = Sala.query.get_or_404(id)
    return jsonify(sala.to_dict())

@salas_bp.route('/api/salas/<int:id>', methods=['PUT'])
def api_actualizar_sala(id):
    sala = Sala.query.get_or_404(id)
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No se proporcionaron datos'}), 400

    if 'nombre' in data:
        if not data['nombre']:
            return jsonify({'error': 'El nombre es obligatorio'}), 400
        sala.nombre = data['nombre']
    if 'capacidad' in data:
        if not data['capacidad']:
            return jsonify({'error': 'La capacidad es obligatoria'}), 400
        sala.capacidad = data['capacidad']
    if 'tipo' in data:
        sala.tipo = data['tipo']

    db.session.commit()
    return jsonify(sala.to_dict())

@salas_bp.route('/api/salas/<int:id>', methods=['DELETE'])
def api_eliminar_sala(id):
    sala = Sala.query.get_or_404(id)
    db.session.delete(sala)
    db.session.commit()
    return jsonify({'mensaje': 'Sala eliminada correctamente'}), 200
