const express     = require('express');
const router      =  new express.Router()
const User        = require('../models/user')
const {ObjectID}  = require('mongodb')

const authenticate  = require('../middleware/auth')

router.get('/', (req, res) => {
    res.render('index', {page:'Home', menuId:'home',name:'Amjad Khan' });

});


router.post('/register', (req,res) => {
    console.log(JSON.stringify(req.headers));

    const user = new User(req.body);
    try{
        const token =  user.newAuthToken()

    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/users/me', authenticate,async (req,res)=> {
    console.log('req')
    res.send(req.user)
})


router.patch('/users/me',authenticate ,async (req,res) => {
    const updates  = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "password", "phone"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    const _id =  req.user._id

    if(!isValidOperation){
        res.status(400).send({error:'Invalid request'})
    }

    if (!ObjectID.isValid(_id)) {
        return res.status(404).send();
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user);
    } catch (error) {
        res.status(400).send()
    }

})

router.delete('/users/me', authenticate, async (req,res) => {
    req.setHeader('Authorization:', 'Bearer '+'ddd');
    if (!ObjectID.isValid(req.user._id)) {
        return res.status(404).send();
    }

    try {
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/login', async (req, res) => {
    try {

        const user  = await User.checkValidCredentials(req.body.email, req.body.password)
        const token = await user.newAuthToken()

        res.send({ user, token})
    } catch (error) {
        res.status(400).send()
    }
})

router.post('/users/logout', authenticate, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) =>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})


router.post('/users/logoutall', authenticate, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})


module.exports = router