const express = require('express')
const router = express.Router()

const adminController = require('../controllers/admin.controller')


router.get('/login', adminController.getLogin)
router.get('/adminDashboard', adminController.getDashboard)

router.post('/deleteBusiness', adminController.deleteBusiness)

module.exports = router

