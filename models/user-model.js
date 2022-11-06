const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: [String],
        required: true, // Requires the array to have at least one role
    },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
