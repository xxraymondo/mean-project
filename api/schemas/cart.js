const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cart = {
    customer: { type: Schema.Types.ObjectId, ref: 'User'},
    isPaymentInitiated: { type: Boolean, default: false},
    products: [{
        product: { type: Schema.Types.ObjectId, ref:'Product'},
        itemsCount: { type: Number, default: 1 },
        price:{type:Number}
    }],
    cutomerInfo:{
        userId: { type: Schema.Types.ObjectId, ref:'User'},
        mobile: { type: String, defalut:""},
        addressLine:{ type: String, defalut: ""},
        district: { type: String, default:""},
        state: { type: String, default:""}
    },
    paymentId: {type:String, default:null}
}
const cartSchema = new Schema(cart, {
    timestamps: true
  });
const Cart = mongoose.model('Cart', cartSchema,);
module.exports = Cart;