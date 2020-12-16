const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    totalPrice: {type: Number, default: 0},
    inProgress:  {type: Boolean, default: true},
    isCompleted: {type: Boolean, default: false},
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'},
    basket: [{type: Schema.Types.ObjectId, ref: 'Tree'}]
},
{timestamps: {createdAt: 'created_at', updatedAt:'updatedAt'}}
);

const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel;
