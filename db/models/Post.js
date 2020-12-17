const { model, Schema } = require("mongoose");

const opts = {
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
};

const PostSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
    },
    flairs: {
      type: [String],
      default: [],
    },
    images: [String],
    body: {
      type: String,
      required: true,
      trim: true,
    },
  },
  opts
);

module.exports = model("Post", PostSchema);
