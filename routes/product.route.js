'use strict';
const express = require('express');
const router = express.Router();
const product_controller = require('../controllers/product.controller');
const checkToken = require('../middleware/verifyToken')

router.get('/test', checkToken.checkAuth, product_controller.test);
router.get('/', checkToken.checkAuth, product_controller.product_display);
router.get('/sell', checkToken.checkAuth, product_controller.product_sell);
router.get('/sellTransactions', checkToken.checkAuth, product_controller.displayTransactions);
router.get('/sellTransactionsJSON', product_controller.displayTransactionsJSON);
router.get('/permanentRecords', checkToken.checkAuth, product_controller.getPermanentRecords)

router.post('/sell', checkToken.checkAuth, product_controller.product_sell1);
router.post('/buy', checkToken.checkAuth, product_controller.product_buy);



module.exports = router;
