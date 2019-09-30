from flask_restful import Resource, reqparse
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from .. import api
from ..models import Admin
from ..schemas import ErrorSchema, MessageSchema, TokenSchema
from ..utils import RequestArgument

register_request = reqparse.RequestParser(argument_class=RequestArgument)
register_request.add_argument('email',
                              required=True,
                              help='Email is required',
                              type=str)
register_request.add_argument('password',
                              required=True,
                              help='Password is required',
                              type=str)


class AdminRegister(Resource):
    def __init__(self, **kwargs):
        self.error_schema = ErrorSchema()
        self.message_schema = MessageSchema()

    def post(self):
        args = register_request.parse_args(strict=True)

        if Admin.check_email(args['email']) is not None:
            error = {
                'error': f'Admin with email "{args.email}" already exist',
                'status_code': 409
            }
            error = self.error_schema.dump(error)
            return error, 409

        admin = Admin(email=args['email'])
        admin.hash_password(args['password'])
        admin.save()

        message = {
            'message': 'Account created successfuly',
            'status_code': 201
        }
        message = self.message_schema.dump(message)
        return message, 201


class AdminLogin(Resource):
    def __init__(self, **kwargs):
        self.error_schema = ErrorSchema()
        self.message_schema = MessageSchema()
        self.token_schema = TokenSchema()

    @jwt_required
    def get(self):
        email = get_jwt_identity()
        admin = Admin.get_by_email(email)
        return admin.to_json(), 200

    def post(self):
        args = register_request.parse_args(strict=True)
        admin = Admin.get_by_email(args['email'])

        if admin is None or not admin.check_password(args['password']):
            error = {'error': f'Invalid email or password', 'status_code': 401}
            error = self.error_schema.dump(error)
            return error, 401

        access_token = create_access_token(identity=admin.email)
        res = {'token': access_token}
        res = self.token_schema.dump(res)
        return res, 200


api.add_resource(AdminRegister, '/admin/register')
api.add_resource(AdminLogin, '/admin')
