const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    taste: {
        type: String,
        enum: ['sweet', 'salty', 'sour', 'tasteless'], // Enclose enum values in quotes
        required: true
    },
    is_drink: {
        type: Boolean,
        default: false
    },
    ingredients: {
        type: [String],
        default: []
    },
    numberOfSales: {
        type: Number,
        default: 0
    }
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
