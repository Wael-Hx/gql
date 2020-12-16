const { model, Schema } = require("mongoose");

const opts = {
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
};

const ProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bio: String,
    avatar: {
      type: String,
      default: "",
    },
    posts: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    saved: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    liked: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  opts
);

module.exports = model("Profile", ProfileSchema);
