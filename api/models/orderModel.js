const Order = require('../schemas/order');
const Cart = require('../schemas/cart');
const Product = require('../schemas/product');
const userModel = require('../services/userService');
const { response } = require('express');
const stripe = require('stripe')('sk_test_51NZf7MIVT2r7id06eE3eJ5gjkAhl8v9IJEYDFHBjU3YjFj2OXCti7MhWBdG9xwqzDdmsjZekdOMdmxqBXd4CXcJV00kkyMohy5');
const TEMP_DOMAIN = "http://127.0.0.1:5500/";
const PAYMENT_METHOD = {
  cod: 'COD',
  card: "CARD"
};

async function checkOut(cartId, orderInfo) {
  let cart = await getCart(cartId);
  if (!cart.result.products || cart.result.products.length <= 0) {
    return { success: false, message: "Empty Cart" };
  }
  if (orderInfo.paymentMethod == PAYMENT_METHOD.cod) {
    cart.result.cutomerInfo = orderInfo;
    let order = formOrderFromCart(cart.result, PAYMENT_METHOD.cod);
    let savingOrderResult = await saveOrder(order);
    if (!savingOrderResult.success) return savingOrderResult;
    return await resetCartAndProducts(cart.result);
  }
  return await beginPaymentSession(cart, orderInfo);
}

async function beginPaymentSession(cart, orderInfo) {
  let response = { success: true };
  if (!cart.success) return cart;
  if (!cart.result.products || cart.result.products.length == 0) return { success: false, message: "Empty Cart" };
  let itemsList = getProductsList(cart.result);

  const session = await stripe.checkout.sessions.create({
    line_items: itemsList,
    mode: 'payment',
    success_url: `${TEMP_DOMAIN}success.html`,
    cancel_url: `${TEMP_DOMAIN}cancel.html`,
  }).catch(err => {
    response.success = false;
    response.message = "Error occurred while creating payment session";
  });
  if (!response.success) return response;

  response.result = {
    url: session.url,
    paymentId: session.id
  }
  orderInfo.userId = cart.customer;
  cart.result.cutomerInfo = orderInfo;
  cart.result.paymentId = session.id;
  await cart.result.save();
  return response;
}

async function onPaymentSuccess(paymentId, cartId) {
  let response = { success: true };
  let cart = await getCart(cartId);
  cart = cart.result;
  if (!cart.paymentId || cart.paymentId != paymentId) {
    response.success = false;
    response.message = "There is no payment initiated.";
    return response;
  }

  response.result = formOrderFromCart(cart);
  let savingOrderResult = await saveOrder(response.result);
  if (!savingOrderResult.success) return savingOrderResult;
  response = await resetCartAndProducts(cart);
  return response;
}

async function onPaymentCancelled(cartId) {
  let response = { success: true, status: 200 };
  await Cart.findByIdAndUpdate(cartId, { paymentId: null, cutomerInfo: null }).catch(err => {
    response.success = false;
    response.message = "Error while cancelling payment";
    response.status = 500;
  });
  if (!response.success) return response;
  response.result = "Order Cancelled successfully";
  return response;
}

function getProductsList(cart) {
  let productsList = [];
  for (let cartItem of cart.products) {
    productsList.push({
      price_data: {
        currency: 'egp',
        unit_amount: cartItem.product.price * 100,
        product_data: {
          name: cartItem.product.title,
          images: cartItem.product.img
        },
      },
      quantity: cartItem.itemsCount
    });
  }
  return productsList;
}

async function getCart(cartId) {
  let response = { success: true };
  let cartObj = await Cart.findById(cartId)
    .select({ "__v": 0, "products._id": 0, "products.price": 0 })
    .populate('products.product', ['title', 'price', 'img', 'buyingPrice'])
    .exec()
    .catch(err => {
      console.log("failed to get cart", err);
      response.success = false;
    });

  if (!response.success) {
    response.message = "Error Occured while getting cart";
    return response;
  }

  // let cart = formCartForResponse(cartObj); 
  response.result = cartObj;
  return response;
}

async function saveOrder(orderObj) {
  let newOrder = new Order(orderObj);
  let response = { success: true };
  await newOrder.save().catch(err => {
    response.success = false;
    response.message = "Error Occured while saving your order";
  });
  return response;
}

function formOrderFromCart(cart, paymentMethod) {
  let order = {};
  let total = 0;
  let itemsCount = 0;
  order.customerInfo = { ...cart.cutomerInfo };
  order.customerInfo.userId = cart.customer._id;
  order.products = [];
  let product = {};
  for (let cartItem of cart.products) {
    product.productId = cartItem.product._id;
    product.title = cartItem.product.title;
    product.price = cartItem.product.price;
    product.buyingPrice = cartItem.product.buyingPrice;
    product.itemsCount = cartItem.itemsCount;
    product.total = cartItem.product.price * cartItem.itemsCount;
    order.products.push(product);
    total += product.total;
    itemsCount += product.itemsCount;
    product = {};
  }
  order.billSummary = {
    paymentMethod: paymentMethod ?? PAYMENT_METHOD.card,
    totalPrice: total
  };
  return order;
}

