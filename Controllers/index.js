const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Property = require("../Models/propertyModel");
const SavedProperty = require("../Models/savedProperty");
const User = require("../Models/userModel");
const sendEmail = require("../Services/sendMail");
const Otp = require("../Models/otpModel");
const sendOtp = require("../Services/sendOtp");
const validateEmail = require("../Utils/validateEmail");

const dotenv = require("dotenv").config();

const handleSignUp = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please enter your email" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
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

  //GENERATING TOKEN, AN ACCESS TOKEN AND A REFRESH TOKEN
  const accessToken = jwt.sign(
    { id: user?._id, role: user?.role },
    process.env.ACCESS_TOKEN,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user?._id, role: user?.role },
    process.env.REFRESH_TOKEN,
    { expiresIn: "7d" }
  );

  //SETTING THE REFRESH TOKEN AS COOKIE
  res.cookie("refreshtoken", refreshToken, {
    httpOnly: true,
    path: "/api/refreshToken",
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
  });

  res.status(200).json({
    message: "Login successful.",
    accessToken,
    user: {
      email: user?.email,
      role: user?.role,
    },
  });
};

const handleGetAccessToken = async (req, res) => {
  //THIS FUNCTION HANDLE REGENERATING AN ACCESS TOKEN FROM THE REFRESH TOKEN STORE IN COOKIE WHEN THE ACCESS TOKEN EXPIRED

  try {
    const rf_token = req.cookies.refreshtoken;
    if (!rf_token)
      return res.status(401).json({ message: "Please login now!" });

    jwt.verify(rf_token, process.env.REFRESH_TOKEN, async (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Invalid refresh token" });

      //Looking up user in DB
      const user = await User.findById(decoded.id);
      if (!user)
        return res.status(404).json({ message: "User account does not exist" });

      const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.ACCESS_TOKEN,
        { expiresIn: "5m" }
      );

      return res.status(200).json({ accessToken });
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const handleForgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "Incoreect Email",
    });
  }

  const accessToken = await jwt.sign({ user }, `${process.env.ACCESS_TOKEN}`, {
    expiresIn: "5m",
  });

  await sendEmail(email, accessToken);

  res.status(200).json({ message: "Please check your email" });
};

const handleResetPassword = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User account not found" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  user.password = hashedPassword;

  await user.save();

  res.status(200).json({
    message: "Password reset successfully",
  });
};

const handleSendOtp = async (req, res) => {
  console.log("send otp");
  const { email } = req.body;

  //GENERATING 6-DIGIT OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  //EXPIRES IN 5 MINS FROM NOW
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  try {
    //DELETING AN EXISTING OTP FOR THIS EMAIL
    await Otp.deleteMany({ email });

    //SAVING THE NEW OTP GENERATED IN MY OtpModel DATABASE
    await Otp.create({ email, otp, expiresAt });

    //SENDING OTP TO USER VIA EMAIL
    await sendOtp(email, otp);

    res.status(200).json({
      message: "OTP sent to Email",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

const handleVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email });

    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (record.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > record.expireAt) {
      return res.status(400).json({ message: "OTP expired" });
    }

    res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
  handleGetAccessToken,
  handleForgotPassword,
  handleResetPassword,
  handleSendOtp,
  handleVerifyOtp,
  handlePropertyListing,
  handleViewAllProperty,
  handleViewSpecificProperty,
  handleSaveProperty,
  handleUnsaveProperty,
  handleGetAllSavedProperty,
  handleFilterProperty,
};
