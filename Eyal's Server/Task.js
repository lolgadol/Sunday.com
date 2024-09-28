const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({

    user_id: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    status: { 
        type: String,
        enum:['done','working on it','stuck','other'], //0 Done, 1 Working on it,2 Stuck 3 other
        default: 'working on it'

    },

    priority: {
        type: String,
        enum:['low','medium','high']
    },

    dueDate: {
        type: String,
        default: Date.now.toString()

    }
})
const Task = mongoose.model("Task",TaskSchema);

module.exports = {Task,TaskSchema};