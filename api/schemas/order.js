const mongoose = require('mongoose');
const Constants = require('../utils/constants');
const Schema = mongoose.Schema;
const order = {
    customerInfo:{
        userId: { type: Schema.Types.ObjectId, ref:'User'},
        mobile: { type: String, defalut:""},
        addressLine:{ type: String, defalut: ""},
        district: { type: String, default:""},
        state: { type: String, default:""}
    },
    products:[
        {
            productId:{type: Schema.Types.ObjectId, ref:'Product'},
            title:{type:String, required:true},
            buyingPrice:{type: Number, default:1},
            price:{type:Number, required:true},
            itemsCount:{type: Number, default:1},
            total:{type:Number, default:0}
        }
    ],
    billSummary:{
        paymentMethod:{type: String, default:"COD"},
        totalPrice: {type: Number, default:0}
    },
    orderStatus:{type:String, default: Constants.ORDER_STATUS.received},
}

const orderSchema = new Schema(order,{
    timestamps: true
  });
const Order = mongoose.model('Order', orderSchema,);

module.exports = Order;

/*
{
    "mobile":"",
    "addressLine":"",
    "city":"",
    "state":"",
    "paymentMethod":""
}
*/