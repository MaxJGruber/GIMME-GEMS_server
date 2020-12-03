const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    profilePicture: {type: String, default:'https://res.cloudinary.com/timothee-nicole/image/upload/v1602682004/de_iy5ov1.jpg'},
    phoneNumber: String,
    birthDate: Date
})

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;