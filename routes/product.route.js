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
router.get('/storeDataJSON', product_controller.displayStoreGraphData)
router.get('/permanentRecords', checkToken.checkAuth, product_controller.getPermanentRecords)
router.get('/singleProduct/:id', checkToken.checkAuth, product_controller.displaySingleProduct)
router.get('/singleSaleRecord/:id', checkToken.checkAuth, product_controller.displaySingleSaleRecord)

router.post('/sell', checkToken.checkAuth, product_controller.product_sell1);
router.post('/buy', checkToken.checkAuth, product_controller.product_buy);
//some of these may need to be changed to post method
router.get('/deleteRecord/:id', checkToken.checkAuth, product_controller.deleteStoreRecord);
router.get('/deleteSaleRecord/:id', checkToken.checkAuth, product_controller.deleteSaleRecord)



module.exports = router;
