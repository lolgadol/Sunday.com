const mongoose = require("mongoose");
const {Task} = require("./Task");

const GroupTaskSchema = new mongoose.Schema({
    workingOnIt: [String] 
});

//TODO: make grouptask be saved in groupTasks collection in mongo
const GroupTask = Task.discriminator("", GroupTaskSchema,"GroupTasks");
module.exports = GroupTask; // Export GroupTask model