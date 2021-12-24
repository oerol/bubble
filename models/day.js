const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const daySchema = new Schema({
  weekday: {
    type: Number,
    required: true,
  },
});

const Day = mongoose.model("Day", daySchema);

module.exports = Day;
