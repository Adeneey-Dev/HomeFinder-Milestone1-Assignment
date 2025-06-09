const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./Models/userModel");

const cors = require("cors");
const routes = require("./Routes");

const dotenv = require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("mongodb connected....");
  app.listen(PORT, () => {
    console.log(`Server started running on port ${PORT}`);
  });
});

//THIS IS USE FOR TESTING OUR DEPLOYMENT URL IN THE BROWSER
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Real Estate Listing Platform",
  });
});

//app.use(routes);
app.use("/api", routes);
