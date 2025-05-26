const mongoose = require("mongoose");

const savedPropertySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
  },
  { timestamps: true }
);

const SavedProperty = mongoose.model("SavedProperty", savedPropertySchema);

module.exports = SavedProperty;
