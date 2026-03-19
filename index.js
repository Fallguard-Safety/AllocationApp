
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

/* ✅ MIDDLEWARE FIRST */
app.use(cors({
  origin: "*"
}));
app.use(express.json());

/* ✅ ROUTES AFTER */
const authRoute = require("./routes/auth");
app.use("/", authRoute);

const usersRoute = require("./routes/users");
app.use("/users", usersRoute);
/* =============================
   MongoDB Connection
============================= */

mongoose.connect(
  "mongodb+srv://ashutosh:Fallguard@cluster0.fbgh0eu.mongodb.net/test?retryWrites=true&w=majority"
);

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  console.log("MongoDB connected");
});

/* =============================
   Routes
============================= */

const employeesRoute = require("./routes/employees");
const tasksRoute = require("./routes/tasks");
const allocationsRoute = require("./routes/allocations");
const reportsRoute = require("./routes/reports");

app.use("/employees", employeesRoute);
app.use("/tasks", tasksRoute);
app.use("/allocations", allocationsRoute);
app.use("/reports", reportsRoute);

/* =============================
   DB Status Check
============================= */

app.get("/db-status", (req, res) => {

  if (mongoose.connection.readyState === 1) {
    res.json({ status: "connected" });
  } else {
    res.status(500).json({ status: "disconnected" });
  }

});

/* =============================
   Start Server
============================= */

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});