from flask import current_app
from flask_restful import Resource, reqparse
from datetime import datetime, timedelta
from flask_jwt_extended import create_access_token, get_jwt_identity
import stripe

from ..schemas import ErrorSchema, MessageSchema, TokenSchema, BookReturnSchema, PaymentSchema
from ..models import User, Book, Rent
from ..utils import RequestArgument, user_required
from .. import api

create_user_body = reqparse.RequestParser(argument_class=RequestArgument)
create_user_body.add_argument('username',
                              required=True,
                              help="Username field is required")
create_user_body.add_argument('password',
                              required=True,
                              help="Password field is required")


class UserRegisterResource(Resource):
    def __init__(self):
        self.error_schema = ErrorSchema()
        self.message_schema = MessageSchema()

    def post(self):
        args = create_user_body.parse_args()

        if User.get_by_username(args['username']) is not None:
            error = {
                'error': f'User with username "{args.username}" already exist',
                'status_code': 409
            }
            error = self.error_schema.dump(error)
            return error, 409

        user = User(username=args['username'])
        user.hash_password(args['password'])
        user.save()

        message = {'message': 'User created successfuly', 'status_code': 201}
        message = self.message_schema.dump(message)
        return message, 201


class UserResource(Resource):
    def __init__(self):
        self.error_schema = ErrorSchema()
        self.token_schema = TokenSchema()

    @user_required
    def get(self):
        username = get_jwt_identity()
        user = User.get_by_username(username)
        res = user.to_json()
        return res, 200

    def post(self):
        args = create_user_body.parse_args()
        user = User.get_by_username(args['username'])

        if user is None or not user.check_password(args['password']):
            error = {
                'error': f'Invalid username or password',
                'status_code': 401
            }
            error = self.error_schema.dump(error)
            return error, 409

        access_token = create_access_token(identity=user.username)
        res = {'token': access_token}
        res = self.token_schema.dump(res)
        return res, 200


class RentResource(Resource):
    def __init__(self):
        self.error_schema = ErrorSchema()
        self.message_schema = MessageSchema()
        self.book_return_schema = BookReturnSchema()

    @user_required
    def get(self, isbn):
        username = get_jwt_identity()
        user = User.get_by_username(username)
        book = Book.by_isbn(isbn)

        if book is None:
            res = {'error': f'Book with isbn {isbn} does not exist'}
            return self.error_schema.dump(res), 404

        if not user.can_rent_book(book):
            rent = Rent.query.filter_by(user_id=user.id,
                                        book_id=book.id).first()
            now = datetime.utcnow()
            price = book.rent_price
            fine = now - rent.rented_on

            is_late = False
            if fine.days >= 1:
                price = price + (fine.days *
                                 current_app.config['PER_DAY_FINE'])
                is_late = True

            res = {
                'payment': price,
                'is_late': is_late,
                'time_left': rent.rented_on,
                'fine_amount': fine.days * current_app.config['PER_DAY_FINE']
            }
            return self.book_return_schema.dump(res), 200

        res = {'error': 'You can\'t see information of a book you dont have'}
        return self.error_schema.dump(res), 404

    @user_required
    def post(self, isbn):
        book = Book.by_isbn(isbn)
        username = get_jwt_identity()
        user = User.get_by_username(username)

        if book is None:
            res = {'error': f'Book with isbn {isbn} does not exist'}
            return self.error_schema.dump(res), 404

        if book.quantity <= 0:
            res = {
                'error': f'Book {book.title} is currently out of stock',
                'status_code': 400
            }
            return self.error_schema.dump(res), 400

        if user.can_rent_book(book):
            book.quantity = book.quantity - 1
            rent = Rent(book_id=book.id, user_id=user.id)
            rent.save()
            res = {'message': 'Book rented successfuly'}
            return self.message_schema.dump(res), 200

        res = {'message': 'You already have a copy of this book'}
        return self.message_schema.dump(res), 200


class UserRentDetail(Resource):
    def __init__(self):
        self.payment_schema = PaymentSchema(many=True)

    @user_required
    def get(self):
        username = get_jwt_identity()

        user = User.get_by_username(username)
        payments = [p.to_json() for p in user.payments]
        return self.payment_schema.dump(payments), 200


api.add_resource(UserRegisterResource, '/user/register')
api.add_resource(UserResource, '/user')
api.add_resource(RentResource, '/user/rent-book/<string:isbn>')
api.add_resource(UserRentDetail, '/user/rent/detail')
