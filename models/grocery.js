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
    }
});

const Grocery = mongoose.model('Grocery', grocerySchema);
module.exports = Grocery