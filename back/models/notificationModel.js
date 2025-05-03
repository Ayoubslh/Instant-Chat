const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
  },
  isRead: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['typeA', 'typeB'],
    required: [true, "a notification must have a type"]
  }
}, { timestamps: true })

module.exports = mongoose.model("Notification", notificationSchema);