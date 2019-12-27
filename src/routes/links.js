const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');

const pool = require('../database')

router.get('/add', isLoggedIn,(req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };
    req.flash('success', 'Link saved successfully');    // se llama a la variable global con nombre success 
    await pool.query('INSERT INTO links set ?', [newLink]);
    res.redirect('/links');
})


router.get('/', isLoggedIn, async (req, res) => { // como tiene el /links por default configurado en el servidor  el / equivale a /links en este caso
    const links = await pool.query('SELECT * FROM links')
    console.log(links);
    res.render('links/list', {links});
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Link deleted successfully'); 
    res.redirect('/links');
})

router.get('/update/:id', isLoggedIn,async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    console.log(links);
    res.render('links/edit',{link: links[0]}) ;
});

router.post('/update/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const newLink = {
        title,
        description,
        url
    }
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link updated successfully');    // se llama a la variable global con nombre success 
    res.redirect('/links');
})

module.exports = router;