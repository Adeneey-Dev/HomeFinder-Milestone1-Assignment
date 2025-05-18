const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./Models/userModel");
const isAgent = require("./Middleware/isAgent ");
const Property = require("./Models/propertyModel");
const dotenv = require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("mongodb connected....");
  app.listen(PORT, () => {
    console.log(`Server started running on port ${PORT}`);
  });
});

app.post("/sign-up", async (req, res) => {
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
});

app.post("/login", async (req, res) => {
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
    { expiresIn: "5m" }
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
});

//ADD NEW PROPERTY LISTING (AGENT ONLY)
//POST PROPERTIES
app.post("/property-listing", isAgent, async (req, res) => {
  try {
    const { title, description, price, location, propertyType } = req.body;

    const property = new Property({
      title,
      description,
      price,
      location,
      propertyType,
    });
    await property.save();

    res.status(200).json({
      message: "Property updated successfully by agent.",
      property,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});
