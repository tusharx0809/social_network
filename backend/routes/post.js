const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const fetchuser = require('../middleware/fetchuser');
const User = require('../models/User');

//Route 1 POST a new post using: POST "api/posts/createpost". Login required
router.post('/createpost', fetchuser, async(req, res)=>{
    
    try {
        const { description } = req.body;
        const post = new Post({
            description, user: req.user.id
        });
        const savedPost = await post.save();
        res.json(savedPost);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//Route2 GET all posts using: GET "api/posts/fetchallposts". Login not required
router.get('/fetchallposts', async(req, res)=>{
    try {
        const posts = await Post.find().populate();
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//Route 3: get username of the user who posted the post
router.get('/getusername/:id', async(req, res)=>{
    try {
        const user = await User.findById(req.params.id).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


//ROUTE 4: DELETE a post using: DELETE "api/posts/deletepost". Login required
router.delete('/deletepost/:id', fetchuser, async(req, res)=>{
    try {
        const postID = req.params.id;
        if(!postID){
            return res.status(401).send("Not Found");
        }else{
            await Post.findByIdAndDelete(postID);
            res.json("Post Deleted Successfully");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    }
);


//ROUTE 5: UPDATE a post using: PUT "api/posts/updatepost". Login required
router.put('/updatepost/:id', fetchuser, async(req, res)=>{
    try {
        const { description } = req.body;
        const newPost = {description};
        const postID = req.params.id;
        let post = await Post.findById(postID);
        if(!post){
            return res.status(404).send("Not Found");
        }
        if(post.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }
        post = await Post.findByIdAndUpdate(postID, {$set: newPost}, {new: true});
        res.json("Post Updated Successfully");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    }
);
module.exports = router;