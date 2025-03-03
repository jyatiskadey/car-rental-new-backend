const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    imageUrl: {
        type: String,
        required: true
    }
}, {
    timestamps: true // adds createdAt and updatedAt fields automatically
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
