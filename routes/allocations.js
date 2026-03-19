const express = require("express");
const router = express.Router();
const Allocation = require("../models/Allocation");

/* =========================
   GET ALL ALLOCATIONS
========================= */

router.get("/", async (req, res) => {
  try {
    const allocations = await Allocation.find()
      .populate("employee_id", "name department")
      .populate("task_id", "task_name")
      .sort({ allocated_at: -1 });

    const formatted = allocations.map(a => ({
      id: a._id,

      employee_id: a.employee_id?._id,
      task_id: a.task_id?._id,

      employee: a.employee_id?.name,
      department: a.employee_id?.department,
      task_name: a.task_id?.task_name,

      order_no: a.order_no,
      batch_no: a.batch_no,

      serial_from: a.serial_from,
      serial_to: a.serial_to,

      /* 📌 PLANNED */
      quantity: a.quantity,

      start_date: a.start_date,
      end_date: a.end_date,
      start_time: a.start_time,
      end_time: a.end_time,

      allocated_at: a.allocated_at,

      /* ✅ ACTUAL DONE (NEW) */
      actual_quantity: a.actual_quantity,
      remarks: a.remarks,
      status: a.status,
      verified_by: a.verified_by,
      verified_at: a.verified_at
    }));

    res.json(formatted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch allocations" });
  }
});

/* =========================
   CREATE ALLOCATION
========================= */

router.post("/", async (req, res) => {
  try {
    const {
      employee_id,
      task_id,
      order_no,
      batch_no,
      serial_from,
      serial_to,
      quantity,
      start_date,
      end_date,
      start_time,
      end_time
    } = req.body;

    /* ---------- Conflict Check ---------- */

    const conflict = await Allocation.findOne({
      employee_id,
      start_date,
      end_date,
      start_time,
      end_time
    });

    if (conflict) {
      return res.json({
        conflict: true,
        message: "Employee already allocated at same time"
      });
    }

    /* ---------- Insert ---------- */

    const newAllocation = new Allocation({
      employee_id,
      task_id,
      order_no,
      batch_no,
      serial_from: parseInt(serial_from),
      serial_to: parseInt(serial_to),
      quantity: parseInt(quantity),
      start_date,
      end_date,
      start_time,
      end_time
    });

    const saved = await newAllocation.save();

    res.json({
      message: "Job allocated successfully",
      id: saved._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create allocation" });
  }
});

/* =========================
   UPDATE ALLOCATION (MANAGER)
========================= */

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const allocation = await Allocation.findById(id);

    if (!allocation) {
      return res.status(404).json({
        error: "Allocation not found"
      });
    }

    /* 🔒 LOCK AFTER VERIFICATION */
    if (allocation.status === "completed") {
      return res.status(400).json({
        message: "Cannot edit after verification"
      });
    }

    const {
      employee_id,
      task_id,
      order_no,
      batch_no,
      serial_from,
      serial_to,
      quantity,
      start_date,
      end_date,
      start_time,
      end_time
    } = req.body;

    const updated = await Allocation.findByIdAndUpdate(
      id,
      {
        employee_id,
        task_id,
        order_no,
        batch_no,
        serial_from: parseInt(serial_from),
        serial_to: parseInt(serial_to),
        quantity: parseInt(quantity),
        start_date,
        end_date,
        start_time,
        end_time
      },
      { returnDocument: "after" }
    );

    res.json({
      message: "Allocation updated successfully",
      updatedId: updated._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to update allocation"
    });
  }
});

/* =========================
   VERIFY / ACTUAL DONE (VERIFIER)
========================= */

router.put("/verify/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { actual_quantity, remarks, status, username } = req.body;

    const allocation = await Allocation.findById(id);

    if (!allocation) {
      return res.status(404).json({
        message: "Allocation not found"
      });
    }

    /* ❌ Prevent re-verification */
    if (allocation.status === "completed") {
      return res.status(400).json({
        message: "Already verified"
      });
    }

    allocation.actual_quantity = parseInt(actual_quantity);
    allocation.remarks = remarks;
    allocation.status = status;
    allocation.verified_by = username;
    allocation.verified_at = new Date();

    await allocation.save();

    res.json({
      message: "Actual data saved successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to verify allocation"
    });
  }
});

/* =========================
   DELETE ALLOCATION
========================= */


router.delete("/:id", async (req, res) => {
  try {

    const allocation = await Allocation.findById(req.params.id);

    if (!allocation) {
      return res.status(404).json({
        message: "Allocation not found"
      });
    }

    /* 🔒 NEW RULE: BLOCK IF ACTUAL DATA EXISTS */
    if (allocation.actual_quantity && allocation.actual_quantity > 0) {
      return res.status(400).json({
        message: "Cannot delete allocation after actual work is entered"
      });
    }

    await Allocation.findByIdAndDelete(req.params.id);

    res.json({
      message: "Allocation deleted successfully"
    });

  } catch (error) {
    console.error("Delete allocation error:", error);
    res.status(500).json({
      error: "Failed to delete allocation"
    });
  }
});


/* =========================
   UPDATE ACTUAL
========================= */

router.put("/:id/actual", async (req, res) => {
  try {
    const actual_quantity = parseInt(req.body.actual_quantity) || 0;

    const allocation = await Allocation.findById(req.params.id);

    if (!allocation) {
      return res.status(404).json({ message: "Allocation not found" });
    }

    let status = "Pending";

    if (actual_quantity === 0) status = "Pending";
    else if (actual_quantity < allocation.quantity) status = "Partial";
    else if (actual_quantity === allocation.quantity) status = "Completed";
    else if (actual_quantity > allocation.quantity) status = "Over Completed";

    allocation.actual_quantity = actual_quantity;
    allocation.status = status;

    await allocation.save();

    res.json({
      message: "Actual + status updated",
      data: allocation
    });

  } catch (err) {
    console.error(err); // 👈 ADD THIS
    res.status(500).json({ error: "Failed to update actual" });
  }
});


module.exports = router;