from marshmallow import Schema, fields


class ErrorSchema(Schema):
    error = fields.Str()
    status_code = fields.Int(default=404)


class MessageSchema(Schema):
    message = fields.Str()
    status_code = fields.Int(default=200)


class TokenSchema(Schema):
    token = fields.Str()
    status_code = fields.Int(default=200)


class BookReturnSchema(Schema):
    is_late = fields.Boolean(default=False)
    payment = fields.Number()
    status_code = fields.Int(default=200)
    time_left = fields.DateTime()
    fine_amount = fields.Number()


class BookSchema(Schema):
    id = fields.Int()
    title = fields.Str()
    description = fields.Str()
    quantity = fields.Str()
    isbn = fields.Str()
    added_by = fields.Str()
    rent_price = fields.Int()
    rented_on = fields.DateTime()
    rent_id = fields.Int()
    book_image = fields.Url()


class UserSchema(Schema):
    id = fields.Int()
    username = fields.Str()
    books = fields.Nested(
        BookSchema,
        many=True,
        exclude=(
            'added_by',
            'quantity',
        ),
    )


class AdminSchema(Schema):
    id = fields.Int()
    email = fields.Str()
    books = fields.Nested(BookSchema,
                          many=True,
                          exclude=(
                              'rented_on',
                              'rent_id',
                          ))


class PaymentSchema(Schema):
    id = fields.Str()
    username = fields.Str()
    title = fields.Str()
    payment_made_at = fields.DateTime()
    amount = fields.Str()