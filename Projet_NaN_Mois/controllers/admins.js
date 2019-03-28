//Cette route permet de 'Creer, Afficher, Lister, Eliminer' les elements de ntre Projet 

const express = require('express');
const db = require('../database');
const {  isLoggedIn } = require('../lib/authenfction');
const upload = require('../lib/uplodimage');

const router = express.Router();

//Route au fichier (admins/add) pour avoir a la page d'abord et arrive sur la page on cherche a faire ntre post de formulaire
router.get('/add', isLoggedIn, (req, res) => {
    res.render('admins/add', {
        title: 'Admin Ajout'
    });
});

//Permet de faire Le d' Inserer les produits ds notre BD
router.post('/add', isLoggedIn, upload.single('image'), async(req, res) => {

    const { name_pain, price_pain, description } = req.body;
    const newAdd = { 
        name_pain,
        price_pain,
        description,
        image:req.file.filename,
        user_id: req.user.id 
     };
    
    await db.query('INSERT INTO boulangerie set ?', [newAdd]);
    req.flash('success', 'Enregistrement effectué avec succes');
    res.redirect('/admins');
});


//Route pour l'affichage des donnees a partir de la BD ds ntre page 'admins/list'
router.get('/', isLoggedIn, async (req, res) => {
    const link = await db.query('SELECT * FROM boulangerie WHERE user_id = ?', [req.user.id]);
    res.render('admins/list', { link, title: 'Admin liste' });
});


//Pour supprimer un element ds la BD
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM boulangerie WHERE ID = ?', [id]);
    req.flash('success', "Le Produit a été supprimer avec succes !!!");
    res.redirect('/admins');
});

//Pour modifier un element ds la BD
    //1er partie
    router.get('/edit/:id', isLoggedIn, async (req, res) => {
        const { id } = req.params;
        const link = await db.query('SELECT * FROM boulangerie WHERE id = ?', [id]);
        res.render('admins/edit', {lin: link[0]});
    });

//Pour modifier un element ds la BD
    //2eme partie
    router.post('/edit/:id', isLoggedIn, async (req, res) => {
        const { id } = req.params;
        const { name_pain, price_pain, description } = req.body;
        const newAdd = { 
            name_pain,
            price_pain,
            description   
        };
        await db.query('UPDATE boulangerie set ? WHERE id = ?', [newAdd, id]);
        req.flash('success',"Merci d' avoir modifier le Produit !!!");    
        res.redirect('/admins');            
    });

    
module.exports = router;