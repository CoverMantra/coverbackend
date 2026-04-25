const express = require("express");
const { webusername, DeleteRequest } = require("../models/Users.js")
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many requests from this IP, please try again after 15 minutes" }
});
const axios = require("axios");
const { generateOTP } = require("../utils/otpstore");
const { generateToken } = require("../utils/jwtgenerate");
const lenderList = require("../lender/lenderList");
const Otp = require("../models/Otp");
const Contact = require("../models/Contact");

//update
require('dotenv').config();

function isValidPAN(pan) {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
}

function isValidMobileNumber(number) {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(number);
}

router.get("/", (req, res) => {
  res.send("hello alive");
});

router.post("/eligibility", (req, res) => {
  const { age, income, pincode } = req.body;

  if (!age || !income || !pincode) {
    return res.status(400).json({ message: "Age, income, and pincode are required" });
  }

  if (age <= 18) {
    return res.json({ eligible: false, message: "Age must be greater than 18" });
  }

  // Filter lenders from lenderList based on age, income, and pincode
  const eligibleLenders = lenderList.filter((lender) => {
    const ageMatch = age >= lender.age;
    const incomeMatch = income >= lender.minIncome;
    const pincodeMatch = lender.pincodes.includes("*") || lender.pincodes.includes(pincode);
    
    return ageMatch && incomeMatch && pincodeMatch;
  });

  if (eligibleLenders.length === 0) {
    return res.json({
      eligible: false,
      message: "No lenders available for your age, income, or pincode",
    });
  }

  res.json({
    eligible: true,
    message: "Eligible lenders found",
    lenders: eligibleLenders,
  });
});

router.post("/register", authLimiter, async (req, res) => {
  const {
    name,
    phone,
    pan,
    dob,
    email,
    city,
    state,
    gender,
    employment,
    income,
    pincode,
  } = req.body;

  if (
    !name ||
    !phone ||
    !pan ||
    !dob ||
    !email ||
    !city ||
    !state ||
    !gender ||
    !employment ||
    !income ||
    !pincode
  ) {
    return res.status(400).send("All fields are required");
  }

  if (!isValidMobileNumber(phone)) {
    return res.status(400).json({ message: "Mobile number not valid" })
  }

  if (!isValidPAN(pan)) {
    return res.status(400).json({ message: "Pan is not valid " })
  }

  try {
    const existingUser = await webusername.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).send("User with this email or phone already exists. Please sign in.");
    }
    const newUser = new webusername({
      name,
      phone,
      pan,
      dob,
      email,
      city,
      state,
      gender,
      employment,
      income,
      pincode,
    });
    await newUser.save();
    return res
      .status(201)
      .json({ message: "webusername registered successfully", user: newUser });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});
router.post("/send-otp", authLimiter, async (req, res) => {
  const phone = req.body.phone;

  if (!phone)
    return res.status(400).json({ message: "Phone number is required" });

  if (!isValidMobileNumber(phone)) {
    return res.status(400).json({ message: "Mobile number not valid" });
  }

  const otp = generateOTP();

  try {
    // Save OTP to database with expiry
    await Otp.findOneAndUpdate(
      { phone },
      {
        otp,
        expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
        createdAt: new Date()
      },
      { upsert: true, new: true }
    );

    console.log("Sending OTP to phone:", phone);

    const smsCloudUrl = `https://app.smscloud.in/pushapi/sendbulkmsg?username=KESHVACREDIT&dest=${phone}&apikey=7lbTOubf0YBuTFtuCPmMB1AIclEzjQk8&signature=CMTRA&msgtype=PM&msgtxt=Dear customer, ${otp} is your login OTP. Valid for 5 minutes. Please do not share with anyone. Regards, CoverMantra&templateid=1707175922948829561`;

    const response = await axios.get(smsCloudUrl);

    // You can check the response if needed
    console.log("SMSCloud Response:", response.data);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});


router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone and OTP are required" });
  }

  try {
    // Find OTP in database
    const storedOtpData = await Otp.findOne({ phone });

    if (!storedOtpData) {
      return res.status(400).json({ message: "No OTP sent to this number" });
    }

    // Check if OTP has expired
    if (new Date() > storedOtpData.expiresAt) {
      await Otp.deleteOne({ phone }); // Clean up expired OTP
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Check if OTP matches
    if (otp !== storedOtpData.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Delete OTP after successful verification
    await Otp.deleteOne({ phone });

    const token = generateToken({ phone });
    return res.json({ message: "OTP verified successfully", phone, token });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Server error during OTP verification" });
  }
});

router.post("/profile", authMiddleware, async (req, res) => {
  try {
    const phone = req.user.phone;


    if (!phone) {
      return res.status(400).json({
        status: 400,
        message: "Phone number is required.",
      });
    }

    const getUser = await webusername.findOne({ phone });

    // 4. Check if a user was found 
    if (!getUser) {
      return res.status(404).json({
        status: 404,
        message: "webusername not found.",
      });
    }

    // 5. Respond with the user data
    return res.status(200).json({
      status: 200,
      message: "webusername profile retrieved successfully.",
      user: getUser, // Key should be 'user' or 'data', not 'message'
    });
  } catch (error) {
    // 6. Handle any server/database errors
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      status: 500,
      message: "An internal server error occurred.",
      error: error.message,
    });
  }
});


