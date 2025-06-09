// const { default: mongoose } = require("mongoose");
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, require: true },
  otp: { type: String, require: true },
  expiresAt: { type: Date, require: true },
});

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;
