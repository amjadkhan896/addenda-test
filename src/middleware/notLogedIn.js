const jwt  = require('jsonwebtoken')

const notLogedIn = async (req,res,next) => {

        //console.log(req.cookies,'----');
        const token =  req.cookies.token || req.header('Authorization').replace('Bearer', '').trim()

       if(token)
           res.redirect('/users/me')
        else
        next()

}

module.exports = notLogedIn