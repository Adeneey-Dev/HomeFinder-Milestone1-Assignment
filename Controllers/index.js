const SavedProperty = require("../Models/savedProperty");

const handleViewAllProperty = async (req, res) => {
  try {
    const properties = await Property.findProperties();

    if (!properties) {
      return res.status(404).json({
        message: "There is no listed property",
      });
    }

    res.status(200).json({
      message: "All properties listed below",
      properties,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleViewSpecificProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found!",
      });

      res.status(200).json(property);
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const handleSaveProperty = async (req, res) => {
  try {
    const exists = await SavedProperty.findOne({
      user: req.user.id,
      property: req.params.propertyId,
    });

    if (exists) {
      return res.status(400).json({
        message: "Property already saved",
      });
    }

    const saved = new SavedProperty({
      user: req.user.id,
      property: req.params.propertyId,
    });

    await saved.save();
    res.status(200).json({
      message: "Property saved",
      saved,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const handleUnsaveProperty = async (req, res) => {
  try {
    const removed = await SavedProperty.findOneAndDelete({
      user: req.user.id,
      property: req.params.propertyId,
    });

    if (!removed) {
      return res.status(404).json({
        message: "Saved Property Not Found",
      });
    }

    res.status(200).json({
      message: "Property Unsaved Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const handleGetAllSavedProperty = async (req, res) => {
  try {
    const savedProperties = await SavedProperty.find({
      user: req.user.id,
    }).populate("property");
    res.status(200).json({
      message: "Saved Property By User Listed Below",
      savedProperties,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  handleViewAllProperty,
  handleViewSpecificProperty,
  handleSaveProperty,
  handleUnsaveProperty,
  handleGetAllSavedProperty,
};
