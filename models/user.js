const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: { type: String, required: true },
  mail: {
    type: String,
    required: true,
  },
  likes: { type: Array, default: [] },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
