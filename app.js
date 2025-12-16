require("dotenv").config(); // loads .env at startup
const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const insurence = require("./insurence/insurences");
const moneyview = require("./PartnerRoutes/moneyview/moneyview");
const fatakPay = require("./PartnerRoutes/fatakpay/fatakpay");
const zype = require("./PartnerRoutes/zype/zype");

const app = express();
const PORT = process.env.PORT || 5001;

  app.use(
    cors({
      origin: function (origin, callback) {
        const allowedOrigins = [
          "https://covermantra.com",
          "https://www.covermantra.com",
          "covermantra.com",
          "https://cbe-y7q8.onrender.com", // ✅ correct render URL
          "http://localhost:5000", // backend local
          "http://localhost:3001",
        ];
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          return callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/user", userRoutes);
// app.use("/api/ramfin", otherLender);
// app.use("/api/mpokket",mpokket);
// app.use("/api/zype",zype);
// app.use("/api/smartcoin",smartcoin);
// app.use("/api/moneyview",moneyview);
// app.use("/api/chintamoney",chintamoney);
// app.use("/api/lenden",lenden);
app.use("/api/insurence", insurence);
app.use("/api/moneyview", moneyview);
app.use("/api/fatakPay", fatakPay);
app.use("/api/zype", zype);

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
