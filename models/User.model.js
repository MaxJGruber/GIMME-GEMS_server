const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// DB MODEL FOR A USER

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    address: {
        city: { type: String, required: true},
        zipCode: {type: Number, required: true},
        street: {type: String, required: true}
    },
    profilePicture: {type: String, default:'https://res.cloudinary.com/timothee-nicole/image/upload/v1602682004/de_iy5ov1.jpg'},
    phoneNumber: String,
    birthDate: Date,
    isNL: Boolean,
    agree: {type: Boolean, required: true},
    isAdmin: {type: Boolean, default: false},
    allOrders: [{type: Schema.Types.ObjectId, ref: 'Order'}]
})

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;