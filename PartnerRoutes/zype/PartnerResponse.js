const mongoose = require("mongoose");

const PartnerResponseSchema = new mongoose.Schema(
  {
    // leadId: { type: String, required: true },
    partnerName:String,
    mobile: { type: String, required: true },
    apiResponse: { type: Object }, // store whole API response
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "PartnerResponse" }
);

module.exports = mongoose.model("PartnerResponse", PartnerResponseSchema);
