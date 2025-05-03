const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    from: {
      type: String,
      required: true,
      trim: true,
    },
    to: {
      type: String,
      required: false,
      trim: true,
    },
    plainText: {
      type: String,
      required: false,
    },
    summary: {
      type: String,
      required: false,
    },
    category: {
      type: {
        type: String,
        required: false,
      },
      description: {
        type: String,
        required: false,
      },
    },
    priority: {
      level: {
        type: String,
        enum: ["low", "medium", "high"], // assuming levels are strings
        required: false,
      },
      justification: {
        type: String,
        required: false,
      },
    },
    actionItems: {
      type: [String],
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Email", emailSchema);
