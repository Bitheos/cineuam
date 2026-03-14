from flask import Blueprint, request, jsonify, render_template
from app import db
from app.models import Reserva, Funcion
from datetime import datetime, timezone
import uuid

reservas_bp = Blueprint('reservas', __name__)

@reservas_bp.route('/reservas')
def lista_reservas():
    reservas = Reserva.query.order_by(Reserva.fecha_reserva.desc()).all()
    return render_template('reservas/index.html', reservas=reservas)

@reservas_bp.route('/reservas/nueva')
def nueva_reserva():
    funciones = Funcion.query.order_by(Funcion.fecha_hora).all()
    return render_template('reservas/nueva.html', funciones=funciones)

# API endpoints
@reservas_bp.route('/api/reservas', methods=['GET'])
def api_lista_reservas():
    reservas = Reserva.query.order_by(Reserva.fecha_reserva.desc()).all()
    return jsonify([r.to_dict() for r in reservas])

@reservas_bp.route('/api/reservas', methods=['POST'])
def api_crear_reserva():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No se proporcionaron datos'}), 400
    if not data.get('funcion_id'):
        return jsonify({'error': 'La función es obligatoria'}), 400
    if not data.get('nombre_cliente'):
        return jsonify({'error': 'El nombre del cliente es obligatorio'}), 400
    if not data.get('email_cliente'):
        return jsonify({'error': 'El email del cliente es obligatorio'}), 400
    if not data.get('cantidad_asientos'):
        return jsonify({'error': 'La cantidad de asientos es obligatoria'}), 400

    funcion = Funcion.query.get(data['funcion_id'])
    if not funcion:
        return jsonify({'error': 'Función no encontrada'}), 404

    cantidad = data['cantidad_asientos']
    if cantidad <= 0:
        return jsonify({'error': 'La cantidad de asientos debe ser mayor a 0'}), 400

    asientos_disponibles = funcion.asientos_disponibles()
    if cantidad > asientos_disponibles:
        return jsonify({
            'error': f'No hay suficientes asientos disponibles. Disponibles: {asientos_disponibles}'
        }), 400

    codigo = str(uuid.uuid4())[:8].upper()
    reserva = Reserva(
        funcion_id=data['funcion_id'],
        nombre_cliente=data['nombre_cliente'],
        email_cliente=data['email_cliente'],
        cantidad_asientos=cantidad,
        codigo_reserva=codigo,
        fecha_reserva=datetime.now(timezone.utc)
    )
    db.session.add(reserva)
    db.session.commit()
    return jsonify(reserva.to_dict()), 201

@reservas_bp.route('/api/reservas/<int:id>', methods=['GET'])
def api_obtener_reserva(id):
    reserva = Reserva.query.get_or_404(id)
    return jsonify(reserva.to_dict())

@reservas_bp.route('/api/reservas/<int:id>', methods=['DELETE'])
def api_cancelar_reserva(id):
    reserva = Reserva.query.get_or_404(id)
    db.session.delete(reserva)
    db.session.commit()
    return jsonify({'mensaje': 'Reserva cancelada correctamente'}), 200
