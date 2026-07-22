const express = require("express");
const router = express.Router();
const combinedAdminAuth = require("../middlewares/adminAuthMiddleware");
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/lenders.json');

// Helper to read JSON
const readLenders = () => {
  try {
    if (!fs.existsSync(dataFilePath)) return [];
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading lenders file:", err);
    return [];
  }
};

// Helper to write JSON
const writeLenders = (lenders) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(lenders, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing lenders file:", err);
  }
};

// =======================
// PUBLIC ROUTES
// =======================

// @route   GET /api/lenders
// @desc    Get all lenders sorted by priority (optional filtering by loanType / category)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const rawLenders = readLenders();
    // Filter out inactive lenders
    const lenders = rawLenders.filter(l => l.isActive !== false);
    
    lenders.sort((a, b) => a.priority - b.priority);
    
    const filterVal = req.query.loanType || req.query.category;
    if (filterVal) {
      const filtered = lenders.filter(l => 
        l.loanTypes && 
        Array.isArray(l.loanTypes) && 
        l.loanTypes.some(type => type.toLowerCase() === filterVal.toLowerCase())
      );
      return res.json(filtered);
    }
    
    res.json(lenders);
  } catch (error) {
    console.error("Error fetching lenders:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// =======================
// ADMIN ROUTES
// =======================



// @route   PUT /api/lenders/reorder
// @desc    Reorder lenders priority
// @access  Admin
router.put("/reorder", combinedAdminAuth, async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!orderedIds || !Array.isArray(orderedIds)) {
      return res.status(400).json({ message: "Invalid data format." });
    }

    const lenders = readLenders();
    
    const updatedLenders = lenders.map(lender => {
      const index = orderedIds.indexOf(lender._id);
      if (index !== -1) {
        lender.priority = index + 1; // 1-based priority
      }
      return lender;
    });

    updatedLenders.sort((a, b) => a.priority - b.priority);
    writeLenders(updatedLenders);

    res.json({ message: "Lenders reordered successfully", lenders: updatedLenders });
  } catch (error) {
    console.error("Error reordering lenders:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/lenders
// @desc    Add a new lender
// @access  Admin
router.post("/", combinedAdminAuth, async (req, res) => {
  try {
    const { name, logo, age, minIncome, pincodes, UTM } = req.body;
    const lenders = readLenders();
    
    let maxPriority = 0;
    lenders.forEach(l => {
      if (l.priority > maxPriority) maxPriority = l.priority;
    });
    
    const newLender = {
      _id: "l" + Date.now().toString(),
      name, logo, age, minIncome, pincodes, UTM, 
      priority: maxPriority + 1
    };

    lenders.push(newLender);
    writeLenders(lenders);
    
    res.status(201).json(newLender);
  } catch (error) {
    console.error("Error creating lender:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/lenders/:id
// @desc    Update a lender
// @access  Admin
router.put("/:id", combinedAdminAuth, async (req, res) => {
  try {
    const lenders = readLenders();
    const index = lenders.findIndex(l => l._id === req.params.id);
    
    if (index !== -1) {
      lenders[index] = { ...lenders[index], ...req.body };
      writeLenders(lenders);
      res.json(lenders[index]);
    } else {
      res.status(404).json({ message: "Lender not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   DELETE /api/lenders/:id
// @desc    Delete a lender
// @access  Admin
router.delete("/:id", combinedAdminAuth, async (req, res) => {
  try {
    let lenders = readLenders();
    lenders = lenders.filter(l => l._id !== req.params.id);
    writeLenders(lenders);
    res.json({ message: "Lender deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
