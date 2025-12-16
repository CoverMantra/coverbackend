const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongo connected");
  } catch (e) {
    console.log("Failed to connect with database", e);
    process.exit(1);
  }
};

module.exports = connectDb;
