const mongoose = require('mongoose');
const User = mongoose.model('User')
const loginMiddleware = async(req, res, next) => {
    // Check for token in request headers
    const admin = req.session.islogged;

    // Verify token
    if (!admin) {
        return res.redirect('/login');
    }else{
       const user = await User.findOne({uid:req.session.token})
       if(user){
        req.session.user = user
        next()
       }else{
        return res.redirect('/login');
       }
    }

 
};

module.exports = loginMiddleware;