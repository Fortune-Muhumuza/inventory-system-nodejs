const User = require('../models/User');

exports.getLogin = (req, res) => {
    res.render('adminLogin')
}

exports.getDashboard = async(req, res) => {
const users = await User.find()
    res.json(users.length)
}

exports.deleteBusiness = async(req, res) => {
    const businessName = req.body.businessName

    const deleteAccount = await User.findOneAndDelete({businessName: businessName})
    res.json('Business has been deleted')
    
}