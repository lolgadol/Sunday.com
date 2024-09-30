const mongoose = require("mongoose");
const {Task} = require("./Task"); // Import Task model

const GroupTaskSchema = new mongoose.Schema({
    workingOnIt: [String] // Field for users working on this group task
});

// Use the discriminator method to create GroupTask model in the "GroupTasks" collection
const GroupTask = Task.discriminator("", GroupTaskSchema,"GroupTasks");
module.exports = GroupTask; // Export GroupTask model