module.exports = {

    isLoggedIn (req, res, next) {       // para proteger las rutas, solo accessibles cuando esta logeado
        if(req.isAuthenticated()){
             return next();
        }
        return res.redirect('/signin');
    }
}