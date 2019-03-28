const express = require('express');
const db = require('../database');
const passport = require('passport');
const {  isLoggedIn } = require('../lib/authenfction');

const router = express.Router();

//Route pour l'affichage des donnees a partir de la BD ds ntre page 'index'
router.get('/', async (req, res) => {
    const links = await db.query('SELECT * FROM boulangerie');
    res.render('index', { links, title:'Acceuil' });
});

//Permet d'avoir plus Infos sur notre Produit Cliquer
router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const link = await db.query('SELECT * FROM boulangerie WHERE id = ?', [id]);
    res.render('detailProduit', {link, title: 'Details'});
});

//Permet de Poster notre Commande vers la page Profil
router.post('/profil', isLoggedIn, async(req, res) => {
    const { name_prod, price_prod, image } = req.body;
    const AddCommand = { name_prod, price_prod, image, users_id: req.user.id };
    await db.query('INSERT INTO panier set ?', [AddCommand]);
    req.flash('success', 'Commande enregistrer avec succes veuillez verifier votre Profil');
    res.redirect('/profil');
});


module.exports = router;