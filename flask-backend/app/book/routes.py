from flask_restful import Resource, reqparse, abort
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from uuid import uuid4

from .. import api, db
from ..utils import RequestArgument, admin_required
from ..models import Admin, Book
from ..schemas import BookSchema, ErrorSchema, MessageSchema

book_body = reqparse.RequestParser(argument_class=RequestArgument)
book_body.add_argument('title', required=True, help='Title field is required')
book_body.add_argument('description',
                       required=True,
                       help='Description field is required')
book_body.add_argument('quantity', required=False, default=1, type=int)
book_body.add_argument('rent_price',
                       required=True,
                       type=int,
                       help='Books rent is required')
book_body.add_argument('book_image',required=True,help='Image is required')

book_update_body = reqparse.RequestParser(argument_class=RequestArgument)
book_update_body.add_argument('quantity',
                              required=True,
                              type=int,
                              help='Quantity field is required')


class BooksResrource(Resource):
    def __init__(self, *args, **kwargs):
        self.book_schema = BookSchema()

    def get(self):
        books = Book.query.all()
        res = [book.to_json() for book in books]
        return res, 200

    @admin_required
    def post(self):
        args = book_body.parse_args()
        email = get_jwt_identity()
        id = Admin.get_by_email(email).id
        book = Book(title=args['title'],
                    description=args['description'],
                    quantity=args['quantity'],
                    rent_price=args['rent_price'],
                    isbn=uuid4().hex[:10],
                    added_by=id,
                    book_image=args['book_image'])
        book.save()
        book = book.to_json()
        res = self.book_schema.dump(book)
        return res, 201


class BookResrource(Resource):
    def __init__(self):
        self.error_shcema = ErrorSchema()
        self.message_schema = MessageSchema()

    def get(self, isbn):
        book = Book.by_isbn(isbn)

        if book is None:
            res = {'error': f'Book with isbn {isbn} does not exist'}
            return self.error_shcema.dump(res), 404

        res = book.to_json()
        return res, 200

    @admin_required
    def post(self, isbn):
        args = book_update_body.parse_args()
        book = Book.by_isbn(isbn)
        if book is None:
            res = {'error': f'Book with isbn {isbn} does not exist'}
            return self.error_shcema.dump(res), 404

        req_quantity = args['quantity']
        if req_quantity == 0:
            abort(400)

        add = True if req_quantity >= 1 else False
        print(add)
        if add:
            book.quantity = book.quantity + args['quantity']
        else:
            book.quantity = book.quantity + args['quantity']

        book.save()
        return book.to_json(), 201

    @admin_required
    def delete(self, isbn):
        book = Book.by_isbn(isbn)
        if book is None:
            res = {'error': f'Book with isbn {isbn} does not exist'}
            return self.error_shcema.dump(res), 404
        db.session.delete(book)
        db.session.commit()
        obj = {'message': 'Book deleted'}
        return self.message_schema.dump(obj), 200


api.add_resource(BooksResrource, '/book')
api.add_resource(BookResrource, '/book/<string:isbn>')
