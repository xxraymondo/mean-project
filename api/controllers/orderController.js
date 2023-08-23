const orderModel = require('../models/orderModel');
const Constants= require('../utils/constants'); 

async function checkOut(req, res){
    let response = await orderModel.checkOut(req.user.cartId, req.body);
    if(!response.success){
        res.send(response);
        return;
    }
    res.status(response.status??200).send(response);
}

async function onPaymentStatusChange(req, res){
    let sig = req.headers['stripe-signature'];
    let body = req.body;
    let response = orderModel.onPaymentStatusChange(sig, body);
    if(!response.success){
        res.status(response.status??200).send(response.message);
        return;
    }
    res.send();
}

async function onPaymentSuccess(req, res){
    let response = await orderModel.onPaymentSuccess(req.body.paymentId, req.user.cartId);
    res.status(response.status??200).send(response);
}

async function onPaymentCancelled(req, res){
    let response = await orderModel.onPaymentCancelled(req.user.cartId);
    res.status(response.status??200).send(response);
}

async function calculateInventory(req, res){
    let response = await orderModel.calculateInventory(req.query);
    res.status(response.status??200).send(response);
}
async function updateOrderStatus(req, res){
    let data = req.body;
    let response = {success: true, status: 200};
    if(!data.orderId){
      response.status = 400;
      response.message = "The orderId is required";
      response.success = false;
      res.status(response.status??200).send(response);
      return;
    }
    if(!data.status || !Constants.ORDER_STATUS[data.status]){
        response.status = 400;
        response.message = "Enter valid status received, processing, cancelled, or delivered";
        response.success = false;
        res.status(response.status??200).send(response);
        return;
    }
    response = await orderModel.updateOrderStatus(data);
    res.status(response.status??200).send(response);
}

async function getDashboardInfo(req, res){
    let response = await orderModel.getDashboardInfo(req.query);
    res.send(response);
}
async function getOrdersByStatus(req, res){
    let orderStauts = req.query.status;
    if(!orderStauts) {
        res.status(400).send({success: false, message:"Required status"});
        return;
    }
    let response = await orderModel.getOrdersByStatus(orderStauts);
    res.status(response.status??200).send(response);
}
module.exports = {
    checkOut,
    onPaymentStatusChange,
    onPaymentSuccess,
    onPaymentCancelled,
    calculateInventory,
    updateOrderStatus,
    getDashboardInfo,
    getOrdersByStatus
}