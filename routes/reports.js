const express = require("express");
const router = express.Router();
const Allocation = require("../models/Allocation");

/* =========================
   ALLOCATION REPORT
========================= */

router.get("/allocations", async (req, res) => {
  try {
    const { date } = req.query;

    let filter = {};

    if (date) {
      filter.start_date = date;
    }

    const allocations = await Allocation.find(filter)
      .populate("employee_id", "name department")
      .populate("task_id", "task_name")
      .sort({ start_date: 1, start_time: 1 });

    const formatted = allocations.map(a => ({
      id: a._id,

      employee: a.employee_id?.name,
      department: a.employee_id?.department,

      task_name: a.task_id?.task_name,

      order_no: a.order_no,
      batch_no: a.batch_no,

      serial_from: a.serial_from,
      serial_to: a.serial_to,
      quantity: a.quantity,

      start_date: a.start_date,
      end_date: a.end_date,
      start_time: a.start_time,
      end_time: a.end_time,

      // ✅ ADD THESE
      actual_quantity: a.actual_quantity,
      status: a.status
    }));

    res.json(formatted);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to generate report"
    });
  }
});

module.exports = router;