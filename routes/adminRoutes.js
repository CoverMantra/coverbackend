const express = require("express");
const router = express.Router();
const { User, DeleteRequest } = require("../models/Users");
const combinedAdminAuth = require("../middlewares/adminAuthMiddleware");

// @route   GET /api/admin/leads
// @desc    Get all leads (users) with pagination, search, and filtering
// @access  Admin
router.get("/leads", combinedAdminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const status = req.query.status || "";
    const lender = req.query.lender || "";

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { pan: { $regex: search, $options: "i" } }
      ];
    }

    if (status && status !== "all") {
      query.loanStatus = status.toLowerCase();
    }

    if (lender && lender !== "all") {
      query["lenderResponses.lenderName"] = { $regex: lender, $options: "i" };
    }

    const totalLeads = await User.countDocuments(query);
    const leads = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      total: totalLeads,
      page,
      pages: Math.ceil(totalLeads / limit),
      leads
    });
  } catch (error) {
    console.error("Error fetching admin leads:", error);
    res.status(500).json({ success: false, message: "Server Error fetching leads" });
  }
});

// @route   GET /api/admin/deletions
// @desc    Get all account deletion requests
// @access  Admin
router.get("/deletions", combinedAdminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || "pending"; // default to pending

    const query = {};
    if (status && status !== "all") {
      query.status = status.toLowerCase();
    }

    const totalRequests = await DeleteRequest.countDocuments(query);
    const requests = await DeleteRequest.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      total: totalRequests,
      page,
      pages: Math.ceil(totalRequests / limit),
      requests
    });
  } catch (error) {
    console.error("Error fetching deletion requests:", error);
    res.status(500).json({ success: false, message: "Server Error fetching deletion requests" });
  }
});

// @route   POST /api/admin/deletions/:id/action
// @desc    Approve or reject an account deletion request
// @access  Admin
router.post("/deletions/:id/action", combinedAdminAuth, async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'approve' or 'reject'

  if (!["approve", "reject"].includes(action)) {
    return res.status(400).json({ success: false, message: "Invalid action. Must be 'approve' or 'reject'." });
  }

  try {
    const request = await DeleteRequest.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Deletion request not found." });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ success: false, message: `Request is already ${request.status}.` });
    }

    if (action === "approve") {
      // 1. Delete matching user by phone or email
      const phoneDigits = request.phone.replace(/\D/g, "").slice(-10);
      const userDeleteResult = await User.deleteOne({
        $or: [
          { phone: new RegExp(phoneDigits + "$") },
          { email: request.email }
        ]
      });

      console.log(`[Admin Account Delete] Result of deleting user ${request.phone}:`, userDeleteResult);

      // 2. Mark request as approved
      request.status = "approved";
      await request.save();

      return res.json({
        success: true,
        message: `Account deletion request approved. User matching phone ${request.phone} or email ${request.email} has been deleted.`,
        request
      });
    } else {
      // Reject request
      request.status = "rejected";
      await request.save();

      return res.json({
        success: true,
        message: "Account deletion request rejected successfully.",
        request
      });
    }
  } catch (error) {
    console.error("Error processing account deletion action:", error);
    res.status(500).json({ success: false, message: "Server error processing action", error: error.message });
  }
});

// @route   GET /api/admin/stats
// @desc    Get aggregate statistics of leads (today, monthly, source breakdown)
// @access  Admin
router.get("/stats", combinedAdminAuth, async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalLeads = await User.countDocuments({});
    const todayLeads = await User.countDocuments({ createdAt: { $gte: startOfToday } });
    const monthLeads = await User.countDocuments({ createdAt: { $gte: startOfMonth } });

    const webLeads = await User.countDocuments({ source: "web" });
    const appLeads = await User.countDocuments({ source: "app" });

    const followedUpCount = await User.countDocuments({ followedUp: true });
    const pendingFollowUpCount = await User.countDocuments({ followedUp: { $ne: true } });

    res.json({
      success: true,
      stats: {
        totalLeads,
        todayLeads,
        monthLeads,
        sources: {
          web: webLeads,
          app: appLeads
        },
        followUp: {
          done: followedUpCount,
          pending: pendingFollowUpCount
        }
      }
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ success: false, message: "Server Error fetching statistics" });
  }
});

// @route   PUT /api/admin/leads/:id/followup
// @desc    Toggle followed-up status of a lead
// @access  Admin
router.put("/leads/:id/followup", combinedAdminAuth, async (req, res) => {
  const { id } = req.params;
  const { followedUp } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.followedUp = !!followedUp;
    await user.save();

    res.json({
      success: true,
      message: `Follow-up status updated to ${user.followedUp}`,
      user
    });
  } catch (error) {
    console.error("Error updating follow-up status:", error);
    res.status(500).json({ success: false, message: "Server error updating follow-up status", error: error.message });
  }
});

module.exports = router;
