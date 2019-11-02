const express     = require('express');
const router      =  new express.Router()
const {ObjectID}  = require('mongodb')

const notLogedIn = require('../middleware/notLogedIn')


router.get('/', (req, res) => {
    res.render('index', {page:'Home', menuId:'home',name:'Amjad Khan' });

});

router.get('/register',notLogedIn, (req, res) => {
   // const token =  req.cookies.token || req.header('Authorization').replace('Bearer', '').trim()
   // if(token!=''){
       // res.redirect('/users/me')
    //}
    res.render('register', {page:'Register', menuId:'register' });

});

router.get('/login', notLogedIn, (req, res) => {
    res.render('login', {page:'Login', menuId:'login' });

});



module.exports = router