const express     = require('express');
const router      =  new express.Router()
const {ObjectID}  = require('mongodb')

const authenticate  = require('../middleware/auth')

router.get('/', (req, res) => {
    res.render('index', {page:'Home', menuId:'home',name:'Amjad Khan' });

});

router.get('/register', (req, res) => {
    res.render('register', {page:'Register', menuId:'register' });

});

router.get('/login', (req, res) => {
    res.render('login', {page:'Login', menuId:'login' });

});



module.exports = router