const express = require("express");
const router = express.Router();
const Employee = require("../models/Employees");

/* =========================
   GET ALL EMPLOYEES
========================= */

router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find().sort({ name: 1 });
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

/* =========================
   ADD EMPLOYEE
========================= */

router.post("/", async (req, res) => {
  try {
    const { name, department } = req.body;

    const newEmployee = new Employee({
      name,
      department
    });

    const savedEmployee = await newEmployee.save();

    res.json({
      id: savedEmployee._id
    });

  } catch (err) {
    console.error(err);

    // handle duplicate name (unique constraint)
    if (err.code === 11000) {
      return res.status(400).json({
        error: "Employee already exists"
      });
    }

    res.status(500).json({ error: "Failed to add employee" });
  }
});

/* =========================
   DELETE EMPLOYEE
========================= */

router.delete("/:id", async (req, res) => {
  try {
    const result = await Employee.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        error: "Employee not found"
      });
    }

    res.json({ deleted: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

module.exports = router;