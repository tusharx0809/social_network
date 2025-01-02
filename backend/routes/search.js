const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/search", async (req, res) => {
  const { name } = req.query;
  if (!name)
    return res
      .status(400)
      .json({ message: "Name query parameter is required" });

  try {
    const users = await User.find({
      $or: [
        { name: new RegExp(name, "i") },
        { username: new RegExp(name, "i") },
      ],
    });

    if (users.length > 0) {
      return res.json(users);
    } else {
      return res.status(404).json({ message: "No user found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
