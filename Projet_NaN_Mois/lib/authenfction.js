//Permet de veirifier si User s'est logger

module.exports = {
    //S'il s est logger alors on continue a executé la suite du code 
 isLoggedIn(req, res, next) {
     if (req.isAuthenticated()) {
         return next();
     }
         //ds le cas contraire il le fait retourner a la page de connexion
     return res.redirect('/signin');
 },
    //Permet de ne pas avoir acces a sa partie 'SignUp et SignIn' étant connnecté sur son Profil 
 isNotLoggedIn(req, res, next) {
     if (!req.isAuthenticated()) {
         return next();
     }
     return res.redirect('/profil');
 }
};