const mongoose = require("mongoose");
const User = require("./models/Users");

mongoose.connect(
    "mongodb+srv://ashutosh:Fallguard@cluster0.fbgh0eu.mongodb.net/test?retryWrites=true&w=majority"
);

async function seed() {

    await User.deleteMany();

    await User.insertMany([
        { username: "Parameshwaran", password: "Parameshwaran@123", role: "admin" },
        { username: "Vinod", password: "Vinod@123", role: "manager" },
        { username: "Swati", password: "Swati@123", role: "verifier" }
    ]);

    console.log("Users seeded");
    process.exit();
}

seed();