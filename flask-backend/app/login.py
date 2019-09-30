def authenticate(username, password):
    from .models import User
    user = User.query.filter_by(username=username).first()
    return user


def identity(payload):
    from .models import User
    user = User.query.get(payload['identity'])
    return user