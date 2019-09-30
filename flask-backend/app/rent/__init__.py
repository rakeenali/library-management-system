from flask import Blueprint

rent = Blueprint('rent', __name__)

from . import routes