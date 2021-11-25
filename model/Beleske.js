const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorResponse");

const BeleskeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter title"],
    trim: true,
    maxlength: [50, "Title must have less than 50 characters"],
  },
  content: {
    type: String,
    required: [true, "Please add description"],
    maxlength: [500, "Description must have less than 500 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  remindAt: {
    type: Date,
    required: [true, "Please enter date"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

BeleskeSchema.pre("validate", async function (next) {
  if (this.remindAt < this.createdAt) {
    next(new ErrorHandler("Date must be in the future", 400));
  } else {
    next();
  }
});

module.exports = mongoose.model("Beleske", BeleskeSchema);
