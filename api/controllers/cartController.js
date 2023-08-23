const { ReadableStreamDefaultController } = require('stream/web');
const cartModel = require('../models/cartModel');

/*async function createCart(req, res){
   let cartId = await cartModel.createCart("64c28f639f765f89c2152c36");
   res.send(cartId);
}*/

async function addProductToCart(req, res){
    let result = await cartModel.addProductToCart(req.user.cartId, req.body);
    res.status(result.status??200).send(result);
}

async function getCart(req, res){
    let result = await cartModel.getCart(req.user.cartId);
    res.send(result);
}

async function removeProductFromCart(req, res){
    let result = await cartModel.removeProductFromCart(req.user.cartId, req.params.productId);
    res.status(result.status??200).send(result);
}

async function updateCartItemCount(req, res){
    let result = await cartModel.updateCartItemCount(req.user.cartId, req.body);
    res.status(result.status??200).send(result);
}

module.exports = {
    addProductToCart,
    getCart,
    removeProductFromCart,
    updateCartItemCount
};