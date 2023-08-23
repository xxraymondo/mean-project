const router = require('express').Router();
const cartController = require('../controllers/cartController');
const authorization = require('../utils/authorization');
const constants = require('../utils/constants');

router.post('/cartItem',
    authorization.verifyAccess(constants.Actions.addCartItem),
    cartController.addProductToCart);
router.delete('/cartItem/:productId([a-zA-Z0-9]*)',
    authorization.verifyAccess(constants.Actions.deleteCartItem),
    cartController.removeProductFromCart);
router.put('/cartItem',
    authorization.verifyAccess(constants.Actions.updateCartItem),
    cartController.updateCartItemCount);
router.get('/cart',
    authorization.verifyAccess(constants.Actions.getCart),
    cartController.getCart);

module.exports = router;
