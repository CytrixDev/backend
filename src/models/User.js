const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    email: String,
    first_name: String,
    last_name: String,
    role: String,
    profile: String,
    privilages: [String],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

UserSchema.methods.checkPassword = function (pass) {
  return bcrypt.compareSync(pass, this.password);
};

module.exports = mongoose.model("User", UserSchema);
