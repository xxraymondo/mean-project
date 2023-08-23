//models/cartModel.js
const Cart = require('../schemas/cart');
const Product = require('../schemas/product');

async function createCart(userId) {
    let cartObj = new Cart({ customer: userId, products: [] });
    let result = await cartObj.save().catch(err => {
        console.log("failed to create cart", err);
        throw err;
    });
    return result._id;
}

async function getCart(cartId) {
    let response = { success: true };
    let cartObj = await Cart.findById(cartId)
    .select({ "__v": 0, "_id": 0, "products._id": 0 , "products.price": 0})
    .populate('products.product', ['title', 'price', 'img'])
    .exec()
    .catch(err => {
        console.log("failed to get cart", err);
        response.success = false;
    });

    if (!response.success) {
        response.message = "Error Occured while getting cart";
        return response;
    }

    let cart = formCartForResponse(cartObj); // assign the updated cart object to a new variable
    response.result = cart;
    return response;
}

async function addProductToCart(cartId, productData) {
    let response = {success: true, status: 200};
    let cart = await Cart.findById(cartId)
    .select({ "__v": 0})
    .populate('products.product', ['_id','title', 'price', 'img', 'amount'])
    .exec();
    let cartItem = getCartItemData(cart, productData.product);
    if(cartItem){
        let productTotalAmount = productData.itemsCount + cartItem.itemsCount;
        if(productTotalAmount > cartItem.product.amount){
            response.success = false;
            response.message = `The product avaliable amount is only ${cartItem.product.amount}`;
            return response;
        }
        cartItem.itemsCount = productTotalAmount;
    }else{
        let productInfo = await getProductInfo(productData.product);
        if(!productInfo){
            response.success = false;
            response.message = "Product ID is not found";
            return response;
        }
        if(productData.itemsCount > productInfo.amount){
            response.success = false;
            response.message = `The product avaliable amount is only ${cartItem.product.amount}`;
            return response;
        }
        productData.price = productInfo.price;
        cart.products.push(productData);
    }
    await cart.save().catch(err =>{response.success = false;});
    if(!response.success){
        response.message = "error occurred while adding the product to cart";
        response.status = 500;
        return response;
    }
    let cartData = formCartForResponse(cart);
    response.result = cartData;
    return response;
}

async function removeProductFromCart(cartId ,productId) {
    let response = {success: true, status: 200};
    let cart = await Cart.findById(cartId)
    .select({ "__v": 0})
    .populate('products.product', ['_id','title', 'price', 'img'])
    .exec();
    cart.products.splice(getCartItemIndex(cart, productId),1);
    await cart.save().catch(err=>{
        response.success = false;
        response.status = 500;
        response.message = "Error Occured while removing product from cart";
        return response;
    });
    response.result = formCartForResponse(cart);
    return response;
}

async function updateCartItemCount(cartId, productInfo){
    let response = {success: true, status: 200};
    let cart = await Cart.findById(cartId)
    .select({ "__v": 0})
    .populate('products.product', ['_id','title', 'price', 'img', 'amount'])
    .exec();

    let cartItem = getCartItemData(cart, productInfo.productId);
    if(productInfo.count > cartItem.product.amount){
        response.success = false;
        response.message = `The product avaliable amount is only ${cartItem.product.amount}`;
        return response;
    }

    cartItem.itemsCount = productInfo.count;
    await cart.save().catch(err =>{response.success = false;});
    if(!response.success){
        response.message = "Error occurred while updating cartItem count";
        response.status = 500;
        return response;
    }
    response.result = formCartForResponse(cart);
    return response;
}


function getCartItemData(cart, productId) {
    for (let cartItem of cart.products)
            if (productId == cartItem.product._id) return cartItem;
}

function formCartForResponse(cart) {
    cart = cart.toObject();
    cart.total = 0;
    cart.itemsCount = 0;
    for (let cartItem of cart.products) {
        cartItem.itemTotal = (cartItem.product.price??cartItem.price) * cartItem.itemsCount;
        cart.total += cartItem.itemTotal;
        cart.itemsCount += cartItem.itemsCount;
    }
    return cart;
}

async function getProductInfo(productId){
    let productInfo = await Product.findById(productId).select({"amount":1, "price":1}).catch(err =>{
        console.log("Error while getting product available amount", err);
    });
    return productInfo;
}

function getCartItemIndex(cart,productId){
   return cart.products.findIndex((cartItem)=> cartItem.product._id == productId);
}
module.exports = {
    createCart,
    getCart,
    addProductToCart,
    removeProductFromCart,
    updateCartItemCount
}