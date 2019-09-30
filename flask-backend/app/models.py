from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

from . import db

from .schemas import BookSchema, UserSchema, AdminSchema


class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), nullable=False, unique=True)
    password_hash = db.Column(db.String(128))
    books = db.relationship('Book', backref='putter', lazy='dynamic')

    @staticmethod
    def check_email(email):
        return Admin.query.filter_by(email=email).first()

    @staticmethod
    def get_by_email(email):
        return Admin.query.filter_by(email=email).first()

    def hash_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_json(self):
        ad = AdminSchema()
        books = [book.to_json() for book in self.books]
        obj = {'id': self.id, 'email': self.email, 'books': books}
        return ad.dump(obj)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def __repr__(self):
        return f'Admin {self.email} - {self.id}'


class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text())
    quantity = db.Column(db.Integer, default=1)
    isbn = db.Column(db.String())
    added_by = db.Column(db.Integer, db.ForeignKey('admin.id'))
    rent_price = db.Column(db.Integer, nullable=False)
    book_image = db.Column(db.Integer, nullable=False)
    lended_to = db.relationship('Rent', backref='book', lazy='dynamic')
    payment_made = db.relationship('Payment', backref='book', lazy='dynamic')

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def by_isbn(isbn):
        return Book.query.filter_by(isbn=isbn).first()

    def to_json(self):
        bs = BookSchema()
        obj = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'quantity': self.quantity,
            'isbn': self.isbn,
            'added_by': self.putter.email,
            'rent_price': self.rent_price,
            'book_image': self.book_image
        }
        return bs.dump(obj)

    def __repr__(self):
        return f'Book "{self.title} - {self.id}" added by "{self.added_by}" '


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    password_hash = db.Column(db.String(128))
    books_lended = db.relationship('Rent', backref='user', lazy='dynamic')
    payments = db.relationship('Payment', backref="user", lazy='dynamic')

    @staticmethod
    def get_by_username(username):
        return User.query.filter_by(username=username).first()

    def hash_password(self, password):
        self.password_hash = generate_password_hash(password)

    def can_rent_book(self, book):
        isbns = [rent.book.isbn for rent in self.books_lended]
        if book.isbn in isbns:
            return False
        return True

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def to_json(self):
        us = UserSchema()

        books = []
        for r_b in self.books_lended:
            book_data = r_b.book.to_json()
            book_data.update({'rented_on': r_b.rented_on, 'rent_id': r_b.id})
            books.append(book_data)
        obj = {'books': books, 'username': self.username, 'id': self.id}
        res = us.dump(obj)
        return res

    def __repr__(self):
        return f'User {self.username} - {self.id}'


class Rent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    rented_on = db.Column(db.DateTime)

    def save(self):
        self.rented_on = datetime.utcnow() + timedelta(days=7)
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return f'Book {self.book_id} is rented by {self.user_id} with id of {self.id}'


class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    charge_id = db.Column(db.String(128))
    amount = db.Column(db.String())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'))
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)

    def to_json(self):
        obj = {
            'id': self.id,
            'username': self.user.username,
            'title': self.book.title,
            'payment_made_at': self.createdAt,
            'amount': self.amount
        }
        return obj

    def save(self):
        db.session.add(self)
        db.session.commit()

    def __repr__(self):
        return f'Charge {self.id} of amount {self.amount} made on {self.createdAt}'