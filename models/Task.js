const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    task_name: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model("Task", TaskSchema);