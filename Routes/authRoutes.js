const express = require("express");
const authorization = require("../Middleware/authorization");
const isAgent = require("../Middleware/isAgent ");
const {
  handleSaveProperty,
  handleUnsaveProperty,
  handleGetAllSavedProperty,
  handleViewAllProperty,
  handleViewSpecificProperty,
  handleFilterProperty,
  handleSignUp,
  handleLogin,
  handlePropertyListing,
  handleForgotPassword,
  handleResetPassword,
  handleSendOtp,
  handleVerifyOtp,
  handleGetAccessToken,
} = require("../Controllers");

const routes = require(".");

const router = express.Router();

router.post("/sign-up", handleSignUp);

router.post("/login", handleLogin);

router.get("/refreshToken", handleGetAccessToken);

router.post("/forgot-password", handleForgotPassword);

router.patch("/reset-password", handleResetPassword);

router.post("/send-otp", handleSendOtp);

router.post("/verify-otp", handleVerifyOtp);

//ADD NEW PROPERTY LISTING (AGENT ONLY)
//POST PROPERTIES
router.post("/property-listing", authorization, isAgent, handlePropertyListing);

//USER CAN VIEW ALL LISTING OR A SPECIFIC ONE

//user viewing all properties
router.get("/view-all-properties", authorization, handleViewAllProperty);

//user viewing a specific property by ID
router.get("/view-property/:id", authorization, handleViewSpecificProperty);

//USERS CAN SAVE AND UNSAVE PROPERTY
//User Saving Property
router.post("/save-property/:propertyId", authorization, handleSaveProperty);

//User Unsaving Property
router.delete(
  "/unsave-property/:propertyId",
  authorization,
  handleUnsaveProperty
);

//GETTING ALL SAVED PROPERTY FOR THE LOGIN USER
router.get(
  "/view-all-saved-property",
  authorization,
  handleGetAllSavedProperty
);

//GETTING PROPERTY FILTERS BY LOCATION, MINIMUM $ MAXIMUM PRICE
router.get("/view-filter-property", authorization, handleFilterProperty);

module.exports = router;
