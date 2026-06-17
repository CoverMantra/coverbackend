const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log(`Mongo connected: ${conn.connection.host}`);
  } catch (e) {
    console.error("Database connection error:", e.message);
    // Do not crash, allow server to run and serve API config/mock routes
  }
};

module.exports = connectDb;