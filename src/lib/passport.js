const passport = require('passport');       // permite hacer authenticacion con medios sociasles, como facebook, twitter ,etc
const LocalStrategy =  require('passport-local').Strategy;  // para hacer la authenticacion de forma local, con la base de datos
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.descryptPassword(password, user.password);
        if (validPassword) {
             done(null, user, req.flash('success', 'Welcome'+ user.username));
        }else {
             done(null, false, req.flash('message','Incorrect password'));
        }
    }else {
         done (null, false, req.flash('message','The Username does not exists'));
    }
}));

passport.use('local.signup', new LocalStrategy ({
    usernameField: 'username',      // deben ser los mmismo names de los inputs 
    passwordField: 'password',
    passReqToCallback: true     // le estamos diciendo que se va a aceptra el obejto request
}, async (req, username, password, done) => {
    const { fullname } = req.body;
    const newUser = {       // creando el objeto para almacenarlo en la base de datos
        username,
        password,
        fullname
    };
    newUser.password = await helpers.encryptPassword(password);
    const user = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (user.length == 0){
        const result = await pool.query('INSERT INTO users SET ?', [newUser]);
        newUser.id = result.insertId;       // se le agraga otro campo a newUser y se asigna el valor de la propiedad insertId
        done(null, newUser);         // para indicar que termino, null para indeicar que no hay error y el newUser para alamacenarlo en una session
    }else {
        req.flash('message','this username already exists');
        done(null, false);
    }
}));

passport.serializeUser((usr, done) => {     // cuando se serializa se guarda el id del usuario
    done (null, usr.id);
});

passport.deserializeUser(async (id, done) => {  // cuando se deserializa se toma el id del usuario para buscarlo
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);    
})

