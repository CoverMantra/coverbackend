const express = require("express");
const router = express.Router();
const adapters = require("../adapters");
const LenderResponse = require("../models/LenderResponse");
const { webusername } = require("../models/Users");

const submissionLocks = new Map();
const LOCK_TIMEOUT_MS = 15000; // 15 seconds lock

// @route   GET /api/partners/:lenderId/form-config
// @desc    Get form configuration for a specific lender
// @access  Public
router.get("/:lenderId/form-config", (req, res) => {
  const { lenderId } = req.params;
  const adapterKey = Object.keys(adapters).find(k => k.toLowerCase() === lenderId.toLowerCase());
  const adapter = adapters[adapterKey];

  if (!adapter) {
    return res.status(404).json({ message: `Lender adapter not found for ID: ${lenderId}` });
  }

  try {
    const config = adapter.getFormConfig();
    res.json(config);
  } catch (error) {
    console.error(`Error fetching form config for ${lenderId}:`, error);
    res.status(500).json({ message: "Server Error fetching form configuration" });
  }
});

// @route   POST /api/partners/:lenderId/register
// @desc    Register a lead with a specific lender and save standardized log
// @access  Public
router.post("/:lenderId/register", async (req, res) => {
  const { lenderId } = req.params;
  const adapterKey = Object.keys(adapters).find(k => k.toLowerCase() === lenderId.toLowerCase());
  const adapter = adapters[adapterKey];

  if (!adapter) {
    return res.status(404).json({ message: `Lender adapter not found for ID: ${lenderId}` });
  }

  // Deduplication check
  const mobile = req.body.phone || req.body.mobile;
  if (mobile) {
    const lockKey = `${mobile}_${lenderId.toLowerCase()}`;
    const now = Date.now();
    const lastSubmission = submissionLocks.get(lockKey);

    if (lastSubmission && (now - lastSubmission) < LOCK_TIMEOUT_MS) {
      return res.status(429).json({
        success: false,
        message: "Duplicate submission. Please wait a few seconds before trying again."
      });
    }
    submissionLocks.set(lockKey, now);
  }

  try {
    // 1. Submit lead to adapter
    const result = await adapter.register(req.body);

    // 2. Perform centralized DB logging
    const mobile = req.body.phone || req.body.mobile;
    const name = req.body.name || `${req.body.first_name || ""} ${req.body.last_name || ""}`.trim();

    if (mobile) {
      try {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const createdDate = `${dd}/${mm}/${yyyy}`;

        const lenderName = adapter.getFormConfig().title;

        // Save to LenderResponse collection
        await LenderResponse.findOneAndUpdate(
          { mobile: String(mobile) },
          {
            $setOnInsert: { name: name },
            $push: {
              responses: {
                lenderName: lenderName,
                apiResponse: result.apiResponse,
                createdDate: createdDate
              }
            }
          },
          { upsert: true, new: true }
        );

        // Push response log to Main Webuser collection
        await webusername.findOneAndUpdate(
          { phone: String(mobile) },
          {
            $push: {
              lenderResponses: {
                lenderName: lenderName,
                apiResponse: result.apiResponse,
                createdDate: createdDate
              }
            }
          }
        );
      } catch (dbErr) {
        console.error("❌ DB logging failed in dynamic router:", dbErr.message);
      }
    }

    // 3. Return standardized result
    res.status(200).json({
      success: result.success,
      redirectUrl: result.redirectUrl,
      offer: result.offer,
      totalresponse: result.apiResponse
    });

  } catch (error) {
    console.error(`Error processing lead for ${lenderId}:`, error.message);
    res.status(500).json({
      success: false,
      message: "Lead registration failed",
      error: error.message
    });
  }
});

module.exports = router;