function onPaymentStatusChange(sig, body) {
  const endpointSecret = "whsec_bc83324eaed4abe6233794ab39e67a8884b745cad06de22c7b239239742d794c";
  let event;
  let response = { success: true, status: 200 };

  event = stripe.webhooks.constructEvent(body, sig, endpointSecret).catch(err => {
    response.success = false;
    response.status = 400;
    response.message = `Webhook Error: ${err.message}`;
    return response;
  });

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      console.log(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return response;
}

async function resetCartAndProducts(cart, canceled = false) {
  let response = { success: true, status: 200 };
  cart.paymentId = null;
  cart.customerInfo = null;

  if (canceled) {
    await cart.save().catch(err => {
      response.success = false;
      response.status = 500;
      response.message = "Error while updating the cart."
    });
    return response;
  }

  let productsUpdateQuery = cart.products.map((cartItem) => {
    return {
      updateOne: {
        filter: { _id: cartItem.product._id },
        update: { $inc: { amount: -cartItem.itemsCount } }
      }
    };
  });
  Product.bulkWrite(productsUpdateQuery).catch((error) => {
    console.error(error);
  });
  cart.products = [];
  await cart.save().catch(err => {
    response.success = false;
    response.status = 500;
    response.message = "Error while updating the cart."
  });
  if (!response.success) {
    return response;
  }
  response.result = {
    customer: "64c66d02f463e3e81e006056",
    products: [],
    paymentId: null,
    total: 0,
    itemsCount: 0
  }
  return response;
}

async function calculateInventory(filter) {
  let matchQuery
  //let limit = {};
  if (filter && filter.from) {
    matchQuery = {createdAt: {}};
    matchQuery.createdAt.$gte = toDate(filter.from);
  }
  if (filter && filter.to) {
    if(!matchQuery) matchQuery = {createdAt: {}};
    matchQuery.createdAt.$lte = toDate(filter.to);
  }
  if(!matchQuery) matchQuery = {};
 // if (filter && filter.limit) limit = {$limit: filter.limit};
  let response = { success: true, status: 200 };
  let pipeline = [
    {
      $match: matchQuery
    },
    { $unwind: '$products' },
    {
      $group: {
        _id: '$products.productId',
        productTitle: { $first: '$products.title' },
        totalItemsSold: { $sum: '$products.itemsCount' },
        totalCost: { $sum: { $multiply: ['$products.buyingPrice', '$products.itemsCount'] } },
        totalRevenue: { $sum: { $multiply: ['$products.price', '$products.itemsCount'] } },
        profit: { $sum: { $multiply: [{ $subtract: ['$products.price', '$products.buyingPrice'] }, '$products.itemsCount'] } }
      },

    }, {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $project: {
        _id: 1,
        productTitle: 1,
        totalItemsSold: 1,
        avaliable: '$product.amount',
        totalCost: 1,
        totalRevenue: 1,
        profit: 1,
        img: '$product.img'

      },
    },
    { $sort: { totalItemsSold: -1 } },
  ];
  if(filter && filter.limit) pipeline.push({$limit: Number(filter.limit)});
  let result = await Order.aggregate(pipeline).catch(err => {
    console.log(err);
    response.status = 500;
    response.success = false;
    response.message = "Error Occured";
  });
  if (!response.success) return response;
  response.result = result;
  return response;
}

async function updateOrderStatus(data) {
  let response = { success: true, status: 200 };
  await Order.findByIdAndUpdate(data.orderId, { orderStatus: data.status }).catch(err => {
    response.status = 500;
    response.success = false;
    response.message = "Error Occured";
  });
  if (!response.success) return response;
  response.result = "Updated Successfully";
  return response;
}

async function getDashboardInfo(filter) {
  let matchQuery = {
  };
  if (filter && filter.from) {
    if (!matchQuery.createdAt) matchQuery.createdAt = {};
    matchQuery.createdAt.$gte = toDate(filter.from);
  }
  if (filter && filter.to) {
    if (!matchQuery.createdAt) matchQuery.createdAt = {};
    matchQuery.createdAt.$lte = toDate(filter.to);
  }
  let currentDate = new Date();
  let beforeWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
  let weekPeriodFilter = {
    createdAt: {
      $gte: beforeWeek,
      $lte: currentDate
    }
  }
  let [[totalSold], [weekSold], activeUsers]  = await Promise.all([
    getSoldItemsCount(matchQuery),
    getSoldItemsCount(weekPeriodFilter),
    userModel.getNumberOfActiveUsers(filter)
  ]);
  let response = {
    periodSold: totalSold ? totalSold.totalSold: 0,
    periodEarnings: totalSold ? totalSold.totalEarnings:0,
    weekSold: weekSold ? weekSold.totalSold : 0,
    weekEarnings: weekSold ? weekSold.totalEarnings : 0,
    activeUsers: activeUsers.result
  };
  return response;
}

async function getOrdersByStatus(status) {
  let response = { success: true, status: 200 };
  let result = await Order.find({ orderStatus: status })
  .select({'customerInfo.userId':1, billSummary:1, orderStatus:1, createdAt:1})
    .populate('customerInfo.userId', ['name', 'email'])
    .exec()
    .catch(err => {
      response.success = false;
      response.message = "Error while getting orders";
      response.status = 500;
    });
  if (!response.success) return response;
  response.result = result;
  return response;
}

async function getSoldItemsCount(dateFilter) {
  let aggregateQuery = [
    {
      $match: dateFilter
    },
    { $unwind: '$products' },
    {
      $group: {
        _id: null,
        totalSold: { $sum: '$products.itemsCount' },
        totalEarnings: { $sum: '$billSummary.totalPrice' }
      }
    }
  ];
  let result = await Order.aggregate(aggregateQuery);
  return result;
}

function toDate(dateString) {
  return new Date(dateString);
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
};
