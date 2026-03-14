from flask import Blueprint, render_template
from app.models import Pelicula, Sala, Funcion, Reserva

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    total_peliculas = Pelicula.query.count()
    total_salas = Sala.query.count()
    total_funciones = Funcion.query.count()
    total_reservas = Reserva.query.count()
    peliculas_recientes = Pelicula.query.order_by(Pelicula.id.desc()).limit(5).all()
    funciones_proximas = Funcion.query.order_by(Funcion.fecha_hora).limit(5).all()
    return render_template('index.html',
        total_peliculas=total_peliculas,
        total_salas=total_salas,
        total_funciones=total_funciones,
        total_reservas=total_reservas,
        peliculas_recientes=peliculas_recientes,
        funciones_proximas=funciones_proximas
    )
