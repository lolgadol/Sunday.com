const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    adminId: {
        type: String,
        required: true
    },
    memberId: {
        type: [String]
    }


})
const Group = mongoose.model("Group",GroupSchema);

module.exports = Group;