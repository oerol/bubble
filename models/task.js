const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  tasks: [
    {
      bubble: String,
      id: Number,
      title: String,
      checked: Boolean,
      tags: [],
    },
  ],
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
