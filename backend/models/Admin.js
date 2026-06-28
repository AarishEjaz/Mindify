const mongoose = require("mongoose");
const withPassword = require("./plugins/password");

// Admins live in their own collection, fully separate from regular users.
// All admin data is stored here.
const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    // Role is fixed to "admin" for every document in this collection.
    role: { type: String, default: "admin", enum: ["admin"] },
  },
  { timestamps: true }
);

// Adds the password hashing hook + matchPassword() method.
adminSchema.plugin(withPassword);

module.exports = mongoose.model("Admin", adminSchema);
