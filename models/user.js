const { name } = require("ejs");
const mongoose = require("mongoose");



const userSchema = mongoose.Schema({
  username: String,
  name: String,
  age: Number,
  email: String,
  password: String,
  profilepic: {
    type: String,
    default: "default.png",

  },
    playerId: { type: String },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
});

module.exports = mongoose.model("user", userSchema);
