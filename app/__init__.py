from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import config

db = SQLAlchemy()

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    db.init_app(app)

    from app.routes.peliculas import peliculas_bp
    from app.routes.salas import salas_bp
    from app.routes.funciones import funciones_bp
    from app.routes.reservas import reservas_bp
    from app.routes import main_bp

    app.register_blueprint(peliculas_bp)
    app.register_blueprint(salas_bp)
    app.register_blueprint(funciones_bp)
    app.register_blueprint(reservas_bp)
    app.register_blueprint(main_bp)

    with app.app_context():
        db.create_all()

    return app
