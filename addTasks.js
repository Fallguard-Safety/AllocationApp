const mongoose = require("mongoose");
const Task = require("./models/Task");

/* =============================
   MongoDB Connection
============================= */

mongoose.connect(
    "mongodb+srv://ashutosh:Fallguard@cluster0.fbgh0eu.mongodb.net/test?retryWrites=true&w=majority"
);

mongoose.connection.once("open", async () => {
    console.log("MongoDB connected for task seeding...");

    const tasks = [
        "Rope Cutting",
        "Rope Splicing",
        "Rope Stitching",
        "Lanyard Sleeve heating & Assembly",
        "EA 300 cutting",
        "EA 300 Loop Sleeve cutting",
        "EA 300 loop Sleeve Assembly",
        "EA 300 Stitching",
        "EA 300 fusion",
        "EA 300 Folding",
        "EA 300 Heating",
        "Webbing Lanyard cutting",
        "Webbing lanyard stitching",
        "Webbing lanyard label stitching",
        "Webbing lanyard fusion",
        "Webbing sleeve lanyard assembly",
        "Webbing lanyard packing",
        "Harness Shoulder cutting",
        "Harness Leg cutting",
        "Bag cutting",
        "Harness Kachhua cutting",
        "Harness Waist belt cutting",
        "Harness Chest strap cutting",
        "ID plate assembly",
        "Leg assembly",
        "Chest strap assembly",
        "Shulder Stitching",
        "Shoulder & leg stitching",
        "Chest Strap Stitching",
        "Leg stitching",
        "Thigh pad cutting",
        "sholder pad cutting",
        "01 pad cutting (waist pad)",
        "02 pad cutting",
        "Bag assembly",
        "Bag printing",
        "Cotton printing",
        "Harness packing",
        "Harness with lanyard packing",
        "Tool lanyard cutting",
        "Tool lanyard stitchinh",
        "tool lanyard packing",
        "tool lanyard assembly",
        "STS webbing cutting",
        "STS pouch stitching",
        "STS hook stitching",
        "STS loop stitching",
        "STS fusion",
        "STS packing",
        "Harness QC",
        "Lanyard QC",
        "STS QC",
        "Harness with Lanyard QC",
        "Metal visual inspection",
        "Harness fusion",
        "Webbing Rolling",
        "Webbing callendering",
        "Webbing Roll Packing",
        "Box packing",
        "Box Wrapping",
        "Box Stappling",
        "Ratchet lassing assembly",
        "ratchet lashing packing",
        "Lashing cutting",
        "Lashing Stitching"
    ];

    try {
        console.log("Starting task insert...");

        for (const task of tasks) {
            const exists = await Task.findOne({ task_name: task });

            if (!exists) {
                await Task.create({ task_name: task });
                console.log("Inserted:", task);
            } else {
                console.log("Skipped (already exists):", task);
            }
        }

        console.log("All tasks inserted successfully ✅");
        process.exit();

    } catch (error) {
        console.error("Task insertion failed:", error);
        process.exit(1);
    }
});