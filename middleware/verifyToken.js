//const User = require('../models/User')



exports.checkAuth = (req, res, next) => {
  //this wasnt working because the session middleware was set to secure which only meant it could only work via https
  //console.log(req.session)
  //const user = User.findById(req.params.id).exec();
  if(req.session.user){
    next()
  }else{
    res.redirect('/user/login')
  }
//thank you Lord
}