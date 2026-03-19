const mongoose = require("mongoose");

const AllocationSchema = new mongoose.Schema({

    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },

    task_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true
    },

    order_no: String,
    batch_no: String,

    serial_from: Number,
    serial_to: Number,

    /* 📌 PLANNED QUANTITY */
    quantity: Number,

    start_date: String,
    end_date: String,

    start_time: String,
    end_time: String,

    allocated_at: {
        type: Date,
        default: Date.now
    },

    /* =========================
       ✅ ACTUAL DONE (NEW)
    ========================= */

    actual_quantity: {
        type: Number,
        default: 0
    },

    remarks: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: ["pending", "partial", "completed"],
        default: "pending"
    },

    verified_by: {
        type: String // store username
    },

    verified_at: {
        type: Date
    }

});

module.exports = mongoose.model("Allocation", AllocationSchema);