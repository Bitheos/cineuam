from datetime import datetime, timezone
import uuid
from app import db

class Pelicula(db.Model):
    __tablename__ = 'peliculas'

    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    director = db.Column(db.String(100))
    duracion_minutos = db.Column(db.Integer)
    genero = db.Column(db.String(50))
    sinopsis = db.Column(db.Text)
    fecha_estreno = db.Column(db.Date)
    imagen_url = db.Column(db.String(500))

    funciones = db.relationship('Funcion', backref='pelicula', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'director': self.director,
            'duracion_minutos': self.duracion_minutos,
            'genero': self.genero,
            'sinopsis': self.sinopsis,
            'fecha_estreno': self.fecha_estreno.isoformat() if self.fecha_estreno else None,
            'imagen_url': self.imagen_url
        }


class Sala(db.Model):
    __tablename__ = 'salas'

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    capacidad = db.Column(db.Integer, nullable=False)
    tipo = db.Column(db.String(20))

    funciones = db.relationship('Funcion', backref='sala', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'capacidad': self.capacidad,
            'tipo': self.tipo
        }


class Funcion(db.Model):
    __tablename__ = 'funciones'

    id = db.Column(db.Integer, primary_key=True)
    pelicula_id = db.Column(db.Integer, db.ForeignKey('peliculas.id'), nullable=False)
    sala_id = db.Column(db.Integer, db.ForeignKey('salas.id'), nullable=False)
    fecha_hora = db.Column(db.DateTime, nullable=False)
    precio = db.Column(db.Float)
    idioma = db.Column(db.String(20))

    reservas = db.relationship('Reserva', backref='funcion', lazy=True, cascade='all, delete-orphan')

    def asientos_disponibles(self):
        reservados = sum(r.cantidad_asientos for r in self.reservas)
        return self.sala.capacidad - reservados

    def to_dict(self):
        return {
            'id': self.id,
            'pelicula_id': self.pelicula_id,
            'sala_id': self.sala_id,
            'fecha_hora': self.fecha_hora.isoformat() if self.fecha_hora else None,
            'precio': self.precio,
            'idioma': self.idioma,
            'pelicula_titulo': self.pelicula.titulo if self.pelicula else None,
            'sala_nombre': self.sala.nombre if self.sala else None,
            'asientos_disponibles': self.asientos_disponibles()
        }


class Reserva(db.Model):
    __tablename__ = 'reservas'

    id = db.Column(db.Integer, primary_key=True)
    funcion_id = db.Column(db.Integer, db.ForeignKey('funciones.id'), nullable=False)
    nombre_cliente = db.Column(db.String(100), nullable=False)
    email_cliente = db.Column(db.String(100), nullable=False)
    cantidad_asientos = db.Column(db.Integer, nullable=False)
    codigo_reserva = db.Column(db.String(20), unique=True)
    fecha_reserva = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'funcion_id': self.funcion_id,
            'nombre_cliente': self.nombre_cliente,
            'email_cliente': self.email_cliente,
            'cantidad_asientos': self.cantidad_asientos,
            'codigo_reserva': self.codigo_reserva,
            'fecha_reserva': self.fecha_reserva.isoformat() if self.fecha_reserva else None,
            'pelicula_titulo': self.funcion.pelicula.titulo if self.funcion and self.funcion.pelicula else None,
            'sala_nombre': self.funcion.sala.nombre if self.funcion and self.funcion.sala else None,
            'fecha_hora_funcion': self.funcion.fecha_hora.isoformat() if self.funcion and self.funcion.fecha_hora else None
        }
