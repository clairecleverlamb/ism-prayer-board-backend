const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    breakfast: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meal"
    },
    lunch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meal"
    },
    dinner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meal"
    },
    firstSnack: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meal"
    },
    secondSnack: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meal"
    },
});

const Day = mongoose.model('Day', daySchema);
module.exports = Day;