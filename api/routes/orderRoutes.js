const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authorization = require('../utils/authorization');
const constants = require('../utils/constants');

router.post('/order', authorization.verifyAccess(constants.Actions.placeOrder), orderController.checkOut);
router.post('/paymentSuccess', authorization.verifyAccess(constants.Actions.placeOrder), orderController.onPaymentSuccess);
router.get('/paymentCanceled', authorization.verifyAccess(constants.Actions.placeOrder), orderController.onPaymentCancelled);
router.get('/inventory', authorization.verifyAccess(constants.Actions.updateOrderStatus), orderController.calculateInventory);
router.post('/webhook', express.raw({type: 'application/json'}),orderController.onPaymentStatusChange);
router.put('/orderStatus',authorization.verifyAccess(constants.Actions.updateOrderStatus), orderController.updateOrderStatus);
router.get('/dashboardInfo', authorization.verifyAccess(constants.Actions.updateOrderStatus), orderController.getDashboardInfo);
router.get('/ordersByStatus', authorization.verifyAccess(constants.Actions.updateOrderStatus), orderController.getOrdersByStatus);
module.exports = router;