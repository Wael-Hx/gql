const { model, Schema } = require("mongoose");
const bcrypt = require("bcrypt");

const opts = {
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
};

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  opts
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = async function (password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  } catch (err) {
    console.error(err);
    return err;
  }
};

module.exports = model("User", UserSchema);
