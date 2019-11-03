const jwt  = require('jsonwebtoken')

const notLogedIn = async (req,res,next) => {

        //console.log(req.cookies,'----');
        const token =  req.cookies.token

       if(token)
           res.redirect('/users/me')
        else
        next()

}

module.exports = notLogedIn