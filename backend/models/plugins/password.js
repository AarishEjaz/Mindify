const bcrypt = require("bcryptjs");

// Reusable Mongoose plugin that adds password hashing + comparison to a
// schema. Both User and Admin use it, so the logic lives in ONE place.
//
// Usage:
//   schema.plugin(withPassword);
function withPassword(schema) {
  // Hash the password before saving, but only when it changed.
  schema.pre("save", async function hashPassword(next) {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

  // Compare a plain password with the stored hash during login.
  schema.methods.matchPassword = function matchPassword(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
  };
}

module.exports = withPassword;
