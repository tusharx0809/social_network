const express = require("express");
const router = express.Router();
const User = require("../models/User");

//send request
router.post("/send-request/:id", async (req, res) => {
  try {
    const senderID = req.body.id; //id of sender
    const receiverID = req.params.id; //object id of receiver

    const receiver = await User.findById(receiverID);
    if (!receiver) return res.status(404).json({ message: "User not found" });

    //avoid duplicate request
    if (receiver.friendRequests.includes(senderID)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    if (receiver.friends.some((friend) => friend._id.toString() === senderID)) {
      return res.status(400).json({ message: "Already friends" });
    }

    receiver.friendRequests.push(senderID);
    await receiver.save();
    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accept a friend request
router.post("/accept-request/:id", async (req, res) => {
  try {
    const userId = req.body.id; // ID of the user accepting the request
    const senderId = req.params.id; // ID of the user who sent the request

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.friendRequests.includes(senderId))
      return res.status(400).json({ message: "No such friend request" });

    // Remove from friendRequests
    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== senderId
    );
    user.friends.push(senderId);

    // Add to sender's friend list
    const sender = await User.findById(senderId);
    sender.friends.push(userId);

    await user.save();
    await sender.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/remove-friend/:id", async (req, res) => {
  try {
    const userId = req.body.id;
    const removeFriendId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.friends.includes(removeFriendId))
      return res.status(400).json({ message: "No such friend exists" });

    const removedFriend = await User.findById(removeFriendId);
    removedFriend.friends = removedFriend.friends.filter(
      (friendID) => friendID.toString() !== userId
    );

    user.friends = user.friends.filter(
      (friendID) => friendID.toString() !== removeFriendId
    );

    await removedFriend.save();
    await user.save();

    res.status(200).json({ message: "Friend Removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/reject-request/:id", async (req, res) => {
  try {
    const userId = req.body.id;
    const rejectFriendId = req.params.id;
    console.log(userId, rejectFriendId);
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.friendRequests.includes(rejectFriendId))
      return res.status(400).json({ message: "No such friend request" });

    user.friendRequests = user.friendRequests.filter(
      (friendID) => friendID.toString() !== rejectFriendId
    );
    await user.save();
    res.status(200).json({ message: "Friend Request Rejected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});
module.exports = router;
