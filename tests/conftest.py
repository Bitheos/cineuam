import pytest
from app import create_app, db as _db

@pytest.fixture(scope='session')
def app():
    app = create_app('testing')
    return app

@pytest.fixture(scope='function')
def db(app):
    with app.app_context():
        _db.create_all()
        yield _db
        _db.session.remove()
        _db.drop_all()

@pytest.fixture(scope='function')
def client(app, db):
    return app.test_client()
