const mongoose = require("mongoose");
const dns = require("dns");

const connectDb = async () => {
  try {
    // If using a MongoDB Atlas connection string (mongodb+srv://), set DNS servers to Google DNS
    // to bypass local ISP DNS resolution failures for SRV records.
    if (process.env.MONGO_URL && process.env.MONGO_URL.startsWith("mongodb+srv://")) {
      try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
      } catch (dnsErr) {
        console.warn("Unable to set DNS servers:", dnsErr.message);
      }
    }

    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log(`Mongo connected: ${conn.connection.host}`);
  } catch (e) {
    console.error("Database connection error:", e.message);
    // Do not crash, allow server to run and serve API config/mock routes
  }
};

module.exports = connectDb;