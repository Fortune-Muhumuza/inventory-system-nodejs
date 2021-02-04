exports.checkAdmin = (req, res, next) => {

    if(req.session.user){
      next()
    }else{
      res.render('error', {error: 'Forbidden'})
    }
  //thank you Lord
  }