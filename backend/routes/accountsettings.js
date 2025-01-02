const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const fetchuser = require("../middleware/fetchuser");
const Post = require("../models/Post");

router.put("/reset-password", fetchuser, async (req, res) => {
  try {
    const userID = req.user.id;

    // Fetch the user and include the password field
    const user = await User.findById(userID).select("+password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { currentPassword, password: newPassword } = req.body;

    // Check if current password is provided and matches
    if (!currentPassword) {
      return res.status(400).json({ error: "Current password is required" });
    }

    const passwordCompare = await bcrypt.compare(currentPassword, user.password);
    if (!passwordCompare) {
      return res
        .status(400)
        .json({ message: "Current password must be correct to renew password!" });
    }

    // Validate new password
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        error: "New password must be at least 8 characters long",
      });
    }

    // Hash the new password and update
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been successfully reset",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.delete("/delete-account", fetchuser, async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    await User.findByIdAndDelete(req.user.id);

    await Post.deleteMany({ user: req.user.id });

    await User.updateMany(
      { friends: req.user.id },
      { $pull: { friends: req.user.id } }
    );

    await Post.updateMany(
      { "likes.likedBy": req.user.id },
      {
        $pull: { "likes.likedBy": req.user.id },
        $inc: { "likes.count": -1 },
      }
    );

    await Post.updateMany(
      { "comments.user": req.user.id },
      { $pull: { comments: { user: req.user.id } } }
    );
    return res.status(200).json({ success: true, message: "Account Deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
