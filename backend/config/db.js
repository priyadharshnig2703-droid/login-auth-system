
const mongoose = require("mongoose");
 // Function to connect MongoDB
async function connectDB() {
 try {
// Connect to MongoDB using the connection string
  await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB Connected Successfully");
} catch (error) {
// If connection fails, show the error
console.log("MongoDB Connection Failed:", error.message);
process.exit(1);
}
}
// Export the function
module.exports = connectDB;
