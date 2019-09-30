from app import create_server, db
from app.models import Admin, Book, User, Rent, Payment

app = create_server()


@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'Admin': Admin,
        'Book': Book,
        'User': User,
        'Rent': Rent,
        'Payment': Payment
    }
