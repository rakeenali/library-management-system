import os
from datetime import timedelta
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    SECRET_KEY = os.environ.get("SECRET_KEY") or "crack-dis"
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL") or 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=5)
    JWT_SECRET_KEY = os.environ.get("SECRET_KEY") or "you-will-never-guess"
    PER_DAY_FINE = os.environ.get('PER_DAY_FINE') or 0.5
    STRIPE_PUBLIC_KEY = os.environ.get(
        'STRIPE_PUBLIC_KEY') or '[Your stripe public key]'
    STRIPE_PRIVATE_KEY = os.environ.get(
        'STRIPE_PRIVATE_KEY') or '[Your stripe private key]'
