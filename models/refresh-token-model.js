const mongoose = require("mongoose");

const RefreshTokenSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
});

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);
RefreshToken.deleteMany({}).then(() => {
    console.log("RefreshToken collection is cleared");
}); // Clear table
module.exports = RefreshToken;
