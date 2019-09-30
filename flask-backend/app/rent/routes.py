from flask_restful import Resource, current_app, reqparse, abort
from flask_jwt_extended import get_jwt_identity
from datetime import datetime
import stripe
import locale

from ..schemas import TokenSchema, ErrorSchema, MessageSchema
from ..utils import user_required, RequestArgument, money_formatter
from .. import api
from ..models import User, Rent, Book, Payment

card_body = reqparse.RequestParser(argument_class=RequestArgument)
card_body.add_argument('number', type=int, help='Card number is required')
card_body.add_argument('exp_month',
                       type=int,
                       help='Card expiry month is reqruied')
card_body.add_argument('exp_year',
                       type=int,
                       help='Car expiry year is required')
card_body.add_argument('cvc', type=int, help='Car CVC is required')


class StripeTokenResource(Resource):
    def __init__(self):
        self.error_schema = ErrorSchema()
        self.token_schema = TokenSchema()

    @user_required
    def post(self):
        args = card_body.parse_args()
        stripe.api_key = current_app.config['STRIPE_PUBLIC_KEY']
        try:
            token = stripe.Token.create(
                card={
                    'number': args.number,
                    'exp_month': args.exp_month,
                    'exp_year': args.exp_year,
                    'cvc': args.cvc,
                })
            print(token.id)
            res = {'token': token.id}
            return self.token_schema.dump(res), 200
        except Exception as err:
            res = {'error': err.user_message}
            return self.error_schema.dump(res), 400


charge_body = reqparse.RequestParser(argument_class=RequestArgument)
charge_body.add_argument('token', default='Card token is required')


class StripeCardResource(Resource):
    def __init__(self):
        self.error_schema = ErrorSchema()
        self.message_schema = MessageSchema()

    @user_required
    def post(self, isbn):
        args = charge_body.parse_args()
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

            if fine.days >= 1:
                price = price + (fine.days *
                                 current_app.config['PER_DAY_FINE'])

            try:
                amount = money_formatter(price)
                stripe.api_key = current_app.config['STRIPE_PRIVATE_KEY']
                charge = stripe.Charge.create(
                    amount=amount,
                    currency='usd',
                    source=args.token,
                    description='Charging testing user')

                payment = Payment(user_id=user.id,
                                  book_id=book.id,
                                  charge_id=charge.id,
                                  amount=amount)
                rent.delete()
                book.quantity = book.quantity + 1
                book.save()
                payment.save()

                res = {'message': 'Payment successfull'}
                return self.message_schema.dump(res), 200
            except Exception as err:
                res = {'error': err.user_message}
                return self.error_schema.dump(res), 400


api.add_resource(StripeCardResource, '/user/rent-charge/<string:isbn>')
api.add_resource(StripeTokenResource, '/user/rent-token')
