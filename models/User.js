const mongoose = require("mongoose");

/**
 * User's model:
 * - Username: String, required, unique
 * - Email: String, required, unique
 * - Password: String, required
 * - Admin status: Boolean, default value=false
 */
/* Creating a new schema for the user model. */
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
