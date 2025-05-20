const mongoose = require('mongoose');

const grocerySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    expirationDate: {
        type: Date,
        set: (v) => v ? new Date(v) : v
    },
    note: {
        type: String
    }
});

const Grocery = mongoose.model('Grocery', grocerySchema);
module.exports = Grocery