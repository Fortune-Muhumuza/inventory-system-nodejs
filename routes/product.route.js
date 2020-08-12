const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const product_controller = require('../controllers/product.controller');


router.get('/test', product_controller.test);
//router.get('/:id', product_controller.product_details);
//router.put('/:id/update', product_controller.product_update);
router.get('/', product_controller.product_display);
router.get('/sell', product_controller.product_sell);
router.get('/sellTransactions', product_controller.displayTransactions);

router.post('/sell', product_controller.product_sell1)
router.post('/update', product_controller.product_update1)
router.post('/buy', product_controller.product_buy);
router.delete('/:id/delete', product_controller.product_delete);

module.exports = router;