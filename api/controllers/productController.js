const productModel = require('../models/productModel');

async function createProduct(req, res){
    let response = await productModel.createProduct(req.body);
    if(!response.success){
        res.status(500).send(response);
        return;
    }
    res.send(response);
}

async function updateProduct(req, res){
    let response = await productModel.updateProduct(req.body);
    if(!response.success){
        res.status(500).send(response);
        return;
    }
    res.send(response);
}

async function deleteProduct(req, res){
    let productId = req.params.productId;
    let response = await productModel.deleteProduct(productId);
    if(!response.success){
        res.status(500).send(response);
        return;
    }
    res.send(response);
}

async function getProducts(req, res){
    let reqBody = req.query;
    let response = await productModel.getProducts(reqBody);
    if(!response.success){
        res.status(500).send(response);
        return;
    }
    res.send(response);
}

module.exports ={
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getProducts
}