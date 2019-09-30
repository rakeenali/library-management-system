# Library Management system

### Backend

Backend is created using Python's Flask framework. With utilities of flask-restful, marshamallow, flask-jwt-extended.
Stripe is used to handle payments of books rents on the servers side.

##### Note

You need to add your own Stripe public and private key in order for the app rent functionality to work properly.

### Frontend

Frontend is created using SvelteJS

#### Frontend Outline

- Svelte-routing is used to manage all the routes.
- Svelte store is used to manage different states of the application

##### Note

In frontend side of the things you need to add .env file with two variables of
URL=http://localhost:port
CLOUDINARY_API=your cloudinary public key

### To get started

```shell
# Clone the repo

git clone git@github.com:rakeenali/library-management-system

# then cd into the cloned repo

cd library-management-system

# install all the dependencies

# for the frontend type
cd svelte-frontend && npm run install

#to start the frontend
npm run dev

# for the backend
cd flask-backend

# install deps
pip install
# or if using pipenv
pipenv install

# run migrations
flask db init

flask db migrate -m "initial db setup"

flask db upgrade

# to start the backend
flask run

# to open shell
flask shell
```

## React Native app

React native interface for user side is coming soon
