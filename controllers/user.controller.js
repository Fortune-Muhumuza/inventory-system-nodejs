const User = require('../models/User')

exports.signup =(req, res) => {
    res.render('signup')
}

exports.login = (req, res) => {
    res.render('login')
}

exports.postSignup = (req, res) => {
    const newUser = new User({
		name: req.body.name,
		password: req.body.password
    });
    
    newUser.save()
    .then(() => res.json('User created'))
    .catch((err) => res.status(400).json('Error: ' + err));
}

exports.postLogin = async(req, res) => {
    let { name, password } = req.body;
	if (!name || !password) res.json('please provide name and password', 400);
    const user = await User.findOne({ name });
    console.log(user)

    if(!(req.body.name === user.name) || !(req.body.password === user.password)){
        res.json('wrong details')
    }
    res.redirect('/')
}