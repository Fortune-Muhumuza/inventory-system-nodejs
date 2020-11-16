const User = require('../models/User');

exports.getLogin = (req, res) => {
    res.render('adminLogin')
}

exports.getDashboard = async(req, res) => {
const users = await User.find()
    res.json(users.length)
}