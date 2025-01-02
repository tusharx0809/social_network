const mongoose = require('mongoose');

const mongoUrl = "mongodb://localhost:27017/social_network"

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoUrl);
        console.log("Connect to EventPlanner MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to Social Network MongoDB", mongoUrl);
        process.exit(1);
    }
}

module.exports = connectToMongo;