const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const daySchema = new Schema({
  weekday: {
    type: Number,
    required: true,
  },
  bubbles: [
    {
      height: Number,
      id: String,
      title: String,
      color: String,
      tasks: [],
      tags: [],
    },
  ],
});

const Day = mongoose.model("Day", daySchema);

module.exports = Day;
