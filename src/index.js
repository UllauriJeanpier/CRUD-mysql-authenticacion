const express = require('express');
const morgan = require('morgan');
const exphbs =require('express-handlebars');
const path =require('path');
const flash = require('connect-flash');  // se necesita una session para que funcione
const session = require('express-session');     // las sessiones almacenan los datos en la memoria del servidor en este caso
const mysqlsession = require('express-mysql-session');  // para poder guardar los dotos de la session en la base de datos mysql
const passport = require('passport');

const { database } = require('./keys');
// initaliztions

const app = express();
require('./lib/passport');

// settigns

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// middlewares
app.use(session({
    secret: 'session_mysql_jean',
    resave: false,      // para que no se empieze a renovar 
    saveUninitialized: false,    // para que no se vuelva a estableceer
    store: new mysqlsession(database)       // con esta opcion ya se esta almacenndo en la base de datos
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


// global variables

app.use((req, res, next) => {
    app.locals.success = req.flash('success');       // se crea la variable global con el nombre success y se guarda el mensaje con el nombre success
    app.locals.message = req.flash('message');
    app.locals.user = req.user          // con esto la variable user puede ser accedida desde cualquier vista 
    next();
})  

// routes

app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));

// Public o static

app.use(express.static(path.join(__dirname, 'public')));

// stating the server

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});


