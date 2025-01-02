const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const fetchuser = require('../middleware/fetchuser');


//Route 1 POST a new comment using: POST "api/comments/add-comment". Login required
// Route 1: POST a new comment
router.post('/add-comment/:id', fetchuser, async (req, res) => {
    try {
        const { text } = req.body;  // Get the comment text from request body
        const postId = req.params.id;
        
        // Create the comment object with required fields
        const comment = {
            user: req.user.id,  // fetchuser middleware should add user to req
            text: text,
            date: Date.now()
        };

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send("Post Not Found");
        }

        post.comments.unshift(comment);
        await post.save();

        res.json({ success: true, message: "Comment Added Successfully" });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/add-like/:id', fetchuser, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send("Post Not Found");
        }

        // Check if the user has already liked the post
        if (post.likes.likedBy.includes(req.user.id)) {
            return res.status(400).send("You have already liked this post");
        }

        // Add user to likedBy array and increment the like count
        post.likes.likedBy.push(req.user.id);
        post.likes.count += 1;

        await post.save();

        res.json({ success: true, message: "Like Added Successfully" });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/remove-like/:id', fetchuser, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send("Post Not Found");
        }

        // Check if the user has not liked the post
        if (!post.likes.likedBy.includes(req.user.id)) {
            return res.status(400).send("You have not liked this post yet");
        }

        // Remove user from likedBy array and decrement the like count
        post.likes.likedBy = post.likes.likedBy.filter(userId => userId.toString() !== req.user.id.toString());
        post.likes.count -= 1;

        await post.save();

        res.json({ success: true, message: "Like Removed Successfully" });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


router.get('/get-likes/:id', fetchuser, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send("Post Not Found");
        }

        res.json({ likes: post.likes.count });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;
