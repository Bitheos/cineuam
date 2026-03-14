# CineUAM - Sistema de Gestión de Cine

Sistema web para la gestión de un cine, desarrollado con Python Flask como proyecto académico para la UAM.

## Descripción

CineUAM es una aplicación web completa para gestionar las operaciones de un cine, incluyendo:
- Catálogo de películas
- Gestión de salas
- Programación de funciones
- Sistema de reservas de entradas

## Características

- 🎬 **Gestión de Películas**: Añadir, editar y eliminar películas con información detallada (director, género, sinopsis, etc.)
- 🏢 **Gestión de Salas**: Administrar las salas del cine con su capacidad y tipo (2D, 3D, IMAX)
- 📅 **Programación de Funciones**: Crear funciones vinculando películas con salas, con precio e idioma
- 🎫 **Sistema de Reservas**: Reservar asientos con validación de disponibilidad y código único
- 📊 **Panel de Control**: Vista general con estadísticas del sistema
- 🔌 **API REST**: Endpoints completos para todas las operaciones

## Requisitos

- Python 3.8+
- pip

## Instalación

```bash
git clone <url-repositorio>
cd cineuam
pip install -r requirements.txt
```

## Ejecución

```bash
python run.py
```

La aplicación estará disponible en http://localhost:5000

## Tests

```bash
python -m pytest tests/ -v
```

## Estructura del Proyecto

```
cineuam/
├── app/                    # Aplicación Flask
│   ├── __init__.py        # Factory de la aplicación
│   ├── models.py          # Modelos SQLAlchemy
│   ├── routes/            # Blueprints de rutas
│   ├── static/            # CSS y JavaScript
│   └── templates/         # Plantillas HTML (Jinja2)
├── tests/                  # Tests con pytest
├── config.py              # Configuración
├── run.py                 # Punto de entrada
└── requirements.txt       # Dependencias
```

## API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/peliculas | Listar películas |
| POST | /api/peliculas | Crear película |
| GET | /api/peliculas/{id} | Obtener película |
| PUT | /api/peliculas/{id} | Actualizar película |
| DELETE | /api/peliculas/{id} | Eliminar película |
| GET | /api/salas | Listar salas |
| POST | /api/salas | Crear sala |
| GET | /api/salas/{id} | Obtener sala |
| PUT | /api/salas/{id} | Actualizar sala |
| DELETE | /api/salas/{id} | Eliminar sala |
| GET | /api/funciones | Listar funciones |
| POST | /api/funciones | Crear función |
| GET | /api/funciones/{id} | Obtener función |
| PUT | /api/funciones/{id} | Actualizar función |
| DELETE | /api/funciones/{id} | Eliminar función |
| GET | /api/reservas | Listar reservas |
| POST | /api/reservas | Crear reserva |
| GET | /api/reservas/{id} | Obtener reserva |
| DELETE | /api/reservas/{id} | Cancelar reserva |

## Tecnologías

- **Backend**: Python, Flask, Flask-SQLAlchemy
- **Base de datos**: SQLite (desarrollo), SQLite en memoria (tests)
- **Frontend**: Bootstrap 5, JavaScript (AJAX)
- **Tests**: pytest, pytest-flask