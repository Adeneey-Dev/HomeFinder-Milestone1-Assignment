const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    Image: { type: String, default: "" },
    description: { type: String, default: "" },
    price: { type: Number, require: true },
    location: { type: String, require: true },
    propertyType: {
      type: String,
      enum: ["house", "apartment", "condo", "office", "land"],
      require: true,
    },
    listedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  { timestamps: true }
);
const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
