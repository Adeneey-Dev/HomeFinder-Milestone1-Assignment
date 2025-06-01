const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Property = require("../Models/propertyModel");
const SavedProperty = require("../Models/savedProperty");
const User = require("../Models/userModel");

const dotenv = require("dotenv").config();

const handleSignUp = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please ass your email" });
    }

    if (!password) {
      return res.status(400).json({ message: "Please enter your password" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User account already exist" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be a minimum of 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    });

    await newUser.save();

    res.status(201).json({
      mesage: "User account created successful",
      newUser: { email, firstName, lastName, role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User account does not exist." });
  }
  const isMatch = await bcrypt.compare(password, user?.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Incorrect email or password." });
  }

  //GENERATING TOKEN
  const accessToken = jwt.sign(
    { id: user?._id, role: user?.role },
    process.env.ACCESS_TOKEN,
    { expiresIn: "50m" }
  );

  const refreshToken = jwt.sign(
    { id: user?._id, role: user?.role },
    process.env.REFRESH_TOKEN,
    { expiresIn: "30d" }
  );

  res.status(200).json({
    message: "Login successful.",
    accessToken,
    user: {
      email: user?.email,
      role: user?.role,
    },
    refreshToken,
  });
};

const handlePropertyListing = async (req, res) => {
  try {
    const { title, description, price, location, propertyType } = req.body;

    const property = new Property({
      title,
      description,
      price,
      location,
      propertyType,
      createdBy: req.user.id,
    });
    await property.save();

    res.status(200).json({
      message: "Property updated successfully by agent.",
      property,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const handleViewAllProperty = async (req, res) => {
  try {
    const properties = await Property.find();

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
    }
    res.status(200).json(property);
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

const handleFilterProperty = async (req, res) => {
  try {
    const { location, minPrice, maxPrice } = req.query;

    let filter = {};

    if (location) {
      filter.location = location;
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }

    const properties = await Property.find(filter);
    res.status(200).json({
      message: "Property Filter Below By Their Location and Price Range",
      properties,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  handleSignUp,
  handleLogin,
  handlePropertyListing,
  handleViewAllProperty,
  handleViewSpecificProperty,
  handleSaveProperty,
  handleUnsaveProperty,
  handleGetAllSavedProperty,
  handleFilterProperty,
};
