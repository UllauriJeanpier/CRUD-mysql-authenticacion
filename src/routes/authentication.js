const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');

const passport = require('passport');       // como ya se inicializo en el docuemnto passport.js se importa toda la biblioteca

router.get('/signup', (req, res) => {
    res.render('auth/signup');
})


router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',            // como ya redireccionana no es necesario ponerlo en un request y un response
    failureRedirect: '/signup',
    failureFlash: true
}));


router.get('/signin', (req,res) => {
    res.render('auth/signin');
});

router.post('/signin', (req, res, next) => {
    passport.authenticate('local.signin', { 
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true   // para poder enviar mensajes flash a la vista 
    })(req, res, next);
});

router.get('/profile', isLoggedIn ,(req, res) => {
    res.render('profile');
});


router.get('/logout', (req, res) => {       // para cerrar session del passport
    req.logOut();               // cunaod se inicializa el passport el request es poblado con varios metodos, uno de esos metodos es logout()
    res.redirect('/signin');
});


module.exports = router;

