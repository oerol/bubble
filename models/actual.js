const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const actualSchema = new Schema({
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
    },
  ],
});

const Actual = mongoose.model("actual", actualSchema);

module.exports = Actual;
