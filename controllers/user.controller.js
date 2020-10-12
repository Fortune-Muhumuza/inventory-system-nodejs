const User = require('../models/User');
const bcrypt = require('bcrypt')



exports.signup = (req, res) => {
  res.render('signup');
};

exports.login = (req, res) => {
  res.render('login');
};

exports.postSignup = async(req, res) => {
  try{
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const user = new User({
          name: req.body.name,
          password: hashedPassword
      })
      user.save()
      res.redirect('/user/login')
 }
  catch{
res.redirect('/signup')
  }
};

exports.postLogin = async (req, res) => {
  let { name, password } = req.body;
  if (!name || !password) res.json('please provide name and password', 400);
  const user = await User.findOne({ name });
  console.log(user);

  if (
    !(req.body.name === user.name) ||
    !(req.body.password === user.password)
  ) {
    res.json('wrong details');
  }


  res.redirect('/');
};
