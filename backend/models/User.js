
const mongoose = require("mongoose");

// Create user schema
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    }

});

// Create user model
const User = mongoose.model("User", userSchema);

// Export the model
module.exports = User;
 