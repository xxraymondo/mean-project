const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authorization = require('../utils/authorization');
const constants = require('../utils/constants');

router.get('/product', productController.getProducts);
router.put('/product', authorization.verifyAccess(constants.Actions.updateProduct), productController.updateProduct);
router.delete('/product/:productId([a-zA-Z0-9]*)', authorization.verifyAccess(constants.Actions.deleteProduct), productController.deleteProduct);
router.post('/product', authorization.verifyAccess(constants.Actions.addProduct), productController.createProduct);

module.exports = router;