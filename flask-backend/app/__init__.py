from flask import Flask, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from .login import identity, authenticate
from .config import Config

db = SQLAlchemy()
migrate = Migrate()

api_bp = Blueprint('api', __name__)
api = Api(api_bp)

cors = CORS()

jwt = JWTManager()


def create_server(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app=app, db=db)
    cors.init_app(app)
    jwt.init_app(app)

    from .admin import admin as admin_bp
    app.register_blueprint(admin_bp)

    from .book import book as book_bp
    app.register_blueprint(book_bp)

    from .user import user as user_bp
    app.register_blueprint(user_bp)

    from .rent import rent as rent_bp
    app.register_blueprint(rent_bp)

    app.register_blueprint(api_bp)
    return app


from . import models