router.post("/delete-profile", authMiddleware, async (req, res) => {
  try {
    const phone = req.user.phone;
    const { message, email } = req.body;

    if (!phone || !email || !message) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const deleteUser = await webusername.findOne({ phone });

    if (!deleteUser) {
      return res.status(404).json({ message: "webusername not found" });
    }

    const deleteRequest = new DeleteRequest({
      phone: deleteUser.phone,
      email: email,
      message: message,
    });

    await deleteRequest.save();

    await webusername.deleteOne({ phone });

    return res.status(200).json({
      message: "webusername deleted successfully and stored in DeleteRequest",
      deletedUser: deleteUser,
    });

  } catch (error) {
    console.error("Delete profile error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});



router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const phone = req.user.phone;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const allowedUpdates = ["name", "email", "city", "state", "gender", "employment", "income", "pincode", "dob", "pan"];
    const updateData = {};
    Object.keys(req.body).forEach(key => {
        if(allowedUpdates.includes(key)) {
            updateData[key] = req.body[key];
        }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    const updatedUser = await webusername.findOneAndUpdate(
      { phone: phone },
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "webusername not found " });
    }

    return res
      .status(200)
      .json({ message: "webusername update sucessfully", updatedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

router.post("/filter-lenders", authMiddleware, async (req, res) => {
  try {
    const phone = req.user.phone;

    if (!phone) {
      return res.status(400).json({
        status: 400,
        message: "Phone number is required."
      });
    }

    // Fetch user from DB
    const getUser = await webusername.findOne({ phone });

    if (!getUser) {
      return res.status(404).json({
        status: 404,
        message: "webusername not found."
      });
    }

    // Extract values from user record
    const dob = getUser.dob;
    const userIncome = Number(getUser.income);
    const pincode = getUser.pincode;

    if (!dob || !userIncome || !pincode) {
      return res.status(400).json({
        status: 400,
        message: "webusername must have DOB, Income & Pincode saved."
      });
    }

    // Calculate Age
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    const userAge = new Date(ageDiff).getUTCFullYear() - 1970;

    // Filter lenders
    const filtered = lenderList.filter((lender) => {
      const lenderAge = Number(lender.age);
      const pincodesArr = Array.isArray(lender.pincodes) ? lender.pincodes : [];

      return (
        userAge >= lenderAge &&
        userIncome >= lender.minIncome &&
        pincodesArr.includes(String(pincode))
      );
    });

    if (filtered.length === 0) {
      return res.status(200).json({
        eligible: false,
        yourAge: userAge,
        message: "No lenders available based on your criteria"
      });
    }

    const lendersInfo = filtered.map((l) => ({
      name: l.name,
      UTM: l.UTM,
      requiredMinAge: l.age,
      requiredMinIncome: l.minIncome
    }));

    return res.status(200).json({
      eligible: true,
      yourAge: userAge,
      total: lendersInfo.length,
      lenders: lendersInfo
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "An internal server error occurred.",
      error: error.message,
    });
  }
});



// router.post("/filter-lenders", (req, res) => {
//   const { age, pincode, income } = req.body;

//   if (!age || !pincode || !income) {
//     return res.status(400).json({ message: "Age, Pincode & Income are required" });
//   }

//   const userAge = Number(age);
//   const userIncome = Number(income);

//   if (isNaN(userAge) || isNaN(userIncome)) {
//     return res.status(400).json({ message: "Age and Income must be numbers" });
//   }

//   // Filter lenders based on lender age, minIncome, and pincode
//   const filtered = lenderList.filter((lender) => {
//     const lenderAge = Number(lender.age);
//     const pincodesArr = Array.isArray(lender.pincodes) ? lender.pincodes : [];

//     return (
//       userAge >= lenderAge &&           // user must be older or equal to lender age
//       userIncome >= lender.minIncome && // income check
//       pincodesArr.includes(String(pincode)) // pincode check
//     );
//   });

//   if (filtered.length === 0) {
//     return res.status(200).json({
//       eligible: false,
//       message: "No lenders available based on your criteria"
//     });
//   }

//   // Include lender name + age
//   const lendersInfo = filtered.map((l) => ({
//     name: l.name,
//     UTM: l.UTM
//   }));

//   return res.status(200).json({
//     eligible: true,
//     total: lendersInfo.length,
//     lenders: lendersInfo
//   });
// });




router.post("/contact-us", async (req, res) => {

  const { name, email, message, phone } = req.body;

  // Check mandatory fields
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Email & phone validation
  const emailRegex = /^\S+@\S+\.\S+$/;

  if (!isValidMobileNumber(phone)) {
    return res.status(400).json({ message: "Invalid phone number" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const newContact = new Contact({ name, email, message, phone });
    await newContact.save();

    res.status(200).json({ message: "Request received successfully" });
  } catch (err) {
    console.error("❌ Error saving contact:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



module.exports = router;
