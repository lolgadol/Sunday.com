const mongoose = require("mongoose");
const Task = require("./Task");


const GroupTaskSchema = Task.TaskSchema.discriminator("GroupTask",new mongoose.Schema({
    workingOnIt: [String]
}));


const GroupTask = mongoose.model("GroupTask",GroupTaskSchema);
module.exports = GroupTask;