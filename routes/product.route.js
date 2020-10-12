'use strict';
const express = require('express');
const router = express.Router();
const product_controller = require('../controllers/product.controller');


router.get('/test', product_controller.test);
router.get('/', product_controller.product_display);
router.get('/sell', product_controller.product_sell);
router.get('/sellTransactions', product_controller.displayTransactions);
router.get('/sellTransactionsJSON', product_controller.displayTransactionsJSON);

router.post('/sell', product_controller.product_sell1);
router.post('/buy', product_controller.product_buy);



module.exports = router;
