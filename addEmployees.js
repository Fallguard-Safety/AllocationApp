const mongoose = require("mongoose");
const Employee = require("./models/Employees");

/* =============================
   MongoDB Connection
============================= */

mongoose.connect(
  "mongodb+srv://ashutosh:Fallguard@cluster0.fbgh0eu.mongodb.net/test?retryWrites=true&w=majority"
);
mongoose.connection.once("open", async () => {
  console.log("MongoDB connected for seeding...");

  const employees = [
    { name: "Vinod Srivastava", department: "Production" },
    { name: "Aarti", department: "Production" },
    { name: "Kalpesh Pal", department: "Production" },
    { name: "Kapil", department: "Production" },
    { name: "Mamta Singh", department: "Production" },
    { name: "Maya Yadav", department: "Production" },
    { name: "Pammi Shukla", department: "Production" },
    { name: "Priyanka Pandey", department: "Production" },
    { name: "Priyanshu Pandey", department: "Production" },
    { name: "Raj Kumar Sahu", department: "Production" },
    { name: "Rita Rajput", department: "Production" },
    { name: "Rohit Yadav", department: "Production" },
    { name: "Rupak", department: "Production" },
    { name: "Santosh", department: "Production" },
    { name: "Shivam Kumar", department: "Production" },
    { name: "Shivkesh", department: "Production" },
    { name: "Shri Krishna", department: "Production" },
    { name: "Subhash Rajput", department: "Production" },
    { name: "Sujeet", department: "Production" },
    { name: "Usha Pal", department: "Production" },
    { name: "Vijayalakshmi", department: "Production" },
    { name: "Vikram", department: "Production" },
    { name: "Vikrant Mishra", department: "Production" },
    { name: "Vinod Rajput", department: "Production" },
    { name: "Vish Jeet", department: "Production" },
    { name: "Anil Kumar", department: "Production" },
    { name: "Nikhil Anand", department: "Quality Control" },
    { name: "Vinod Kumar Srivastava", department: "Store" },
    { name: "Anoop Verma", department: "Store" },
    { name: "Ashok Kumar Pandey", department: "Store" },
    { name: "Siyaram", department: "Store" },
    { name: "Amit Kumar Saini", department: "Store" },
    { name: "Sanjay Vajpayee", department: "Loom" },
    { name: "Manoj Yadav", department: "Loom" },
    { name: "Rohit Srivastava", department: "Loom" },
    { name: "Amita Devi", department: "Packing" },
    { name: "Pravesh", department: "Packing" },
    { name: "Ashutosh Shukla", department: "Business Development" },
    { name: "Dipali Verma", department: "Business Development" },
    { name: "Swati", department: "Admin" },
    { name: "Kamlesh Devi", department: "Admin" },
    { name: "Kuldeep Kumar", department: "Admin" },
    { name: "Babita", department: "Admin" },
    { name: "Rahul Kumar Gaur", department: "Admin" }
  ];

  try {
    console.log("Starting employee insert...");

    for (const emp of employees) {
      const exists = await Employee.findOne({ name: emp.name });

      if (!exists) {
        await Employee.create(emp);
        console.log(`Inserted: ${emp.name}`);
      } else {
        console.log(`Skipped (already exists): ${emp.name}`);
      }
    }

    console.log("Employee import completed successfully ✅");
    process.exit();

  } catch (error) {
    console.error("Error inserting employees:", error);
    process.exit(1);
  }
});