const express = require('express')
const router = express.Router()
const checkAdmin = require('../middleware/verifyAdmin')

const adminController = require('../controllers/admin.controller')


router.get('/login', adminController.getLogin)
router.get('/adminDashboard', checkAdmin.checkAdmin, adminController.getDashboard)

router.post('/deleteBusiness', checkAdmin.checkAdmin, adminController.deleteBusiness)

module.exports = router

