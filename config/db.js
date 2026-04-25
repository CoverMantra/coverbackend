const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log(`Mongo connected: ${conn.connection.host}`);
  } catch (e) {
    console.error("Database connection error:", e.message);
    process.exit(1);
  }
};

module.exports = connectDb;