const mongoose = require("mongoose");

// Connect to MongoDB using the URL from the .env file.
// If the connection fails we stop the whole app, because nothing
// else can work without the database.
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
