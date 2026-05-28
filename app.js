require("dotenv").config(); // loads .env at startup
const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const insurence = require("./insurence/insurences");
const moneyview = require("./PartnerRoutes/moneyview/moneyview");
const fatakPay = require("./PartnerRoutes/fatakpay/fatakpay");
const zype = require("./PartnerRoutes/zype/zype");
const vivifiRoutes = require("./PartnerRoutes/vivifi/vivifi");
const { webusername } = require("./models/Users");
const LenderResponse = require("./models/LenderResponse");
const app = express();
const PORT = process.env.PORT || 5001;

// Safety guard: user profiles and lender responses must never share a collection.
if (webusername.collection.name === LenderResponse.collection.name) {
  throw new Error(
    `Invalid DB model mapping: both models point to "${webusername.collection.name}". ` +
      `Use separate collections for user profiles and lender responses.`
  );
}

  app.use(
    cors({
      origin: function (origin, callback) {
        const allowedOrigins = [
          "https://covermantra.com",
          "https://www.covermantra.com",
          "covermantra.com",
          "http://localhost:3000",
          "http://localhost:3001",
          "http://localhost:5000", 
          "http://localhost:5001", // backend local
        ];
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          return callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization", "x-admin-secret"],
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
app.use("/api/vivifi", vivifiRoutes);
const lenderRoutes = require("./routes/lenderRoutes");
app.use("/api/lenders", lenderRoutes);
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// Trigger nodemon restart for .env changes (re-trigger 2)
