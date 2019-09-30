from flask_restful import reqparse, abort
from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
import locale

from .models import Admin, User


class RequestArgument(reqparse.Argument):
    def __init__(self, *args, **kwargs):
        return super(RequestArgument, self).__init__(*args, **kwargs)

    def handle_validation_error(self, error, bundle_errors):
        message = f'"{self.name}" field is required'
        abort(400, error=message)


def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        identity = get_jwt_identity()
        admin = Admin.get_by_email(identity)
        if admin is None:
            abort(401, message='Admin access is required', status_code=401)
        return fn(*args, **kwargs)

    return wrapper


def user_required(fn):
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        identity = get_jwt_identity()
        user = User.get_by_username(identity)
        if user is None:
            abort(401, message='User access is required', status_code=401)
        return fn(*args, **kwargs)

    return wrapper


def money_formatter(amount):
    locale.setlocale(locale.LC_ALL, 'en_US.utf8')
    price = int(float(locale.currency(amount).split('$')[1])) * 100
    return price