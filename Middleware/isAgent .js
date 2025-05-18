const isAgent = (req, res, next) => {
  if (req.user.role !== "agent") {
    return res
      .status(400)
      .json({ message: "Access denied. Agent role required." });
  }
  next();
};

module.exports = isAgent;
