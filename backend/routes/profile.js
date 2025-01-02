const express = require("express");
const router = express.Router();
const User = require("../models/User");
const fetchuser = require("../middleware/fetchuser");

router.get("/profile-search/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password -friendRequests");
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.put("/adduserinfo", fetchuser, async (req, res) => {
  try {
    const { profession, location, phone } = req.body;
    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profession, location, phone },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "User Not found." });

    res.json({ success: true});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
