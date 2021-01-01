const { model, Schema } = require("mongoose");

const opts = {
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
};

const TokenSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  opts
);

module.exports = model("Token", TokenSchema);
