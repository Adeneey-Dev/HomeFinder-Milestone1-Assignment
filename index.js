const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./Models/userModel");

const cors = require("cors");
const routes = require("./Routes");

const dotenv = require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("mongodb connected....");
  app.listen(PORT, () => {
    console.log(`Server started running on port ${PORT}`);
  });
});

app.use(routes);
