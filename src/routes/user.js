const express = require('express');
const router = new express.Router()
const User = require('../models/user')
const {ObjectID} = require('mongodb')
const validator = require('validator')
const {check, validationResult} = require('express-validator');


const authenticate = require('../middleware/auth')

router.get('/', (req, res) => {
    res.render('index', {page: 'Home', menuId: 'home'});

});


router.post('/register', async (req, res) => {
    const user = new User(req.body);
    try {
        const token = await user.newAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/me', authenticate, async (req, res) => {
    res.render('welcome', {page: 'Welcome', menuId: 'welcome', user: req.user});
})



router.post('/users/login', async (req, res) => {

    await check('email').isEmail().withMessage('Please enter valid email').run(req);
    await check('password').not().isEmpty().withMessage('Please enter password').run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    try {

        const user = await User.checkValidCredentials(req.body.email, req.body.password)
        // console.log(user);
        // res.send(user);
        const token = await user.newAuthToken()

        res.cookie('token', token, {httpOnly: true})
        res.send({user, token})
    } catch (error) {
        // console.log(error);
        // let t =  errors.push({"msg":error.message})
        res.status(422).send({errors:[{'msg':error.message}]})
    }
})

router.get('/users/logout', authenticate, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.clearCookie("token");
        res.redirect('/')
    } catch (error) {
        res.status(500).send()
    }
})



module.exports = router