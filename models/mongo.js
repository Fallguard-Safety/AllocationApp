const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://ashutosh:Fallguard@cluster0.fbgh0eu.mongodb.net/test?retryWrites=true&w=majority"
);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error"));

db.once("open", () => {
    console.log("MongoDB Connected");
});

module.exports = mongoose;