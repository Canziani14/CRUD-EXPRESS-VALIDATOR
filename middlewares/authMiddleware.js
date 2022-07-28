/*si no tengo a nadie en session lo redirijo al login para evitar que al usuario le aparezca un error si 
escriben la ruta del profile
*/

const authMiddleware = function  (req, res, next){
    if (!req.session.userLogged){
        return res.redirect ("/user/login")
    }
    next();

}

module.exports = authMiddleware;