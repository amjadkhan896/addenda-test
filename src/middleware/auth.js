const jwt  = require('jsonwebtoken')
const User = require('../models/user')

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

const auth = async (req,res,next) => {
    try {
       // console.log(localStorage.getItem('token'));
        const token = localStorage.getItem('token') || req.header('Authorization').replace('Bearer', '').trim()

        const decoded  = jwt.verify(token, process.env.JWT_SECRET)

        const user  = await User.findOne({ _id:decoded._id, 'tokens.token': token})

        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (error) {
        console.log(error)
        res.status(401).send({error:'Please authenticate!'})
    }
}

module.exports = auth