const mongoose = require('mongoose');

const mealSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    note: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
});

const Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;