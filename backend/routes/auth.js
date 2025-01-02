const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const JWT_SECRET = "scam1992@1234567890";
const fetchuser = require('../middleware/fetchuser');
//Route 1: create user using POST request "api/auth/createuser"

router.post(
    "/createuser",
    [
        body("name", "Enter a valid name").isLength({ min: 3 }),
        body("email", "Enter a valid email").isEmail(),
        body("password", "Password must be atleast 8 characters").isLength({ min:8 }),
        body("username", "Username must be atleast 5 characters").isLength({ min:5 }),
        body("dob","Enter a Date of birth").isISO8601().withMessage("Date of birth must be in format YYYY-MM-DD"),
        body("profession"),
        body("location"),
        body("phone")
    ],
    //in case of errorss
    async (req, res) => {
        let success = false;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }try {
            let user = await User.findOne({ 
                $or:[
                    {email: req.body.email}, 
                    {username: req.body.username}
                ]
            });
            if(user){
                return res
                .status(400)
                .json({ success, error:"A user with this username or email already exists"})
            }
            //generate salt and hash
            const salt = await bcrypt.genSalt(10);
            const secPassword = await bcrypt.hash(req.body.password, salt);

            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPassword,
                username: req.body.username,
                dob: req.body.dob,
                profession: req.body.profession || '',  
                location: req.body.location || '',      
                phone: req.body.phone || ''       
            })

            const data = {
                user: {
                    id: user.id
                }
            };

            const authToken = jwt.sign(data, JWT_SECRET);
            success = true,
            res.json({ success, authToken })
        } catch (error) {
            console.error(error.message);
            res.status(400).send("Internal Server error")
        }
    }
)

//Route 2: Authenticate a user using post /api/auth/login
router.post(
    "/login",
    [
        body("identifier","Enter email or username").notEmpty(),
        body("password","Password cannot be blank").exists()
    ],
    async(req, res)=>{
        let success = false;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array()});
        }
        const { identifier, password } = req.body;
        try {
            const user = await User.findOne({
                $or:[
                    {email: identifier},
                    {username: identifier}
                ]
            })
            if(!user){
                return res
                .status(400)
                .json({error:"Invalid credentials"})
            }
            const passwordCompare = await bcrypt.compare(password, user.password);
            if(!passwordCompare){
                return res
                .status(400)
                .json({error: "Invalid Credentials"})
            }
            const payload = {
                user:{
                    id: user.id
                }
            }
            const authToken = jwt.sign(payload, JWT_SECRET);
            success = true;
            res.json({success, authToken});
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server error")
        }
    }
)
//ROUTE 3 Endpoint: Get user details using post /api/auth/getuser
router.post(
    "/getuser",
    fetchuser,
    async(req, res)=>{
        try {
            const userID = req.user.id;
            const user = await User.findById(userID).select("-password");
            const friends = await Promise.all(user.friends.map(async (id) => {
                const friend = await User.findById(id).select("name");
                return friend;
            }))

            user.friends = friends;
            const friendsRequests = await Promise.all(user.friendRequests.map(async (id) => {
            const friendRequest = await User.findById(id).select("name");
            return friendRequest;
            }))

            user.friendRequests = friendsRequests
            res.json(user);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");

        }
    }
)
module.exports = router;