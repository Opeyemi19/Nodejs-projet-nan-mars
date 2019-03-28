const express = require('express');

const router = express.Router();

const passport = require('passport');
const db = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/authenfction');

//Cette route permet d afficher le formulaire de creaction de compte
router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('authen/signup');
});

//Route pour crer son compte et se connecter
router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect:  '/signin',
    failureRedirect: '/signup',
    failureFlash: true
}));

//Cette route permet de faire le Login
router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('authen/signin');
});

//Cette route permet de faire le Login
router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profil',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

//Cette route permet d' afficher le Produit commandé ds ma page Profil
router.get('/profil', isLoggedIn, async(req, res) => {
    const prod = await db.query('SELECT * FROM panier WHERE users_id = ?', [req.user.id]);
    res.render('profil', {prod});
});

//Permet d' annuller un Produit commandé
router.get('/profil/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM panier WHERE id_pan = ?', [id]);
    req.flash('success', "Le Produit a été annuller avec succes !!!");
    res.redirect('/');
});

//Route pour se deconnecter
router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/');
});


module.exports = router;