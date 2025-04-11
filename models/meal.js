const mongoose = require("mongoose");

const mealSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  column: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Day",
    default: null,
  },
  mealType: {
    type: String,
    enum: [
      "breakfast",
      "lunch",
      "dinner",
      "firstSnack",
      "secondSnack",
      "unassigned",
    ],
    default: "unassigned",
  },
});

const Meal = mongoose.model("Meal", mealSchema);
module.exports = Meal;
