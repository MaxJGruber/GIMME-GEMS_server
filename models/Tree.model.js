const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TreeSchema = new Schema({
    name: {type: String, required: true},
    height: {type: Number, required: true},
    type: {type: String, enum: ['Nordmann', 'Epicea', 'Nobilis', 'Omorika', 'Pungens'], required: true, default: 'Christmas Tree'},
    price: {type: Number, default: 99},
    description: {type:String, max: 250},
    age: Number,
    nb_times_rented: {type: Number, default: 0},
    rented_by: {type: Schema.Types.ObjectId, ref: 'User'},
    start_date_rent: Date,
    end_date_rent: Date,
    picture: {type: String, default: "https://www.entrefleuristes.com/custom/ebiz/img/article/sapin-de-noel-nordmann-entrefleuristes-0213-500.jpg"},
    timestamps: {createdAt: 'createdAt', updatedAt:'updatedAt'}
});

const TreeModel = mongoose.model('Tree', TreeSchema);
module.exports = TreeModel;
