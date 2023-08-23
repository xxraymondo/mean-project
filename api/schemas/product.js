const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product = {
    title: { type: String, required: true },
    buyingPrice: { type: Number, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, default: 0 },
    img: [String],
    description: { type: String, default:""},
    keywords: { type: String, default:""},
    category:{type:String, required: true},
    stripPriceId: { type: String, default:""}
}
//type: Schema.Types.ObjectId, ref:'Category'

const productSchema = new Schema(product, { timestamps: true });
productSchema.index({isbn:'text', title:'text', authorName:'text', description:'text', keywords:'text'});
const Product = mongoose.model('Product', productSchema);
Product.createIndexes({ maxTimeMS: 20000 });
module.exports = Product;