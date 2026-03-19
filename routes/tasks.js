const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

/* =========================
   GET ALL TASKS
========================= */

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ task_name: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

/* =========================
   ADD TASK
========================= */

router.post("/", async (req, res) => {
  try {
    const { task_name } = req.body;

    const newTask = new Task({ task_name });

    const savedTask = await newTask.save();

    res.json({
      id: savedTask._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add task" });
  }
});

/* =========================
   DELETE TASK
========================= */

router.delete("/:id", async (req, res) => {
  try {
    const result = await Task.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    res.json({ deleted: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;