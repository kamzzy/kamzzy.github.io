const express = require('express');

const connectFlash = require('connect-flash')
const { config, engine } = require('express-edge');
const expressSession = require('express-session')
const path = require('path')
const mongoose = require('mongoose')
const connectMongo = require('connect-mongo')
const regpageController = require('./controlers/regpageController.js')
const bodyParser = require('body-parser')
const storeUserController = require('./controlers/storeUser')
const loginController = require('./controlers/loginController')


mongoose.connect('mongodb://localhost:27017/kamzy', { useNewUrlParser: true })
const mongoStore = connectMongo(expressSession)
const app = express();

app.use(expressSession({

    secret: 'secret',
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    }),

    cookie: { maxAge: 200000 }

}));
// Configure Edge if need to
config({ cache: process.env.NODE_ENV === 'production' });

// Automatically sets view engine and adds dot notation to app.render

app.use(connectFlash())
app.use(express.static('public'))
app.use(engine);
app.set('views', `${__dirname}/views`)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', regpageController);
app.post('/users/register', storeUserController)
app.post('/users/login', loginController)




app.listen(60);